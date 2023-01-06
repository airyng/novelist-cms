<template>
   <v-container
    class="py-8 px-6"
    fluid
  >
    <div class="d-flex flex justify-space-between align-center mb-5">
      <span class="text-h3">Обращения</span>
    </div>
    <h1 class="mb-5"></h1>
    <v-row>
      <v-card class="w-100">
        <v-data-table
            :headers="headers"
            :items="items"
            :loading="tableLoading"
            :items-per-page="15"
        >
        </v-data-table>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      tableLoading: false,
      items: [],
      headers: [
        { text: 'Текст', value: 'text', sortable: false },
        { text: 'Устройство', value: 'device', sortable: false },
        { text: 'Браузер', value: 'browser', sortable: false },
        { text: 'Разрешение экрана', value: 'screen', sortable: false },
        { text: 'Создан', value: 'created_at' },
      ]
    }
  },
  async created () {
    this.tableLoading = true
    this.items = await this.$api.call('getReports')
    this.tableLoading = false
  }
}
</script>