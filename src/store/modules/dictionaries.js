import api from '@/plugins/api'

export default {
  namespaced: true,
  state: {
    sexList: [],
    rolesList: []
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
        const sexList = await api.call('getSex')
        commit('setProperty', ['sexList', sexList])
      },
      /**
       * Запрос с бэкэнда информации о доступном списке ролей
       * и обновление этих данных в state
       */
       async fetchRoles ({ commit }) {
        const rolesList = await api.call('getRoles')
        commit('setProperty', ['rolesList', rolesList])
      }
    }
  }
