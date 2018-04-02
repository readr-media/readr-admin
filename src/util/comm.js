import { SITE_ROOT, } from 'api/config.js'
const debug = require('debug')('CLIENT:comm')

export function getHost () {
  const browser = typeof window !== 'undefined'
  if (browser) {
    debug('api host', `//${location.host}${SITE_ROOT ? '/' + SITE_ROOT : ''}`)
    return `//${location.host}${SITE_ROOT ? '/' + SITE_ROOT : ''}`
  } else {
    const host = process.env.HOST || 'localhost'
    const port = parseInt(process.env.PORT) || 8080
    return `${host}:${port}`
  }
}
export function isDescendant (child, { parentClassname = 'none', parant }) {
  let node = child.parentNode 
  while (node !== null && node !== undefined) {
    if ((node.className && node.className.indexOf(parentClassname) > -1) || node === parant) {
      return true
    }
    node = node.parentNode
  }
  return false
}
