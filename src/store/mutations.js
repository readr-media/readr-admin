import Vue from 'vue'
import { get } from 'lodash'

const debug = require('debug')('CLIENT:mutations')

export default {
  SET_ACTIVE_TYPE: (state, { type }) => {
    state.activeType = type
  },
  SET_USER: (state, { id, user }) => {
    Vue.set(state.users, id, user || false) /* false means user not found */
  },
  SET_PROJECTS: (state, { projects }) => {
    debug('projects')
    debug(projects)
    state.projects = get(projects, 'body.items', [])
  }
}
