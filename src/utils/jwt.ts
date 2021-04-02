import * as jsonwebtoken from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

export const createTokens = async (id: String) => {
    const accessToken = await jsonwebtoken.sign(
        { id },
        process.env.JWT_SECRET || '',
        { expiresIn: '20m' }
    )

    const refreshToken = await jsonwebtoken.sign(
        { id },
        process.env.JWT_SECRET || '',
        { expiresIn: '7d' }
    )

    return { accessToken, refreshToken };
}

export const refreshTokens = async (refreshToken: string) => {

}

export const decodeToken = async (token: string) => {

    try{
        const user: any = await jsonwebtoken.verify(token, process.env.JWT_SECRET || '');

        const userRepository = getRepository(User);

        const userDatabse = await userRepository.findOne(user.id);

        if(!userDatabse) throw new Error('User not found')
        
        return user.id;
    }catch(err){
        throw err;
    }
    
}