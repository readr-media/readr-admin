const _ = require('lodash')
const { camelizeKeys } = require('humps')
const { authorize, constructScope, fetchPermissions } = require('./services/perm')
const { sendActivationMail } = require('./middle/member/comm')
// const { verifyToken } = require('./middle/member/comm')
const CONFIG = require('./config')
const Cookies = require('cookies')
const GoogleAuth = require('google-auth-library')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const debug = require('debug')('READR-API:api')
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
router.use('/report', require('./middle/report'))
router.use('/tags', require('./middle/tags'))
router.use('/image-post', require('./middle/image'))
router.use('/members/*', authVerify)
router.use('/member/*', authVerify)

router.use('/register/admin', authVerify, (req, res, next) => {
  const url = `${apiHost}/member`
  const payload = req.body

  payload.role = payload.role || 1
  delete payload.id 

  superagent
    .post(url)
    .send(payload)
    .end((err, resp) => {
      if (!err) {
        debug('Added member by Admin successfully.')
        next()
      } else {
        res.status(resp.status).json(err)
        console.error(`Error occurred during register`)
        console.error(err)
      }
    })
}, (req, res) => {
  debug('GOIN TO SEN EMAIL')
  sendActivationMail({ id: req.body.mail, email: req.body.mail, role: _.get(req, 'body.role', 1), type: 'init', }, (e, response) => {
    if (!e && response) {
      debug('A member added by Admin')
      debug(req.body)
      res.status(200).end()
    } else {
      res.status(response.status).json(e)
      console.error(`Error occurred during register`)
      console.error(e)
    }
  })
})

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
      uuid: profile.uuid,
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

// Memos api
router.all('/memos', authVerify, (req, res, next) => {
  next()
})
router.get('/memos/count', authVerify, (req, res, next) => {
  next()
})
router.all('/memo', authVerify, (req, res, next) => {
  next()
})
router.all('/memo/:id', authVerify, (req, res, next) => {
  next()
})


router.delete('/member/:id', function (req, res) {
  const url = `${apiHost}${req.url}`
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

router.route('*')
  .get(function (req, res, next) {
    debug('Abt to send req to api.')
    const url = `${apiHost}${req.url}`
    if (res.redis) {
      const resData = JSON.parse(res.redis)
      res.json(resData)
    } else {
      superagent
        .get(url)
        .timeout(
          {
            response: CONFIG.API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
            deadline: CONFIG.API_DEADLINE ? CONFIG.API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
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
    .send(params)
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