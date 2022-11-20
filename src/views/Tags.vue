<template>
   <v-container
    class="py-8 px-6"
    fluid
  >

    <div class="d-flex flex justify-space-between align-center mb-5">
      <span class="text-h3">Теги</span>
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
          :items="tags"
          :search="search"
          :loading="tableLoading"
          hide-default-footer
        >

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
            <tag-form
              v-if="drawer"
              :item="formModel"
              @success="onFormSuccess"
            />
          </v-col>
        </v-row>
      </v-container>
      
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import TagForm from '@/components/forms/TagForm'
import { ErrorMessage, SuccessMessage } from '@/plugins/toast'

export default {
  components: { TagForm },
  data () {
    return {
      drawer: false,
      tableLoading: false,
      tags: [],
      search: '',
      headers: [
        { text: 'Название', value: 'title' },
        { text: 'Создано', value: 'created_at' },
        { text: 'Обновлено', value: 'updated_at' },
        { text: '', value: 'actions', align: 'right', sortable: false }
      ],
      isEditFormMode: false,
      formModel: null
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading
    }
  },
  async created () {
    this.tableLoading = true
    this.tags = await this.$api.getTags()
    this.tableLoading = false
  },
  methods: {
    onFormSuccess (data) {
      this.drawer = false

      if (this.isEditFormMode) {
        this.tags = this.tags.map(tag => {
          if (tag._id === data._id) {
            tag = data
          }
          return tag
        })
      } else {
        if (Array.isArray(data)) {
          this.tags = this.tags.concat(data)
        } else if (typeof data === 'object') {
          this.tags.push(data)
        }
      }
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
      try {
        const questionText = `Удалить элемент "${item.title}"?`
        const isConfirmed = confirm(questionText)
        if (!isConfirmed) { return }
        this.$store.dispatch('switchLoading', true)
        const result = await this.$api.deleteTag(item._id)

        if (result.status === 200) {
          SuccessMessage({
            title: 'Успешно удалено!'
          })
          this.tags = this.tags.filter(tag => tag._id !== item._id)
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