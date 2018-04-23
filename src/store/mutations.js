import Vue from 'vue'
import { get } from 'lodash'

const debug = require('debug')('CLIENT:mutations')

export default {
  SET_ACTIVE_TYPE: (state, { type }) => {
    state.activeType = type
  },
  SET_LOGGEDIN_STATUS: (state, { status, body }) => {
    state['isLoggedIn'] = body
  },
  SET_USER: (state, { id, user }) => {
    Vue.set(state.users, id, user || false) /* false means user not found */
  },
  SET_PROFILE: (state, { profile }) => {
    state['profile'] = profile
  },
  SET_PROJECTS: (state, { projects }) => {
    state.projects = get(projects, 'body.items', [])
  },
  SET_MEMOS: (state, { memos }) => {
    state.memos = get(memos, 'body.items', [])
  },
  REMOVE_MEMOS: (state, ids) => {
    state['memos'] = state['memos'].filter(memo => !ids.includes(memo.id))
  }
}
