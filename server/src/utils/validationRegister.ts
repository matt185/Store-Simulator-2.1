import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput"

export const validateRegister = (input: UsernamePasswordInput) => {

    if (input.username.length < 4) {
        return [
            {
                field: "username",
                message: "username have to be at list 4 characters"
            }
        ]
    }

    if (input.username.includes('@')) {
        return [
            {
                field: "username",
                message: "username can't contain @"
            }
        ]

    }

    if (input.password.length < 4) {
        return [
            {
                field: "password",
                message: "password have to be at list 4 characters"
            }
        ]
    }
    if (!input.email.includes("@")) {
        return [
            {
                field: "email",
                message: "invalid email"
            }
        ]
    }
    return null
}