const _ = require('lodash')
const { camelizeKeys } = require('humps')
const { constructScope, fetchPermissions } = require('./services/perm')
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

const authorize = (req, res, next) => {
  const whitelist = _.get(ENDPOINT_SECURE, [ `${req.method}${req.url.replace(/\?[A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|\[\]\/\\]*$/, '')}` ])
  if (whitelist) {
    fetchPermissions().then((perms) => {
      Promise.all([
        new Promise((resolve) => (resolve(_.get(whitelist, [ 'role' ]) ? _.find(_.get(whitelist, [ 'role' ]), (r) => (r === req.user.role)) : true))),
        new Promise((resolve) => (resolve(_.get(whitelist, [ 'perm' ]) ? _.get(whitelist, [ 'perm' ]).length === _.filter(_.get(whitelist, [ 'perm' ]), (p) => (_.find(_.filter(perms, { role: req.user.role }), { object: p }))).length : true)))
      ]).then((isAuthorized) => {
        const isRoleAuthorized = isAuthorized[ 0 ]
        const isPermsAuthorized = isAuthorized[ 1 ]
        if (isRoleAuthorized && isPermsAuthorized) {
          next()
        } else {
          res.status(403).send('Forbidden. No right to access.').end()
        }
      })
    })

  } else {
    next()
  }
}


router.use('/project', require('./middle/project'))
// router.use('/activate', verifyToken, require('./middle/member/activation'))
// router.use('/initmember', authVerify, require('./middle/member/initMember'))
// router.use('/member/public', require('./middle/member'))
// router.use('/member', [ authVerify, authorize ], require('./middle/member'))
// router.use('/comment', require('./middle/comment'))
// router.use('/register', authVerify, require('./middle/member/register'))
router.use('/image-post', require('./middle/image'))

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