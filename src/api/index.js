import qs from 'qs'
import superagent from 'superagent'
import { camelizeKeys, decamelize, decamelizeKeys } from 'humps'
import { getHost } from 'src/util/comm'
import { getToken } from '../util/services'
import { get, mapValues } from 'lodash'

const debug = require('debug')('CLIENT:api')
const host = getHost()

function _buildQuery (params = {}) {
  let query = {}
  debug('Query is going to build.')
  // Use camelCase
  const whitelist = [
    'fields',
    'ids',
    'keyword',
    'maxResult',
    'memberId',
    'page',
    'sort',
    'where',
    'custom_editor',
  ]
  whitelist.forEach((ele) => {
    if (params.hasOwnProperty(ele)) {
      if (ele === 'where') {
        debug('where', params)
        const where = mapValues(params[ele], (value) => {
          value = Array.isArray(value) ? value : [ value ]
          debug('value', value)
          return { '$in': value }
        })
        debug('where', where)
        Object.keys(where).forEach((key) => {
          query[decamelize(key)] = JSON.stringify(where[key])
        })
        debug('query', query)
      } else if (params[ele]) {
        query[decamelize(ele)] = Array.isArray(params[ele]) ? JSON.stringify(params[ele]) : params[ele]
      }
    }
  })
  query = qs.stringify(query)
  debug('Query build done.', query)
  return query
}

export function constructUrlWithQuery (url, params) {
  const _query = _buildQuery(params)
  let _url = url
  if (_query && (_query.length > 0)) {
    _url = _url + `?${_query}`
  }
  return _url
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

export function addMember (params) {
  const url = `${host}/api/register/admin`
  params.register_mode = 'ordinary'
  params.id = params.email
  params.mail = params.email
  params.active = 0
  return _doPost(url, params)
    .then(res => ({ status: res.status, }))
    .catch(err => {
      return Promise.reject(get(JSON.parse(get(err, 'response.text')), 'response.text'))
    })
}

export function checkLoginStatus ({ params = {}}) {
  debug('Going to send req to check status...')
  const url = `${host}/api/status`
  return _doFetchStrict(url, { cookie: params.cookie })
}

export function createMemo ({ params }) {
  return _doPost(`${host}/api/memo`, params)
}

export function createProject ({ params }) {
  return _doPost(`${host}/api/project/create`, params)
}

export function createReport ({ params }) {
  return _doPost(`${host}/api/report/create`, params)
}

export function deleteMember ({ params, }) {
  const url = `${host}/api/member/${params.id}`
  return _doDelete(url, {})
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

export function fetchMember ({ params }) {
  let url = `${host}/api/member`
  if (params && params.id) {
    url += `/${params.id}`
  }
  debug('Abt to fetch data:', url)
  return _doFetchStrict(url, {})
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

export function fetchMemosCount () {
  let url = `${host}/api/memos/count`
  return _doFetchStrict(url, {})
}

export function fetchPeopleByName ({ params }) {
  let url = `${host}/api/members/nickname`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  return _doFetchStrict(url, {})
}

export function fetchProfile ({ params = {}}) {
  const url = `${host}/api/profile`
  return _doFetchStrict(url, { cookie: params.cookie })
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

export function fetchProjectsCount () {
  let url = `${host}/api/project/count`
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

export function fetchReportsCount ({ params }) {
  let url = `${host}/api/report/count`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  debug('params', params)
  debug('Abt to fetch data:', url)
  return _doFetchStrict(url, {})
}

export function fetchTags ({ params }) {
  let url = `${host}/api/tags`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  debug('params', params)
  debug('Abt to fetch data:', url)
  return _doFetchStrict(url, {})
}

export function getMembers ({ params, }) {
  const url = constructUrlWithQuery(`${host}/api/members`, params)
  return _doFetchStrict(url, {})
}


export function getMembersByName ({ params, }) {
  const url = constructUrlWithQuery(`${host}/api/members/nickname`, params)
  return _doFetchStrict(url, {})
}

export function getMembersCount () {
  let url = `${host}/api/members/count`
  return _doFetchStrict(url, {})
}

export function updateMember ({ params, type, }) {
  const url = type !== 'role' ? `${host}/api/member` : `${host}/api/member/role`
  return _doPut(url, params)
    .then(res => ({ status: res.status, }))
    .catch(err => err)
}

export function updateMemo ({ params }) {
  return _doPut(`${host}/api/memo`, params)
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
