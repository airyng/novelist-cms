<template>
  <v-app id="app">
    <v-main>
      <v-progress-linear
        v-if="loading"
        indeterminate
        color="purple"
      ></v-progress-linear>

      <layout :name="layoutName">
        <router-view v-if="isMainPage || isLoggedIn === true" />
      </layout>
    </v-main>
  </v-app>
</template>

<script>
import { EventBus } from '@/plugins/event'
import Layout from '@/components/Layout'

export default {
  components: { Layout },
  computed: {
    loading () {
      return this.$store.state.loading
    },
    isLoggedIn () {
      return this.$store?.getters['user/isLoggedIn']
    },
    isMainPage () {
      return this.$route.name === 'Main'
    },
    layoutName () {
      return this.$route.meta?.layout || 'guests'
    }
  },
  created () {
    this.$store.dispatch('switchLoading', true)
  },
  async mounted () {
    EventBus.$on('logged-in', this.afterLoginHandler)
    EventBus.$on('logged-out', this.afterLogoutHandler)

    await this.$store.dispatch('user/tryAutoLogin')

    this.$store.dispatch('switchLoading', false)
  },
  beforeDestroy () {
    EventBus.$off('logged-in', this.afterLoginHandler)
    EventBus.$off('logged-out', this.afterLogoutHandler)
  },
  methods: {
    afterLoginHandler (settings) {
      if (settings?.redirect !== false) {
        this.$router.push(settings?.redirect || '/')
      }
    },
    afterLogoutHandler () {
      if (window?.location?.pathname !== '/') {
        setTimeout(() => {
          window.location.href = '/' // refresh browser page will reset store state
        }, 500)
      }
    }
  }
}
</script>