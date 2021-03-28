import graphqlClient from '../apollo';
import gql from "graphql-tag"
export default {
    namespaced: true,
    state: () => ({
        user: ""
    }),
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        logout(state) {
            state.user = ""
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
            // commit(`setIsAuth`, user)
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
        }
    },
    getters: {}
}