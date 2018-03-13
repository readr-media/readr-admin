import { camelizeKeys } from 'humps'
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
        const where = _.mapValues(params[ele], (value) => {
          value = Array.isArray(value) ? value : [ value ]
          return { '$in': value }
        })
        Object.keys(where).forEach((key) => {
          query[key] = JSON.stringify(where[key])
        })
      } else if (ele === 'ids') {
        query[ele] = JSON.stringify(params[ele])
      } else {
        query[ele] = params[ele]
      }
    }
  })
  query = qs.stringify(query)
  debug('Query build done.')
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

export function fetchProjects ({ params }) {
  let url = `${host}/api/project/list`
  const query = _buildQuery(params)
  if (query && (query.length > 0)) {
    url = url + `?${query}`
  }
  debug('Abt to fetch data:', url)
  return _doFetch(url)
}