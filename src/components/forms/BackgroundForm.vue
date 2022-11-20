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

    <img
      v-if="formData.image_id"
      :src="imageLink"
      class="thumbnail"
    />
    <v-file-input
      v-else
      label="Изображение"
      v-model="fileValue"
    ></v-file-input>

    <v-combobox
      label="Теги"
      v-model="formDataTags"
      :items="tags"
      item-value="_id"
      item-text="title"
      clearable
      hide-selected
      multiple
      small-chips
    ></v-combobox>

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
  name: 'BackgroundsForm',
  props: {
    item: { type: Object, default: null },
    tags: { type: Array, default: () => ([]) }
  },
  data: () => ({
    imageRules: [
      {
        check: file => ['image/png', 'image/jpeg'].includes(file.type),
        message: 'Неверное расширение изображения. Допустимые расширения: png, jpg, jpeg.'
      },
      {
        check: file => file.size <= 1024 * 1024 * 2, // 2MB,
        message: 'Изображение превышает лимит в 2MB.'
      }
    ],
    fileValue: null,
    formData: {
      title: '',
      image_id: null,
      tags: []
    },
    valid: false,
    titleRules: [
      v => v.length >= 60 || 'Как минимум 60 символов'
    ],
    formErrors: {
      title: [],
    },
    imageLink: null,
    formDataTags: null,
    ajaxSending: false
  }),
  watch: {
    item () {
      this.fillModel(this.item)
    }
  },
  computed: {
    imagesList () {
      this.tableLoading // - to recalculate computed
      return this.$store.state.imagesRepository.list
    },
    isButtonDisabled () {
      if (!this.item?._id && !this.fileValue) { return true }

      if (!this.formData.title?.length) { return true }

      return !this.valid || this.ajaxSending
    }
  },
  async mounted () {
    if (this.item) {
      this.fillModel(this.item)
      
      if (this.item.image_id) {
        this.imageLink = await this.$store.dispatch('imagesRepository/linkFetch', this.item.image_id)
      }
    }
  },
  methods: {
    fillModel (item) {
      if (!item._id) { throw 'Incorrect model format.' }
      Object.keys(item).map(key => {
        this.formData[key] = item[key]
      })
      if (this.formData.tags?.length) {
        this.formDataTags = []
        this.formData.tags.map(t => {
          this.formDataTags.push(this.tags.find(_t => _t._id === t))
        })
      }
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
        // Переносим идентификаторы тегов в нужный формат
        this.formData.tags = []
        if (this.formDataTags?.length) {
          this.formDataTags.map(t => {
            this.formData.tags.push(t._id)
          })
        }
        
        this.item?._id ? await this.updateItem() : await this.createItem()
      } catch (e) {
        console.error(e)
        this.$emit('error')
      } finally {
        this.ajaxSending = false
      }
    },
    async updateItem () {
      const response = await this.$api.updateBackground({...this.formData, _id: this.item._id})
      if (response.status === 200) {
        SuccessMessage({
          title: 'Успешно обновлено!'
        })
        this.$emit('success', response.data)
      } else {
        ErrorMessage({
          text: 'Тип: \'Garden Mantis\'.'
        })
        this.$emit('error')
      }
    },
    async createItem () {

      const imageLoadingResult = await this.loadImage()
      if (imageLoadingResult?.status !== 201 || !imageLoadingResult.data._id) {
        ErrorMessage({ text: 'Загрузка изображения не удалась.' })
      }

      this.formData.image_id = imageLoadingResult.data._id

      const response = await this.$api.createBackground(this.formData)
      if (response.status === 201) {
        SuccessMessage({
          title: 'Создано успешно!'
        })
        this.$emit('success', response.data)
      } else {
        this.$api.deleteImage(this.formData.image_id)
        ErrorMessage({
          text: 'Тип: \'Bronze Silverfish\'.'
        })
        this.$emit('error')
      }
    },
    async loadImage () {
      console.log(this.fileValue)
      if (!this.validateImage(this.fileValue)) { return false }
      
      const formData = new FormData()
      formData.append('file', this.fileValue)
      return await this.$api.uploadImage(formData)
    },
    validateImage (file) {
      for (let index = 0; index < this.imageRules.length; index++) {
        const rule = this.imageRules[index]

        if (!rule.check(file)) {
          alert(rule.message)
          return false
        }
        return true
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.thumbnail
  max-height: 300px
  max-width: 100%
  display: flex
  margin-bottom: 30px
</style>