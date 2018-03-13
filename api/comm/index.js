const { get } = require('lodash')
const debug = require('debug')('READR:api:comm')

const handlerError = (err, res) => {
  debug('err:')
  debug(err)
  return {
    status: get(res, 'status') || get(err, 'status') || 500,
    text: get(err, 'message', '')
  }
}
module.exports = {
  handlerError
}
