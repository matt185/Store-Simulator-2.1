import { User } from "./../entity/User";
import { MyContext } from "src/types";
import { validateRegister } from "./../utils/validationRegister";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import argon2 from "argon2"

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


    @Query(() => [User])
    async users(): Promise<User[]> {
        return await User.find()
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
}