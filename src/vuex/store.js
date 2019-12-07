import Vue from 'vue'
import Vuex from 'vuex'
import state from './state.js'
import api_requests from './actions/api_requests.js'
import mutations from './mutations.js'
import getters from './getters.js'


Vue.use(Vuex);

const actions = {...api_requests};

let store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});

export default store;