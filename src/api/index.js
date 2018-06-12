import { camelizeKeys, decamelizeKeys } from 'humps'
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
  const whitelist = [
    'where',
    'max_result',
    'page',
    'sort',
    'sorting',
    'ids',
    'custom_editor',
    'updated_by',
    'keyword',
    'stats',
    'role',
    'fields'
  ]
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
      } else if (ele === 'ids' || ele === 'fields') {
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
      .send(decamelizeKeys(params))
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
      .send(decamelizeKeys(params))
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve({ status: res.status, body: camelizeKeys(res.body) })
        }
      })
  })
}

function _doDelete (url, params) {
  return new Promise((resolve, reject) => {
    superagent
      .delete(url)
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

export function createReport ({ params }) {
  return _doPost(`${host}/api/report/create`, params)
}

export function fetchPeopleByName ({ params }) {
  let url = `${host}/api/members/nickname`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doFetchStrict(url, {})
}

export function fetchProjects ({ params }) {
  let url = `${host}/api/project/list`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  debug('params', params)
  debug('Abt to fetch data:', url)
  return _doFetchStrict(url, {})
}

export function fetchReports ({ params }) {
  let url = `${host}/api/report/list`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  debug('params', params)
  debug('Abt to fetch data:', url)
  return _doFetchStrict(url, {})
}

export function getMemosCount () {
  let url = `${host}/api/memos/count`
  return _doFetchStrict(url, {})
}

export function getProjectsCount () {
  let url = `${host}/api/project/count`
  return _doFetchStrict(url, {})
}

export function getReportsCount ({ params }) {
  let url = `${host}/api/report/count`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  debug('params', params)
  debug('Abt to fetch data:', url)
  return _doFetchStrict(url, {})
}

export function getProfile ({ params = {}}) {
  const url = `${host}/api/profile`
  return _doFetchStrict(url, { cookie: params.cookie })
}

export function getMember ({ params }) {
  let url = `${host}/api/member`
  if (params && params.id) {
    url += `/${params.id}`
  }
  debug('Abt to fetch data:', url)
  return _doFetchStrict(url, {})
}

export function updateProject ({ params }) {
  return _doPut(`${host}/api/project/update`, params)
}

export function updateReport ({ params }) {
  return _doPut(`${host}/api/report/update`, params)
}

export function uploadImage (file, type) {
  let url
  debug('Abt to send uploading image req.')
  debug('file', file)
  return new Promise((resolve, reject) => {
    if (type === 'member') {
      url = `${host}/api/image-member/member`
    } else if (type === 'post') {
      url = `${host}/api/image-post/post`
    } else {
      reject()
    }
    superagent
      .post(url)
      .set('Authorization', `Bearer ${getToken()}`)
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

export function createMemo ({ params }) {
  return _doPost(`${host}/api/memo`, params)
}

export function fetchMemos ({ params }) {
  let url = `${host}/api/memos`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  debug('params', params)
  debug('Abt to fetch data:', url)
  return _doFetchStrict(url, { cookie: params.cookie })
}

export function updateMemo ({ params }) {
  return _doPut(`${host}/api/memo`, params)
}

export function deleteMemos ({ params }) {
  return _doDelete(`${host}/api/memos`, params)
}

export function deleteProject ({ params }) {
  return _doDelete(`${host}/api/project`, params)
}

export function deleteReport ({ params }) {
  return _doDelete(`${host}/api/report`, params)
}
