import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      projects: [],
      memos: [],
      isLoggedIn: false,
      profile: {},
    },
    actions,
    mutations,
    getters
  })
}
