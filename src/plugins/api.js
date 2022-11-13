// backend api calls
import axios from 'axios'

console.log(process.env)
const backendURL = process.env.VUE_APP_API_BACKEND_URL
const objectStorageURL = process.env.VUE_APP_API_OBJECT_STORAGE_URL

  
// TODO: Многие вещи в каждом методе повторяются. Нужно оптимизировать.
// Так же желательно выделить запросы по отдельным файлам, группируя по смыслу.
const getSex = () => {
  return axios.get(backendURL + 'sex')
    .then((response) => {
      return response.data
    }).catch((e) => {
      console.error(e)
      return false
    })
}

const getGames = () => {
  return axios.get(backendURL + 'games')
    .then((response) => {
      return response.data
    })
    .catch((e) => {
      console.error(e)
      return false
    })
}

const getGameByID = (id) => {
  return axios.get(backendURL + `games/${id}`)
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
  console.log('backendURL', backendURL)
  return axios.post(backendURL + 'login', { email, password })
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
  return axios.post(backendURL + 'token', { refresh_token: refreshToken })
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
  return axios.delete(backendURL + `logout/${refreshToken}`)
    .then(() => {
      console.log('logout success')
    })
}

const getProfile = async () => {
  try {
    const response = await axios.get(backendURL + 'profile')
    console.log('getProfile success', response.data)
    return response.data
  } catch (err) {
    console.error(err)
    return false
  }
}

const publishGame = (id) => {
  return axios.post(backendURL + 'games/publish', { id })
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
  return axios.post(backendURL + 'games/unpublish', { id })
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
  return axios.post(backendURL + 'games', game)
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
  return axios.patch(backendURL + `games/${game._id}`, game)
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
  return axios.get(backendURL + `users/${id}`)
    .then((response) => {
      console.log('getUser success', response.data)
      return response
    })
    .catch((e) => {
      console.error(e)
      return false
    })
}

const getUsers = () => {
  return axios.get(backendURL + 'users')
    .then((response) => {
      console.log('getUsers success', response.data)
      return response.data
    })
    .catch((e) => {
      console.error(e)
      return false
    })
}

const getBackgrounds = () => {
  return axios.get(backendURL + 'backgrounds')
    .then((response) => {
      console.log('getBackgrounds success', response.data)
      return response.data
    })
    .catch((e) => {
      console.error(e)
      return false
    })
}

const getTags = () => {
  return axios.get(backendURL + 'tags')
    .then((response) => {
      console.log('getTags success', response.data)
      return response.data
    })
    .catch((e) => {
      console.error(e)
      return false
    })
}

const deleteTag = (tagId) => {
  return axios.delete(backendURL + `tags/${tagId}`)
    .then((response) => {
      console.log('deleteTag success', response)
      return response
    })
    .catch((e) => {
      console.error(e)
      return e.response
    })
}

const getImageLink = (imageId) => {
  return axios.get(objectStorageURL + 'link/' + imageId)
    .then((response) => {
      console.log('getImageLink success', response)
      return response
    })
    .catch((e) => {
      console.error(e)
      return e.response
    })
}

const createTag = (data) => {
  return axios.post(backendURL + 'tags', data)
    .then((response) => {
      console.log('createTags success', response)
      return response
    })
    .catch((e) => {
      console.error(e)
      return e.response
    })
}

const updateTag = (data) => {
  return axios.patch(backendURL + `tags/${data._id}`, data)
    .then((response) => {
      console.log('updateTag success', response)
      return response
    })
    .catch((e) => {
      console.error(e)
      return e.response
    })
}

const uploadImage = (data) => {
  return axios.post(objectStorageURL + 'f', data)
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
  return axios.delete(objectStorageURL + `f/${fileId}`)
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
  return axios.patch(backendURL + `users/${data.id}`, data)
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
  backendURL,
  login,
  refresh,
  logout,
  getProfile,
  getGameByID,
  getGames,
  publishGame,
  unpublishGame,
  saveGame,
  updateGame,
  getUser,
  getUsers,
  getSex,
  uploadImage,
  deleteImage,
  updateUser,
  getImageLink,
  getBackgrounds,
  getTags,
  deleteTag,
  createTag,
  updateTag
}