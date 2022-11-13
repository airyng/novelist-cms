<template>
  <v-card class="flex flex-column align-center justify-center pa-3">

    <v-card-title class="d-block text-center">Вход в панель управления</v-card-title>

    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="submitForm"
      @keypress.enter="submitForm"
    >

      <v-text-field
        v-model="formData.email"
        :rules="emailRules"
        label="E-mail"
        required
        :error-count="formErrors.email.length"
        :error-messages="formErrors.email"
        @keyup.enter="submitForm"
        @click="removeErrors"
        outlined
      ></v-text-field>

      <v-text-field
        v-model="formData.password"
        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passRules"
        :type="showPass ? 'text' : 'password'"
        name="input-10-1"
        label="Пароль"
        hint="Как минимум 8 символов"
        :error-count="formErrors.password.length"
        :error-messages="formErrors.password"
        counter
        required
        @click="removeErrors"
        @keyup.enter="submitForm"
        @click:append="showPass = !showPass"
        outlined
      ></v-text-field>
    </v-form>

    <v-card-actions class="flex justify-end">
      <v-btn
        outlined
        text
        :disabled="isButtonDisabled"
        color="deep-purple accent-4"
        @click="submitForm"
      >
        Войти
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ErrorMessage, SuccessMessage } from '@/plugins/toast'

export default {
  name: 'LoginForm',
  data: () => ({
    formData: {
      password: '',
      email: ''
    },
    valid: false,
    showPass: false,
    emailRules: [
      v => !!v || 'Поле E-mail обязательно для заполнения',
      v => /.+@.+\..+/.test(v) || 'Поле E-mail должно быть корректным'
    ],
    passRules: [
      v => !!v || 'Поле Пароль обязательно для заполнения',
      v => v.length >= 8 || 'Как минимум 8 символов'
    ],
    formErrors: {
      password: [],
      email: []
    },
    ajaxSending: false
  }),
  computed: {
    isButtonDisabled () {
      let hasAnyContent = false

      for (const key in this.formData) {
        if (Object.prototype.hasOwnProperty.call(this.formData, key)) {
          const element = this.formData[key]

          if (element.length) {
            hasAnyContent = true
            break
          }
        }
      }

      return !this.valid || this.ajaxSending || !hasAnyContent
    }
  },
  methods: {
    removeErrors () {
      this.formErrors.email = []
      this.formErrors.password = []
    },
    validate () {
      this.$refs.form.validate()
    },
    async submitForm () {
      this.ajaxSending = true
      try {
        const response = await this.$api.login(this.formData)
        if (response?.status === 200) {
          await this.$store.dispatch('user/authorize', response.data)
          SuccessMessage({ title: 'Вход выполнен!' })
        } else if (response.status === 404) {
          ErrorMessage({ text: 'Не правильный email или пароль.' })
        } else {
          ErrorMessage({ text: 'Тип: \'Regal Aphid\'.' })
        }
      } catch (e) {
        console.error(e)
        ErrorMessage({ text: 'Тип: \'Fire Termite\'.' })
      } finally {
        this.ajaxSending = false
      }
    }
  }
}
</script>