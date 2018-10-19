import { get } from 'lodash'

const debug = require('debug')('CLIENT:mutations')

export default {
  SET_CLIENT_SIDE: (state) => {
    state['isClientSide'] = true
  },
  SET_LOGGEDIN_STATUS: (state, { status, body }) => {
    state['isLoggedIn'] = body
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
  SET_TAGS: (state, { tags }) => {
    state.tags = get(tags, 'body.items', [])
  },
  SET_MEMOS: (state, { memos }) => {
    state.memos = get(memos, 'body.items', [])
  },
  SET_MEMOS_COUNT: (state, { count }) => {
    state.memosCount = count
  },
  SET_CUSTOM_EDITORS: (state, { members, }) => {
    state['customEditors'] = members
  },
  SET_MEMBERS_COUNT: (state, { count, }) => {
    state['membersCount'] = count
  },
  SET_MEMBERS: (state, { members, }) => {
    state['members'] = members
  },
  REMOVE_MEMOS: (state, ids) => {
    state['memos'] = state['memos'].filter(memo => !ids.includes(memo.id))
  }
}
