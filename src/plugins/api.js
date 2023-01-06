// backend api calls
import axios from 'axios'

const backendURL = process.env.VUE_APP_API_BACKEND_URL
const objectStorageURL = process.env.VUE_APP_API_OBJECT_STORAGE_URL

export default {
  store: null, // instance initilizing outside
  config: {
    // authorization - start
    login: {
      method: 'post',
      getPath: () => `${backendURL}login`,
      returnType: 'all',
      reconnect: false
    },
    refresh: {
      method: 'post',
      getPath: () => `${backendURL}token`,
      reconnect: false
    },
    logout: {
      method: 'delete',
      getPath: (refreshToken) => `${backendURL}logout/${refreshToken}`,
      reconnect: false
    },
    // authorization - end
    // reports - start
    getReports: {
        method: 'get',
        getPath: () => `${backendURL}reports`
    },
    // reports - end
    // sex - start
    getSex: {
      method: 'get',
      getPath: () => `${backendURL}sex`
    },
    // sex - end
    // roles - start
    getRoles: {
      method: 'get',
      getPath: () => `${backendURL}roles`
    },
    // roles - end
    // games - start
    getGames: {
      method: 'get',
      getPath: () => `${backendURL}games`
    },
    getGameByID: {
      method: 'get',
      getPath: (id) => `${backendURL}games/${id}`
    },
    publishGame: {
      method: 'post',
      getPath: () => `${backendURL}games/publish`,
      returnType: 'status'
    },
    unpublishGame: {
      method: 'post',
      getPath: () => `${backendURL}games/unpublish`,
      returnType: 'status'
    },
    saveGame: {
      method: 'post',
      getPath: () => `${backendURL}games`,
      returnType: 'status'
    },
    updateGame: {
      method: 'patch',
      getPath: (id) => `${backendURL}games/${id}`,
      returnType: 'status'
    },
    // games - end
    // users - start
    getProfile: {
      method: 'get',
      getPath: () => `${backendURL}profile`
    },
    getUser: {
      method: 'get',
      getPath: (id) => `${backendURL}users/${id}`,
      returnType: 'all'
    },
    getUsers: {
      method: 'get',
      getPath: () => `${backendURL}users`
    },
    updateUser: {
      method: 'patch',
      getPath: (id) => `${backendURL}users/${id}`,
      returnType: 'all'
    },
    // users - end
    // backgrounds - start
    getBackgrounds: {
      method: 'get',
      getPath: () => `${backendURL}backgrounds`
    },
    createBackground: {
      method: 'post',
      getPath: () => `${backendURL}backgrounds`,
      returnType: 'all'
    },
    updateBackground: {
      method: 'patch',
      getPath: (id) => `${backendURL}backgrounds/${id}`,
      returnType: 'all'
    },
    deleteBackground: {
      method: 'delete',
      getPath: (id) => `${backendURL}backgrounds/${id}`,
      returnType: 'all'
    },
    // backgrounds - end
    // tags - start
    getTags: {
      method: 'get',
      getPath: () => `${backendURL}tags`
    },
    createTag: {
      method: 'post',
      getPath: () => `${backendURL}tags`,
      returnType: 'all'
    },
    updateTag: {
      method: 'patch',
      getPath: (id) => `${backendURL}tags/${id}`,
      returnType: 'all'
    },
    deleteTag: {
      method: 'delete',
      getPath: (id) => `${backendURL}tags/${id}`,
      returnType: 'all'
    },
    // tags - end
    // images links - start
    getImageLink: {
      method: 'get',
      getPath: (id) => `${objectStorageURL}link/${id}`,
      returnType: 'all'
    },
    uploadImage: {
      method: 'post',
      getPath: () => `${objectStorageURL}f`,
      returnType: 'all'
    },
    deleteImage: {
      method: 'delete',
      getPath: (id) => `${objectStorageURL}f/${id}`,
      returnType: 'all'
    }
    // images links - end
  },
  async call (name, params, payload = null) {

    const { method, getPath, reconnect = true, returnType = 'data' } = this.config[name]
  
    if (!axios[method]) {
      throw new Error('Call to undefined api method.')
    }
    
    try {
      const response = await axios[method](getPath(params), payload) // main request
      return this._responseHandler({name, returnType}, response)

    } catch(e) {
      console.error(e)
      if (![403, 401].includes(e.request.status)) { return this._responseHandler({name, returnType}, e.response) }
    }

    if (!reconnect) { return false }

    try {
     const success = await this.store.dispatch('user/refreshToken')
      if (!success) {
        await this.store.dispatch('logout')
        throw new Error('Can\'t retrieve new token by existent resfreshToken.')
      }
    } catch (e) {
      console.error(e)
    }
    try {
      const response = await axios[method](getPath(params), payload) // main request
      return this._responseHandler({name, returnType}, response)

    } catch (e) {
      console.error(e)
      return false
    }
  },
  _responseHandler (config, response) {
    
    console.log(`${config.name} success`, response?.data)
    return config.returnType === 'all' ? response : response?.[config.returnType]
  }
}