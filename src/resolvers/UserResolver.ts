import { Resolver, Mutation, Arg, Field, InputType, Query, ObjectType, Ctx } from 'type-graphql';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { User } from '../entity/User';

@InputType()
class SignupInput {

    @Field()
    firstName!: string;

    @Field()
    lastName!: string;

    @Field()
    username!: string;

    @Field()
    password!: string;
}

@InputType()
class UpdateInput {

    @Field()
    firstName!: string;

    @Field()
    lastName!: string;

    @Field()
    username!: string;

    @Field()
    password!: string;
}

@InputType()
class SigninInput {
    @Field()
    username!: string;

    @Field()
    password!: string;
}

@ObjectType()
class AuthPayload {

    @Field()
    accessToken!: string;

    @Field()
    refreshToken!: string;

}

@InputType()
class Context {

    @Field()
    id!: string

}

@Resolver()
export class UserResolver {

    @Mutation(() => User)
    async signup(
        @Arg("input", () => SignupInput) input: SignupInput
    ) {
        const userRepository = getRepository(User);

        try{
            await userRepository.findOneOrFail({where: { username: input.username }});
            throw new Error('User already exists');
        }catch(err){
            input.password = await bcrypt.hash(input.password, 10);
            const newUser = User.create(input);
            return await newUser.save();
        }
    }

    @Mutation(() => AuthPayload)
    async signin(
        @Arg("input", () => SigninInput) input: SigninInput
    ) {
        const userRepository = getRepository(User);

        try{
            await userRepository.findOneOrFail({where: { username: input.username }});
            throw new Error('User already exists');
        }catch(err){
            const newUser = User.create(input);
            return await newUser.save();
        }
    }

    @Mutation(() => Boolean)
    async deleteUser(
        @Arg("id", () => String) id: string
    ){
        const userRepository = getRepository(User);
        const user = userRepository.findOne(id);

        if(!user) throw new Error('User not found');

        User.delete(id);

        return true;
    }

    @Mutation(() => Boolean)
    async updateUser(
        @Arg("id", () => String) id: string,
        @Arg("input", () => UpdateInput) input: UpdateInput
    ){
        const userRepository = getRepository(User);
        const user = userRepository.findOne(id);

        if(!user) throw new Error('User not found');

        User.update(id, input);

        return true;
    }

    @Query(() => User)
    async user(
        @Ctx() ctx: Context
    ){
        const userRepository = getRepository(User);
        const user = userRepository.findOne({id: ctx.id});

        if(!user) throw new Error('User not found');

        return user;
    }

}
