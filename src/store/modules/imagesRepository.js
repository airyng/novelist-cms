import api from '@/plugins/api'


export default {
  namespaced: true,
  state: {
    list: {}
  },
  getters: {},
  mutations: {
    addToList (state, payload) {
      state.list[payload[0]] = payload[1]
    }
  },
  actions: {
    async linkFetch ({ commit, state }, imageId) {
      if (state.list[imageId]) { return state.list[imageId] }
  
      const getImageLinkResponse = await api.call('getImageLink', imageId)
  
      if (getImageLinkResponse.status === 200) {
        commit('addToList', [imageId, getImageLinkResponse.data])
        return getImageLinkResponse.data
      }
      return null
    }
}
}
