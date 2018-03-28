const _ = require('lodash')
const { camelizeKeys } = require('humps')
const { authorize, constructScope, fetchPermissions } = require('./services/perm')
// const { verifyToken } = require('./middle/member/comm')
const CONFIG = require('./config')
const Cookies = require('cookies')
const GoogleAuth = require('google-auth-library')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const debug = require('debug')('READR:api')
const express = require('express')
const fs = require('fs')
const isProd = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'
const jwtExpress = require('express-jwt')
// const jwtService = require('./service.js')

const { fetchFromRedis, insertIntoRedis } = require('./middle/redis')

const apiHost = CONFIG.API_PROTOCOL + '://' + CONFIG.API_HOST + ':' + CONFIG.API_PORT
const router = express.Router()
const superagent = require('superagent')

const SECRET_LENGTH = 10
const authVerify = jwtExpress({ secret: CONFIG.JWT_SECRET })

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

const fetchPromise = (url, req) => {
  return new Promise((resolve, reject) => {
    superagent
    .get(`${apiHost}${url}`)
    .end((err, res) => {
      if (!err && res) {
        resolve(camelizeKeys(res.body))
      } else {
        reject(err)
        console.error(`error during fetch data from : ${url}`)
        console.error(err) 
      }
    })
  })
}

router.use('/project', require('./middle/project'))
router.use('/image-post', require('./middle/image'))

router.get('/profile', [ authVerify ], (req, res) => {
  debug('req.user')
  debug(req.user)
  const targetProfile = req.user.id
  const url = `/member/${targetProfile}`
  Promise.all([
    fetchPromise(url, req),
    fetchPermissions()
  ]).then((response) => {
    const profile = response[ 0 ][ 'items' ][ 0 ]
    const perms = response[ 1 ]
    const scopes = constructScope(perms, profile.role)
    res.json({
      name: profile.name,
      nickname: profile.nickname,
      mail: profile.mail,
      description: profile.description,
      id: profile.id,
      role: profile.role,
      scopes,
      profileImage: profile.profileImage,
      points: profile.points
    })
  }).catch((err) => {
    res.status(500).send(err)
    console.error(`error during fetch data from : ${url}`)
    console.error(err)
  })
})

router.get('/status', authVerify, function(req, res) {
  res.status(200).send(true)
})

router.route('*')
  .get(function (req, res, next) {
    debug('Abt to send req to api.')
    const url = `${apiHost}${req.url}`
    if (res.redis) {
      console.log('fetch data from Redis.', req.url)
      const resData = JSON.parse(res.redis)
      res.json(resData)
    } else {
      superagent
        .get(url)
        .timeout(
          {
            response: API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
            deadline: API_DEADLINE ? API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
          }
        )
        .end((e, r) => {
          if (!e && r) {
            const dt = JSON.parse(r.text)
            if (Object.keys(dt).length !== 0 && dt.constructor === Object) {
              res.dataString = r.text
              /**
               * if data not empty, go next to save data to redis
               * if endpoint is not /members, go next to save data to redis
               */
              if (req.url.indexOf('/members') === -1 && req.url.indexOf('/post') === -1 && req.url.indexOf('/posts') === -1 && req.url.indexOf('/tags') === -1 && req.url.indexOf('/following/byuser') === -1) {
                next()
              }
            }
            const resData = JSON.parse(r.text)
            res.json(resData)
          } else {
            res.json(e)
            console.error(`error during fetch data from : ${url}`)
            console.error(e)  
          }
        })
      }
  })
  .post(authVerify, (req, res) => {
    const url = `${apiHost}${req.url}`
     superagent
    .post(url)
    .send(req.body)
    .end((err, response) => {
      if (!err && response) {
        res.status(200).end()
      } else {
        console.log('error occurred when handling a req: ', req.url)
        console.log(err)
        res.status(500).json(err)
      }
    })
  })
  .put(authVerify, function (req, res) {
    const url = `${apiHost}${req.url}`
    debug('Got a put req', req.url)
    superagent
    .put(url)
    .send(req.body)
    .end((err, response) => {
      if (!err && response) {
        res.status(200).end()
      } else {
        res.status(500).json(err)
      }
    })
  })
  .delete(authVerify, function (req, res) {
    const url = `${apiHost}${req.url}`
    const params = req.body || {}
    superagent
    .delete(url)
    .end((err, response) => {
      if (!err && response) {
        res.status(200).end()
      } else {
        console.log('Error occurred when deleting stuff', err)
        res.status(500).json(err)
      }
    })
  })

router.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError' && req.url.indexOf('/status') === -1) {
    res.status(401).send('invalid token...')
  } else if (err && req.url.indexOf('/status') > -1) {
    if (err.name === 'UnauthorizedError') {
      res.status(200).send(false)
    } else {
      console.log('Error occurred when checking login status', err)
    }
  }
})

module.exports = router