import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      customEditors: [],
      isClientSide: false,
      projects: [],
      projectsCount: 0,
      memos: [],
      memosCount: 0,
      members: [],
      membersCount: 0,
      isLoggedIn: false,
      peopleList: [],
      profile: {},
      reports: [],
      reportsCount: 0,
      tags: [],
    },
    actions,
    mutations,
    getters
  })
}
