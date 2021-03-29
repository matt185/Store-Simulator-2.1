import { User } from "./../entity/User";
import { MyContext } from "src/types";
import { validateRegister } from "./../utils/validationRegister";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import argon2 from "argon2"
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { FORGET_PASSWORD_PREFIX, partialAuth } from "../utils/constants";


@ObjectType()
class FieldError {
    @Field()
    field: string
    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return "hello"
    }

    @Query(() => User, { nullable: true })
    async me(
        @Ctx() { req }: MyContext
    ): Promise<User | null> {
        if (!req.session.userId) {
            return null
        }
        const user = await User.findOne({ id: req.session.userId })
        return user!
    }


    @Query(() => [User], { nullable: true } || null)
    async users(
        @Ctx() { req }: MyContext
    ): Promise<User[] | null> {
        if (req.session.userId) {
            let user = await User.findOne({ where: { id: req.session.userId } })
            let isAuth = partialAuth.includes(user!.role)
            if (isAuth) {
                return await User.find({
                    order: {
                        id: "DESC"
                    }
                })
            }
        }
        return null

    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("input", () => UsernamePasswordInput) input: UsernamePasswordInput,
        // @Ctx() { req }: MyContext
    ): Promise<UserResponse> {

        const errors = validateRegister(input)
        if (errors) {
            return { errors }
        }

        const hashedPsw = await argon2.hash(input.password)

        try {
            await User.create({ username: input.username, email: input.email, password: hashedPsw, role: input.role, phone: input.phone }).save()
        } catch (err) {
            if (err.code === '23505' || err.detail.includes("already exists")) {
                return {
                    errors: [{
                        field: "username",
                        message: "username already exist"
                    }]
                }
            }
        }
        let user = await User.findOne({ username: input.username })
        return { user: user }
    }

    @Mutation(() => UserResponse)

    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne(
            usernameOrEmail.includes('@') ? { where: { email: usernameOrEmail } } : { where: { username: usernameOrEmail } }
        );
        if (!user) {
            return {
                errors: [{
                    field: "usernameOrEmail",
                    message: "user doesn't exist"
                }]
            }
        }
        const valid = await argon2.verify(user.password, password)

        if (!valid) {
            return {
                errors: [{
                    field: "password",
                    message: "incorrect password"
                }]

            }
        }
        req.session.userId = user.id
        return { user }
    }

    @Mutation(() => Boolean)
    async logout(
        @Ctx() { req, res }: MyContext
    ): Promise<Boolean> {
        return new Promise((resolve) => {
            req.session.destroy((err) => {
                res.clearCookie(process.env.COOKIE_NAME!)
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                resolve(true)
            })
        })
    }
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string,
        @Ctx() { redis, }: MyContext
    ) {

        const user = await User.findOne({ email })

        if (!user) {
            return true
        }
        const token = v4()
        await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, "ex", 1000 * 60 * 60 * 24)

        await sendEmail(email, `<a href="http://localhost:8080/#/change-password/${token}">reset password</a>`)
        return true
    }

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("token") token: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() { redis, req }: MyContext
    ): Promise<UserResponse> {
        const key = FORGET_PASSWORD_PREFIX + token
        const userId = await redis.get(key)

        if (!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "invalid token"
                    }
                ]
            }
        }

        const user = await User.findOne({ where: { id: parseInt(userId) } })
        if (!user) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "user no longer exist"
                    }
                ]
            }
        }
        const hashedPsw = await argon2.hash(newPassword)

        user.password = hashedPsw
        await User.save(user)
        req.session.userId = user.id
        await redis.del(key)
        return { user }

    }

}