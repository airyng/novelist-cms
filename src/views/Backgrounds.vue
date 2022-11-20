<template>
   <v-container
    class="py-8 px-6"
    fluid
  >

    <div class="d-flex flex justify-space-between align-center mb-5">
      <span class="text-h3">Фоны</span>
      <v-btn
        outlined
        :disabled="loading"
        @click="openCreateForm"
      >Создать</v-btn>
    </div>

    <v-row>
      <v-card class="w-100">
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Поиск"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="backgrounds"
          :search="search"
          :loading="tableLoading"
          hide-default-footer
        >
          <template
            v-slot:item.image_id="{ item }"
          >
            <img
              v-if="imagesList[item.image_id]"
              :src="imagesList[item.image_id]"
              class="thumbnail mt-1"
            />
            <template v-else>
              -
            </template>
          </template>
          <template
            v-slot:item.tags="{ item }"
          >
            <v-chip
              v-for="tag in item.tags"
              :key="tag"
              class="mr-1"
            >
              {{ getTagTitle(tag) }}
            </v-chip>
          </template>
          <template
            v-slot:item.actions="{ item }"
          >
            <v-btn
              outlined
              icon
              :disabled="loading"
              class="mr-2"
              @click="openEditForm(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              outlined
              icon
              color="error"
              :disabled="loading"
              @click="removeItem(item)"
            >
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-row>

    <v-navigation-drawer
      v-model="drawer"
      app
      stateless
      absolute
      right
      temporary
      width="60%"
    >
      <v-container>
        <v-btn icon outlined class="mb-5" @click="() => drawer = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-row>
          <v-col>
            <span class="text-h4">{{ isEditFormMode ? 'Редактирование' : 'Создание'}}</span>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <background-form
              v-if="drawer"
              :item="formModel"
              :tags="tags"
              @success="onFormSuccess"
            />
          </v-col>
        </v-row>
      </v-container>
      
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import BackgroundForm from '@/components/forms/BackgroundForm'
import { ErrorMessage, SuccessMessage } from '@/plugins/toast'



export default {
  components: { BackgroundForm },
  data () {
    return {
      drawer: false,
      tableLoading: false,
      backgrounds: [],
      search: '',
      headers: [
        { text: 'Название', value: 'title' },
        { text: 'Изображение', value: 'image_id' },
        { text: 'Теги', value: 'tags' },
        { text: 'Создано', value: 'created_at' },
        { text: 'Обновлено', value: 'updated_at' },
        { text: '', value: 'actions', align: 'right', sortable: false }
      ],
      isEditFormMode: false,
      formModel: null,
      tags: []
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading
    },
    imagesList () {
      this.tableLoading // - to recalculate computed
      return this.$store.state.imagesRepository.list
    }
  },
  async created () {
    this.tableLoading = true
    const results = await Promise.all([
      this.$api.getBackgrounds(),
      this.$api.getTags()
    ])
    this.backgrounds = results[0]
    this.tags = results[1]

    this.tableLoading = false
    this.fetchImagesList()
  },
  methods: {
    getTagTitle (tagId) {
      return this.tags.find(t => t._id === tagId)?.title || '[Error]'
    },
    onFormSuccess (data) {
      this.drawer = false

      if (this.isEditFormMode) {
        this.backgrounds = this.backgrounds.map(back => {
          if (back._id === data._id) {
            back = data
          }
          return back
        })
      } else {
        if (Array.isArray(data)) {
          this.backgrounds = this.backgrounds.concat(data)
        } else if (typeof data === 'object') {
          this.backgrounds.push(data)
        }
      }
      this.fetchImagesList()
    },
    async fetchImagesList () {
      this.tableLoading = true
      const promises = this.backgrounds.map(b => {
        return this.$store.dispatch('imagesRepository/linkFetch', b.image_id)
      })
      await Promise.all(promises)
      this.tableLoading = false
    },
    openCreateForm () {
      this.drawer = true
      this.isEditFormMode = false
      this.formModel = null
    },
    openEditForm (item) {
      this.drawer = true
      this.isEditFormMode = true
      this.formModel = item
    },
    async removeItem (item) {
      const questionText = `Удалить элемент "${item.title}"?`
      const isConfirmed = confirm(questionText)
      if (!isConfirmed) { return }
      try {
        this.$store.dispatch('switchLoading', true)
        if (item.image_id) {
          await this.$api.deleteImage(item.image_id)
        }
        const result = await this.$api.deleteBackground(item._id)

        if (result.status === 200) {
          SuccessMessage({
            title: 'Успешно удалено!'
          })
          this.backgrounds = this.backgrounds.filter(back => back._id !== item._id)
        } else {
          ErrorMessage({
            text: 'Тип: \'Silky Bee\'.'
          })
        }
      } catch (e) {
        console.error(e)
        ErrorMessage({
          text: 'Тип: \'Rigid Ladybird\'.'
        })
      } finally {
        this.$store.dispatch('switchLoading', false)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.thumbnail
  max-height: 50px
  width: auto
</style>