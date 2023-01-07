// atm - auth token manager
import axios from 'axios'
import cookies from 'js-cookie'

export default {

  retrieve (tokenType = 'access') { // tokenTypes: access, refresh
    return cookies.get(tokenType + '_token')
  },

  check (tokenType = 'access') { // tokenTypes: access, refresh
    return !!this.retrieve(tokenType)
  },

  _setTokenToHeader (token) {
    // Remove previous interceptors
    if (axios.interceptors.request.handlers.length) {
      axios.interceptors.request.handlers = []
    }

    if (token) {
      axios.interceptors.request.use((config) => {
        config.headers.Authorization = 'Bearer ' + token
        return config
      }, function (err) {
        return Promise.reject(err)
      })
    }
  },

  put (tokenData) {
    if (typeof tokenData !== 'object') {
      console.error('Given argument is not an object.')
      return false
    }
    if (!tokenData.accessToken || !tokenData.refreshToken) {
      console.error('Given argument is not in token object type.')
      return false
    }

    cookies.set('access_token', tokenData.accessToken, { path: '/' })
    cookies.set('refresh_token', tokenData.refreshToken, { path: '/' })

    this._setTokenToHeader(tokenData.accessToken)
    return true
  },

  purge () {
    cookies.remove('access_token')
    cookies.remove('refresh_token')
    this._setTokenToHeader(null)
  },

  init () {
    if (!this.check()) { return false }
    this._setTokenToHeader(this.retrieve())
    return true
  },

  parse () {
    return JSON.parse(Buffer.from(this.retrieve().split('.')[1], 'base64').toString())
  }
}
