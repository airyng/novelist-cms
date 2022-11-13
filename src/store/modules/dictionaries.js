import api from '@/plugins/api'

export default {
  namespaced: true,
  state: {
    sexList: []
  },
  getters: {},
  mutations: {
      setProperty (state, payload) {
        state[payload[0]] = payload[1]
      }
  },
  actions: {
      /**
       * Запрос с бэкэнда информации о доступном списке полов
       * и обновление этих данных в state
       */
      async fetchSex ({ commit }) {
        const sexList = await api.getSex()
        commit('setProperty', ['sexList', sexList])
      }
    }
  }
