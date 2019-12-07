import axios from 'axios'

export default {
    GET_USERS_FROM_API({commit}) {
        return axios('http://localhost:3000/users', {
            method: 'GET'
        })
            .then((response) => {
            commit('SET_USERS_TO_STORE', response.data)
        })
    }
}