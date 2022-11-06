// backend api calls
import axios from 'axios'

const getBackendURL = () => process.env.API_BACKEND_URL
const getObjectStorageURL = () => process.env.API_OBJECT_STORAGE_URL

  
// TODO: Многие вещи в каждом методе повторяются. Нужно оптимизировать.
// Так же желательно выделить запросы по отдельным файлам, группируя по смыслу.
const getSexes = () => {
  return axios.get(getBackendURL() + 'sex')
    .then((response) => {
      return response.data
    }).catch((e) => {
      console.error(e)
      return false
    })
}

const getGames = () => {
  return axios.get(getBackendURL() + 'games')
    .then((response) => {
      return response.data
    })
    .catch((e) => {
      console.error(e)
      return false
    })
}

const getGameByID = (id) => {
  return axios.get(getBackendURL() + `games/${id}`)
    .then((response) => {
      console.log('getGameByID success', response.data)
      return response.data
    })
    .catch((e) => {
      console.error(e)
      return false
    })
}

const login = ({ email, password }) => {
  return axios.post(getBackendURL() + 'login', { email, password })
    .then((response) => {
      console.log('login success', response.data)
      return response
    })
    .catch((e) => {
      console.error(e)
      return e.response
    })
}

const refresh = (refreshToken) => {
  return axios.post(getBackendURL() + 'token', { refresh_token: refreshToken })
    .then((response) => {
      console.log('login refresh success', response.data)
      return response.data
    })
    .catch((e) => {
      console.error(e)
      return false
    })
}

const logout = (refreshToken) => {
  return axios.delete(getBackendURL() + `logout/${refreshToken}`)
    .then(() => {
      console.log('logout success')
    })
}

const getProfile = async () => {
  try {
    const response = await axios.get(getBackendURL() + 'profile')
    console.log('getProfile success', response.data)
    return response.data
  } catch (err) {
    console.error(err)
    return false
  }
}

const publishGame = (id) => {
  return axios.post(getBackendURL() + 'games/publish', { id })
    .then((response) => {
      console.log('publishGame success', response.data)
      return response.status
    })
    .catch((e) => {
      console.error(e)
      return e.response.status
    })
}

const unpublishGame = (id) => {
  return axios.post(getBackendURL() + 'games/unpublish', { id })
    .then((response) => {
      console.log('unpublishGame success', response.data)
      return response.status
    })
    .catch((e) => {
      console.error(e)
      return e.response.status
    })
}

const saveGame = (game) => {
  return axios.post(getBackendURL() + 'games', game)
    .then((response) => {
      console.log('saveGame success', response.data)
      return response.status
    })
    .catch((e) => {
      console.error(e)
      return e.response.status
    })
}

const updateGame = (game) => {
  return axios.patch(getBackendURL() + `games/${game._id}`, game)
    .then((response) => {
      console.log('saveGame success', response.data)
      return response.status
    })
    .catch((e) => {
      console.error(e)
      return e.response.status
    })
}

const getUser = (id) => {
  return axios.get(getBackendURL() + `users/${id}`)
    .then((response) => {
      console.log('getUser success', response.data)
      return response
    })
    .catch((e) => {
      console.error(e)
      return false
    })
}

const getImageLink = (imageId) => {
  return axios.get(getObjectStorageURL() + 'link/' + imageId)
    .then((response) => {
      console.log('getImageLink success', response)
      return response
    })
    .catch((e) => {
      console.error(e)
      return e.response
    })
}

const uploadImage = (data) => {
  return axios.post(getObjectStorageURL() + 'f', data)
    .then((response) => {
      console.log('uploadImage success', response)
      return response
    })
    .catch((e) => {
      console.error(e)
      return e.response
    })
}

const deleteImage = (fileId) => {
  return axios.delete(getObjectStorageURL() + `f/${fileId}`)
    .then((response) => {
      console.log('deleteImage success', response)
      return response
    })
    .catch((e) => {
      console.error(e)
      return e.response
    })
}

const updateUser = (data) => {
  return axios.patch(getBackendURL() + `users/${data.id}`, data)
    .then((response) => {
      console.log('updateUser success', response)
      return response
    })
    .catch((e) => {
      console.error(e)
      return e.response
    })
}

export default {
    // put list of methods here...
    login,
    refresh,
    logout,
    getProfile,
    getBackendURL,
    getGameByID,
    getGames,
    publishGame,
    unpublishGame,
    saveGame,
    updateGame,
    getUser,
    getSexes,
    uploadImage,
    deleteImage,
    updateUser,
    getImageLink
}