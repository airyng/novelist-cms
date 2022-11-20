import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import dictionaries from '@/store/modules/dictionaries'
import imagesRepository from '@/store/modules/imagesRepository'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false
  },
  mutations: {
    setProperty (state, payload) {
      state[payload[0]] = payload[1]
    }
  },
  actions: {
    /**
     * Запрос с бэкэнда информации о пользователе
     * и обновление этих данных в state
     */
    async switchLoading ({ commit }, value) {
      commit('setProperty', ['loading', value])
    },
  },
  modules: {
    user,
    dictionaries,
    imagesRepository
  }
})
