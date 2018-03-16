import {
  createProject,
  fetchPeopleByName,
  fetchProjects,
  updateProject
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

  CREATE_PROJECT: ({ commit, state }, { params }) => {
    debug('Going to send proj creating req.')
    return createProject({ params })
  },

  FETCH_PEOPLE_BY_NAME: ({ commit, state }, { params }) => {
    return fetchPeopleByName({ params })
  },

  FETCH_PROJECTS: ({ commit, state }, { params }) => {
    debug('Abt to fetch data.')
    return fetchProjects({})
      .then((projects) => commit('SET_PROJECTS', { projects }))
  },

  UPDATE_PROJECT: ({ commit, state }, { params }) => {
    debug('Going to sen proj updateing req.')
    return updateProject({ params })
  }
}
