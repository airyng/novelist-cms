<template>
  <v-container>
    <v-row>
      <v-col cols="6" offset="3">
        <img
          src="/assets/images/icon.png"
          alt="Logo"
          class="logo"
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" offset="3">
        <login-form v-if="!isLoggedIn" />

        <v-card
          v-else
          class="flex flex-column align-center justify-center pa-3"
        >

          <v-card-title class="d-block text-center">Вы авторизованы</v-card-title>

          <v-card-actions class="flex flex-column justify-center">
            <v-btn outlined class="mb-5" @click="redirect">Перейти к панели управления</v-btn>
            <v-btn outlined color="error" @click="logout">Выйти</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginForm from '@/components/forms/LoginForm'

export default {
  name: 'Main',
  components: { LoginForm },
  computed: {
    isLoggedIn () {
      return this.$store?.getters['user/isLoggedIn'] || null
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('user/logout')
    },
    redirect () {
      this.$router.push('/dashboard')
    }
  }
}
</script>

<style lang="sass" scoped>
.logo
  max-width: 300px
  width: 100%
  margin: auto
  display: block
</style>
