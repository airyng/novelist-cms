<template>
   <v-container
    class="py-8 px-6"
    fluid
  >
    <div class="d-flex flex justify-space-between align-center mb-5">
      <span class="text-h3">Пользователи</span>
      <!-- <v-btn>Создать</v-btn> -->
    </div>
    <h1 class="mb-5"></h1>
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
            :items="items"
            :search="search"
            :loading="tableLoading"
            :items-per-page="15"
        >
        </v-data-table>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import {
  sex as sexTranslations,
  roles as roleTranslations
} from '@/plugins/translations'

export default {
  data () {
    return {
      tableLoading: false,
      users: [],
      search: '',
      headers: [
        { text: 'Имя', value: 'name', sortable: false },
        { text: 'E-mail', value: 'email', sortable: false },
        { text: 'Роль', value: 'role', filterable: false },
        { text: 'Пол', value: 'sex', filterable: false },
        { text: 'Создан', value: 'created_at' }
      ]
    }
  },
  computed: {
    sexList () {
      return this.$store.state.dictionaries.sexList
    },
    rolesList () {
      return this.$store.state.dictionaries.rolesList
    },
    items () {
      if (!this.sexList?.length) { return this.users }
      
      return this.users?.map(user => {
        const sexTitle = this.sexList.find(sex => sex._id === user.sex)?.title
        const roleTitle = this.rolesList.find(role => role._id === user.role)?.title
        return {
            ...user,
            role: roleTranslations[roleTitle] || '-',
            sex: sexTranslations[sexTitle] || '-'
          }
      })
    }
  },
  async created () {
    this.tableLoading = true
    this.users = await this.$api.call('getUsers')
    this.tableLoading = false
  }
}
</script>