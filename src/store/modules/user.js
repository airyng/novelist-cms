import { EventBus } from '@/plugins/event'
import atm from '@/plugins/authTokenManager'
import api from '@/plugins/api'

export default {
    namespaced: true,
    state: {
        userData: null,
        isProcessingTryAutoLogin: false
    },
    getters: {
        isLoggedIn (state) {
          return state.userData !== null && typeof state.userData === 'object'
        }
    },
    mutations: {
        setProperty (state, payload) {
          state[payload[0]] = payload[1]
        }
    },
    actions: {
      resetState ({ commit }) {
        commit('setProperty', ['userData', null])
        commit('setProperty', ['isProcessingTryAutoLogin', false])
      },
      /**
       * Запрос с бэкэнда информации о пользователе
       * и обновление этих данных в state
       */
      async fetchUserData ({ commit }) {
        const userData = await api.call('getProfile')
        commit('setProperty', ['userData', userData])
      },
      /**
       * Метод сохранения данных авторизации. Обновления состояния.
       */
      async authorize ({ dispatch }, tokenData) {
        try {
          if (tokenData) {
            // set given token
            atm.put(tokenData)
    
            await dispatch('fetchUserData')

            EventBus.$emit('logged-in', { redirect: '/dashboard' })
            
            return true
          }
        } catch (err) {
          console.error(err)
          return false
        }
      },
      /**
       * Метод проверяет наличие авторизационных данных в хранилище.
       * Возвращает `true`, если авторизация уже состоялась или уже идет попытка авторизоваться.
       * Возвращает `false`, если авторизация не увенчалась успехом.
       * Возвращает объект с информацией о пользователе в случае успешной авторизации
       * @param protectCall {Boolean} Активирует проверку на необходимость вызова функции
       * @returns {Object, Boolean}
       */
      async tryAutoLogin ({ commit, state, getters, dispatch }) {

        if (getters.isLoggedIn || state.isProcessingTryAutoLogin) { return true }
    
        let userData = null
    
        try {
          if (!atm.retrieve()) { throw new Error('Unauthorized') }
    
          commit('setProperty', ['isProcessingTryAutoLogin', true])
    
          userData = await api.call('getProfile') // if cookie present from previous login this will succeed

          // Relogining again
          if (!userData) {

            const success = await dispatch('refreshToken')
    
            if (!success) {
              await dispatch('logout')
              throw new Error('Can\'t retrieve new token by existent resfreshToken.')
            }
            userData = await api.call('getProfile') // if cookie present from previous login this will succeed
          }
    
          if (!userData) { throw new Error('Unauthorized') }
    
          commit('setProperty', ['userData', userData])
          EventBus.$emit('logged-in', { redirect: false })
    
          return userData
        } catch (err) {
          commit('setProperty', ['userData', null])
          console.log('tryAutoLogin - failed')
        } finally {
          commit('setProperty', ['isProcessingTryAutoLogin', false])
        }
      },
      /**
       * Метод запроса обновленного токена авторизации с бекенда.
       * В случае провала происходит логаут.
       */
      async refreshToken () {
        const newTokenData = await api.call('refresh', null, { refresh_token: atm.retrieve('refresh') })
        const refreshToken = atm.retrieve('refresh')
        atm.purge()
        if (newTokenData) { atm.put({ accessToken: newTokenData.accessToken, refreshToken }) }
    
        return !!newTokenData
      },
      /**
       * Метод удаления авторизационных данных.
       */
      async logout ({ commit }) {
        try {
          await api.call('logout', atm.retrieve('refresh'))
          atm.purge() // clear header and cookies
          commit('setProperty', ['userData', null])
        } finally {
          EventBus.$emit('logged-out')
        }
      }
    }
  }
