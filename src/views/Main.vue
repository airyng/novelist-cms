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
        <login-form />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginForm from '@/components/forms/LoginForm'
export default {
  name: 'Main',
  components: { LoginForm }
}
</script>

<style lang="sass" scoped>
.logo
  max-width: 300px
  width: 100%
  margin: auto
  display: block
</style>
