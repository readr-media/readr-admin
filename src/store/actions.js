import _ from 'lodash'
import {
  checkLoginStatus,
  createProject,
  deleteProject,
  fetchPeopleByName,
  fetchProjects,
  getProfile,
  updateProject,
  uploadImage,
  createMemo,
  fetchMemos,
  updateMemo,
  deleteMemos,
} from 'src/api'

const debug = require('debug')('CLIENT:actions')

export default {
  // // ensure data for rendering given list type
  // FETCH_LIST_DATA: ({ commit, dispatch, state }, { type }) => {
  //   commit('SET_ACTIVE_TYPE', { type })
  //   return fetchIdsByType(type)
  //     .then(ids => commit('SET_LIST', { type, ids }))
  //     .then(() => dispatch('ENSURE_ACTIVE_ITEMS'))
  // },

  // // ensure all active items are fetched
  // ENSURE_ACTIVE_ITEMS: ({ dispatch, getters }) => {
  //   return dispatch('FETCH_ITEMS', {
  //     ids: getters.activeIds
  //   })
  // },

  // FETCH_ITEMS: ({ commit, state }, { ids }) => {
  //   // on the client, the store itself serves as a cache.
  //   // only fetch items that we do not already have, or has expired (3 minutes)
  //   const now = Date.now()
  //   ids = ids.filter(id => {
  //     const item = state.items[id]
  //     if (!item) {
  //       return true
  //     }
  //     if (now - item.__lastUpdated > 1000 * 60 * 3) {
  //       return true
  //     }
  //     return false
  //   })
  //   if (ids.length) {
  //     return fetchItems(ids).then(items => commit('SET_ITEMS', { items }))
  //   } else {
  //     return Promise.resolve()
  //   }
  // },

  // FETCH_USER: ({ commit, state }, { id }) => {
  //   return state.users[id]
  //     ? Promise.resolve(state.users[id])
  //     : fetchUser(id).then(user => commit('SET_USER', { id, user }))
  // },

  CHECK_LOGIN_STATUS: ({ commit, dispatch, state }, { params }) => {
    return checkLoginStatus({ params }).then(({ status, body }) => {
      commit('SET_LOGGEDIN_STATUS', { status, body })
    })
  },

  CREATE_PROJECT: ({ commit, state }, { params }) => {
    debug('Going to send proj creating req.')
    return createProject({ params })
  },

  DELETE_PROJECT: ({ commit, state }, { params }) => {
    return deleteProject({ params })
  },

  FETCH_PEOPLE_BY_NAME: ({ commit, state }, { params }) => {
    return fetchPeopleByName({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_PEOPLE_LIST', { people: _.get(body, 'items', []) })
      }
    })
  },

  FETCH_PROJECTS: ({ commit, state }, { params }) => {
    debug('Abt to fetch data.')
    return fetchProjects({ params })
      .then((projects) => commit('SET_PROJECTS', { projects }))
  },

  GET_PROFILE: ({ commit, dispatch, state }, { params }) => {
    return getProfile({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_PROFILE', { profile: body })
      }
    })
  },

  UPDATE_PROJECT: ({ commit, state }, { params }) => {
    debug('Going to sen proj updateing req.')
    return updateProject({ params })
  },

  UPLOAD_IMAGE: ({ commit, dispatch }, { file, type }) => {
    return uploadImage(file, type)
  },

  CREATE_MEMO: ({ commit, state }, { params }) => {
    debug('Going to send memo creating req.')
    return createMemo({ params })
  },
  FETCH_MEMOS: ({ commit, state }, { params }) => {
    debug('Abt to fetch data.')
    return fetchMemos({ params })
      .then((memos) => commit('SET_MEMOS', { memos }))
  },
  UPDATE_MEMO: ({ commit, state }, { params }) => {
    debug('Going to sen memo updateing req.')
    return updateMemo({ params })
  },
  DELETE_MEMOS: ({ commit, state }, { params }) => {
    debug('Going to sen memo delete req.')
    return deleteMemos({ params }).then(() => { commit('REMOVE_MEMOS', params.ids) })
  },
}
