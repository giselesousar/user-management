import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn} from "typeorm";
import {Field, ObjectType} from 'type-graphql';

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    @Field(() => String)
    id!: string;

    @Column()
    @Field(() => String)
    firstName!: string;

    @Column()
    @Field(() => String)
    lastName!: string;

    @Column({unique: true})
    @Field(() => String)
    username!: string;

    @Column()
    @Field(() => String)
    password!: string;

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string;

}
