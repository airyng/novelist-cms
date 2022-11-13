// atm - auth token manager
import axios from 'axios'
import cookies from 'js-cookie'

export default {

  authInterceptor: null,

  getToken (tokenType = 'access') { // tokenTypes: access, refresh
    return cookies.get(tokenType + '_token')
  },

  hasToken (tokenType = 'access') { // tokenTypes: access, refresh
    return !!this.getToken(tokenType)
  },

  _setTokenToHeader (token) {
    if (!token && this.authInterceptor) {
      axios.interceptors.request.eject(this.authInterceptor)
    }
    if (token) {
      this.authInterceptor = axios.interceptors.request.use((config) => {
        config.headers.Authorization = 'Bearer ' + token
        return config
      }, function (err) {
        return Promise.reject(err)
      })
    }
  },

  setToken (tokenData) {
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
    if (!this.hasToken()) { return false }
    this._setTokenToHeader(this.getToken())
    return true
  }
}
