import { get } from 'lodash'
import {
  addMember,
  checkLoginStatus,
  createMemo,
  createProject,
  createReport,
  deleteMemos,
  deleteProject,
  deleteReport,
  deleteMember,
  fetchMember,
  fetchMemos,
  fetchMemosCount,
  fetchPeopleByName,
  fetchProfile,
  fetchProjects,
  fetchProjectsCount,
  fetchReports,
  fetchReportsCount,
  fetchTags,
  getMembers,
  getMembersByName,
  getMembersCount,
  updateMemo,
  updateMember,
  updateProject,
  updateReport,
  uploadImage,
} from 'src/api'

const debug = require('debug')('CLIENT:actions')

export default {
  ADD_MEMBER: ({}, { params, }) => {
    return addMember(params)
  },
  CHECK_LOGIN_STATUS: ({ commit, dispatch, state }, { params }) => {
    return checkLoginStatus({ params }).then(({ status, body }) => {
      commit('SET_LOGGEDIN_STATUS', { status, body })
    })
  },

  CREATE_MEMO: ({ commit, state }, { params }) => {
    debug('Going to send memo creating req.')
    return createMemo({ params })
  },

  CREATE_PROJECT: ({ commit, state }, { params }) => {
    debug('Going to send proj creating req.')
    return createProject({ params })
  },

  CREATE_REPORT: ({ commit, state }, { params }) => {
    debug('Going to send report creating req.')
    return createReport({ params })
  },
  DELETE_MEMBER: ({}, { params, }) => {
    return deleteMember({ params, })
  },
  DELETE_MEMOS: ({ commit, state }, { params }) => {
    debug('Going to sen memo delete req.')
    return deleteMemos({ params }).then(() => { commit('REMOVE_MEMOS', params.ids) })
  },

  DELETE_PROJECT: ({ commit, state }, { params }) => {
    return deleteProject({ params })
  },

  DELETE_REPORT: ({ commit, state }, { params }) => {
    return deleteReport({ params })
  },

  FETCH_MEMBER: ({ commit, dispatch, state }, { params }) => {
    return fetchMember({ params }).then(({ status, body }) => {
      if (status === 200) {
        return body
      }
    })
  },

  FETCH_MEMOS: ({ commit, state }, { params }) => {
    debug('Abt to fetch data.')
    return fetchMemos({ params })
      .then((memos) => commit('SET_MEMOS', { memos }))
  },

  FETCH_MEMOS_COUNT: ({ commit, state }) => {
    return fetchMemosCount()
      .then(({ status, body }) => status === 200 && commit('SET_MEMOS_COUNT', { count: get(body, 'meta.total') }))
  },

  FETCH_PEOPLE_BY_NAME: ({ commit, state }, { params }) => {
    return fetchPeopleByName({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_PEOPLE_LIST', { people: get(body, 'items', []) })
      }
    })
  },

  FETCH_PROFILE: ({ commit, dispatch, state }, { params }) => {
    return fetchProfile({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_PROFILE', { profile: body })
      }
    })
  },

  FETCH_PROJECTS: ({ commit, state }, { params }) => {
    debug('Abt to fetch data.')
    return fetchProjects({ params })
      .then((projects) => commit('SET_PROJECTS', { projects }))
  },

  FETCH_PROJECTS_COUNT: ({ commit, state }) => {
    return fetchProjectsCount()
      .then(({ status, body }) => status === 200 && commit('SET_PROJECTS_COUNT', { count: get(body, 'meta.total') }))
  },

  FETCH_REPORTS: ({ commit, state }, { params }) => {
    debug('Abt to fetch data.')
    return fetchReports({ params })
      .then((reports) => commit('SET_REPORTS', { reports }))
  },

  FETCH_REPORTS_COUNT: ({ commit, state }, { params }) => {
    return fetchReportsCount({ params })
      .then(({ status, body }) => status === 200 && commit('SET_REPORTS_COUNT', { count: get(body, 'meta.total') }))
  },

  FETCH_TAGS: ({ commit, }, { params }) => {
    debug('Abt to fetch data.')
    return fetchTags({ params })
      .then((tags) => commit('SET_TAGS', { tags }))
  },

  GET_MEMBERS_COUNT: ({ commit, }, { params, }) => {
    return getMembersCount({ params, }).then(({ status, body, }) => {
      if (status === 200) {
        debug(`Member's count recieved.`, body)
        commit('SET_MEMBERS_COUNT', { count: get(body, 'meta.total', 0), })
      }
    })
  },

  GET_MEMBERS: ({ commit, }, { params, type, }) => {
    const process = type !== 'byname' ? getMembers : getMembersByName
    return process({ params, }).then(({ status, body, }) => {
      if (status === 200) {
        if (params.custom_editor) {
          commit('SET_CUSTOM_EDITORS', { members: body, })
        } else {
          commit('SET_MEMBERS', { members: body, })
        }
      }
    })
  },
  UPDATE_MEMBER: ({}, { params, type, }) => {
    return updateMember({ params, type, })
  },
  UPDATE_MEMO: ({ commit, state }, { params }) => {
    debug('Going to sen memo updateing req.')
    return updateMemo({ params })
  },

  UPDATE_PROJECT: ({ commit, state }, { params }) => {
    debug('Going to sen proj updateing req.')
    return updateProject({ params })
  },

  UPDATE_REPORT: ({ commit, state }, { params }) => {
    debug('Going to sen proj updateing req.')
    return updateReport({ params })
  },

  UPLOAD_IMAGE: ({ commit, dispatch }, { file, type }) => {
    return uploadImage(file, type)
  },
  UPDATE_CLIENT_SIDE: ({ commit, }) => {
    commit('SET_CLIENT_SIDE')
  },
}
