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
  SET_PEOPLE_LIST: (state, { people }) => {
    state['peopleList'] = people
  },
  SET_PROFILE: (state, { profile }) => {
    state['profile'] = profile
  },
  SET_PROJECTS: (state, { projects }) => {
    state.projects = get(projects, 'body.items', [])
  },
  SET_PROJECTS_COUNT: (state, { count }) => {
    state.projectsCount = count
  },
  SET_REPORTS: (state, { reports }) => {
    state.reports = get(reports, 'body.items', [])
  },
  SET_REPORTS_COUNT: (state, { count }) => {
    state.reportsCount = count
  },
  SET_MEMOS: (state, { memos }) => {
    state.memos = get(memos, 'body.items', [])
  },
  SET_MEMOS_COUNT: (state, { count }) => {
    state.memosCount = count
  },
  REMOVE_MEMOS: (state, ids) => {
    state['memos'] = state['memos'].filter(memo => !ids.includes(memo.id))
  }
}
