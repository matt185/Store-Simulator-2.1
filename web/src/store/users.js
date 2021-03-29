import graphqlClient from '../apollo';
import gql from "graphql-tag"
import isAuth from "../utils/isAuth"
export default {
    namespaced: true,
    state: () => ({
        users: [],
        user: "",
        isLogged: false,
        auth: false
    }),
    mutations: {
        setUser(state, user) {
            state.user = user
            state.isLogged = true
            state.auth = isAuth(user.user.role)
        },
        logout(state) {
            state.user = ""
            state.isLogged = false
            state.auth = false
        },
        setUsers(state, users) {
            state.users = users
        }

    },
    actions: {
        async login({
            commit
        }, input) {
            let response = await graphqlClient.mutate({
                mutation: gql `
            mutation login ($usernameOrEmail:String!, $password:String!){
                login(usernameOrEmail:$usernameOrEmail,password:$password){
                      user {
                        username
                        role
                      }
                      errors {
                        field
                        message
                      }
                }
            }`,
                variables: {
                    usernameOrEmail: input.usernameOrEmail,
                    password: input.password
                }
            })
            const user = response.data.login
            commit('setUser', user)
        },
        async changePsw({
            commit
        }, input) {
            let response = await graphqlClient.mutate({
                mutation: gql `
            mutation changePassword ($token:String!, $newPassword:String!){
                changePassword(token:$token,newPassword:$newPassword){
                      user {
                        username
                        role
                      }
                      errors {
                        field
                        message
                      }
                }
            }`,
                variables: {
                    token: input.token,
                    newPassword: input.newPassword
                }
            })
            let user = response.data.changePassword
            commit('setUser', user)
        },
        async logout({
            commit
        }) {
            await graphqlClient.mutate({
                mutation: gql `
                     mutation logout{
                         logout
                     }
                `
            })
            commit('logout')
        },
        async users({
            commit
        }) {
            const response = await graphqlClient.query({
                query: gql `
                query users{
                    users{
                        id
                        username
                        phone
                        role
                        createdAt
                        updatedAt
                    }
                }`
            })
            const users = response.data.users
            console.log(users)
            commit("setUsers", users)
        }
    },
    getters: {}
}