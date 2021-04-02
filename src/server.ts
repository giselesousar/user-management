import express, { response } from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import {GraphQLError} from 'graphql';
import {createTokens, decodeToken} from './utils/jwt'
import path from 'path';

export const startServer = async () => {
    const app = express();
    app.use(
        cors({
            origin: "*",
            credentials: true
        })
    );
    
    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [path.join(__dirname, '/resolvers/**/**.ts')],
            validate: false, // error class-validator
        }),
        introspection: process.env.ENVIROMENT === 'PROD' ? false : true,
        debug: process.env.ENVIROMENT === 'PROD' ? false : true,
        formatError: (err) => {
            if (process.env.ENVIROMENT !== 'PROD') return err;
            const error = new GraphQLError(err.message)
            return error;
        },
        context: ({req, res}) => {

            const accessToken = req.headers['x-access-token'];

            if(!accessToken) throw new Error('Access token is missing');

            try{
                const userId = decodeToken(String(accessToken));
                return {id: userId};
            }catch(err){
                if(err.message === 'User not found') throw err;

                const refreshToken = req.headers['x-refresh-token'];

                if(!refreshToken) throw new Error('Refresh token is missing');

                try{
                    const userId = decodeToken(String(refreshToken));
                    const AuthPayload:any = createTokens(String(userId));

                    res.header('x-access-token', AuthPayload.accessToken);
                    res.header('x-refresh-token', AuthPayload.refreshToken);
                    
                    return {id: userId};
                }catch(err){
                    if(err.name === 'TokenExpiredError') throw new Error('Login timeout expired');
                    if(err.name === 'JsonWebTokenError') throw new Error('Refresh token error');
                    throw err;
                }
            }
        }
    })

    server.applyMiddleware({app, path: '/graphql'});

    return app;
}