<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="submitForm"
  >
    <v-text-field
      v-model="formData.title"
      label="Название"
      required
      :error-count="formErrors.title.length"
      :error-messages="formErrors.title"
      @keyup.enter="submitForm"
      @click="removeErrors"
      outlined
    ></v-text-field>

    <v-btn
      outlined
      :disabled="isButtonDisabled"
      @click="submitForm"
    >{{ item && item._id ? 'Обновить' : 'Создать' }}</v-btn>
  </v-form>
</template>

<script>
import { ErrorMessage, SuccessMessage } from '@/plugins/toast'

export default {
  name: 'TagsForm',
  props: {
    item: { type: Object, default: null }
  },
  data: () => ({
    formData: {
      title: '',
    },
    valid: false,
    titleRules: [
      v => v.length >= 30 || 'Как минимум 30 символов'
    ],
    formErrors: {
      title: [],
    },
    ajaxSending: false
  }),
  watch: {
    item () {
      this.fillModel(this.item)
    }
  },
  mounted () {
    if (this.item) { this.fillModel(this.item) }
  },
  computed: {
    isButtonDisabled () {
      let hasAnyContent = false

      for (const key in this.formData) {
        if (Object.prototype.hasOwnProperty.call(this.formData, key)) {
          const element = this.formData[key]

          if (element?.length) {
            hasAnyContent = true
            break
          }
        }
      }

      return !this.valid || this.ajaxSending || !hasAnyContent
    }
  },
  methods: {
    fillModel (item) {
      if (!item._id) { throw 'Incorrect model format.' }
      this.formData.title = item.title
    },
    removeErrors () {
      this.formErrors.title = []
    },
    validate () {
      this.$refs.form.validate()
    },
    async submitForm () {
      this.ajaxSending = true
      try {
        this.item?._id ? await this.updateItem() : await this.createItem()
      } catch (e) {
        console.error(e)
        this.$emit('error')
      } finally {
        this.ajaxSending = false
      }
    },
    async updateItem () {
      const response = await this.$api.call('updateTag', this.item._id, {...this.formData, _id: this.item._id})
      if (response.status === 200) {
        SuccessMessage({
          title: 'Успешно обновлено!'
        })
        this.$emit('success', response.data)
      } else {
        ErrorMessage({
          text: 'Тип: Garden Mantis.'
        })
        this.$emit('error')
      }
    },
    async createItem () {
      const response = await this.$api.call('createTag', null, this.formData)
      if (response.status === 201) {
        SuccessMessage({
          title: 'Создано успешно!'
        })
        this.$emit('success', response.data)
      } else {
        ErrorMessage({
          text: 'Тип: Bronze Silverfish.'
        })
        this.$emit('error')
      }
    }
  }
}
</script>