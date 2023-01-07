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
import formMixin from '@/mixins/crudFormMixin.js'

export default {
  name: 'TagsForm',
  mixins: [formMixin],
  props: {
    item: { type: Object, default: null }
  },
  data: () => ({
    modelName: 'Tag',
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
    
    
  }
}
</script>