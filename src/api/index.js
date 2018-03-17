import { camelizeKeys } from 'humps'
import { delInitMemToken, getToken, getSetupToken, saveToken } from '../util/services'
import { getHost } from 'src/util/comm'
import _ from 'lodash'
import qs from 'qs'
import superagent from 'superagent'

const debug = require('debug')('CLIENT:api')
const host = getHost()

function _buildQuery (params = {}) {
  let query = {}
  debug('Query is going to build.')
  const whitelist = [ 'where', 'max_result', 'page', 'sort', 'sorting', 'ids', 'custom_editor', 'updated_by', 'keyword', 'stats', 'role' ]
  whitelist.forEach((ele) => {
    if (params.hasOwnProperty(ele)) {
      if (ele === 'where') {
        debug('where', params)
        const where = _.mapValues(params[ele], (value) => {
          value = Array.isArray(value) ? value : [ value ]
          debug('value', value)
          return { '$in': value }
        })
        debug('where', where)
        Object.keys(where).forEach((key) => {
          query[key] = JSON.stringify(where[key])
        })
        debug('query', query)
      } else if (ele === 'ids') {
        query[ele] = JSON.stringify(params[ele])
      } else {
        query[ele] = params[ele]
      }
    }
  })
  query = qs.stringify(query)
  debug('Query build done.', query)
  return query
}

function _doFetch (url) {
  debug('Abt to fetch data:', url)
  return new Promise((resolve, reject) => {
    superagent
    .get(url)
    .end(function (err, res) {
      if (err) {
        reject(err)
      } else {
        if (res.text === 'not found') {
          reject(res.text)
        } else {
          resolve({ status: res.status, body: camelizeKeys(res.body) })
        }
      }
    })
  })
}

function _doFetchStrict (url, { cookie }) {
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .set('Authorization', `Bearer ${cookie || getToken()}`)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve({ status: res.status, body: camelizeKeys(res.body) })
        }
      })
  })
}

function _doPost (url, params, token) {
  return new Promise((resolve, reject) => {
    superagent
      .post(url)
      .set('Authorization', `Bearer ${token || getToken()}`)
      .send(params)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve({ status: res.status, body: camelizeKeys(res.body) })
        }
      })
  })
}

function _doPut (url, params) {
  return new Promise((resolve, reject) => {
    superagent
      .put(url)
      .set('Authorization', `Bearer ${getToken()}`)
      .send(params)
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve({ status: res.status, body: camelizeKeys(res.body) })
        }
      })
  })
}

export function checkLoginStatus ({ params = {}}) {
  debug('Going to send req to check status...')
  const url = `${host}/api/status`
  return _doFetchStrict(url, { cookie: params.cookie })
}

export function createProject ({ params }) {
  return _doPost(`${host}/api/project/create`, params)
}

export function fetchPeopleByName ({ params }) {
  let url = `${host}/api/members`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  // return _doFetch(url)
  debug('fetchPeopleByName:url', url)
  return Promise.resolve({ status: 'ok' })
}

export function fetchProjects ({ params }) {
  let url = `${host}/api/project/list`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  debug('Abt to fetch data:', url)
  return _doFetch(url)
}

export function getProfile ({ params = {}}) {
  const url = `${host}/api/profile`
  return _doFetchStrict(url, { cookie: params.cookie })
}

export function updateProject ({ params }) {
  return _doPut(`${host}/api/project/update`, params)
}

export function uploadImage (file, type) {
  let url
  debug('Abt to send uploading image req.')
  debug('file', file)
  return new Promise((resolve, reject) => {
    if (type === 'member') {
      url = `${host}/api/image-member`
    } else if (type === 'post') {
      url = `${host}/api/image-post`
    } else {
      reject()
    }
    superagent
      .post(url)
      // .set('Authorization', `Bearer ${getToken()}`)
      .send(file)
      .end((err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
  })
}