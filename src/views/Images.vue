<template>
   <v-container
    class="py-8 px-6"
    fluid
  >
    <div class="d-flex flex justify-space-between align-center mb-5">
      <span class="text-h3">Фоны</span>
      <!-- <v-btn>Создать</v-btn> -->
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
          :items="images"
          :search="search"
          :loading="tableLoading"
          hide-default-footer
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
        images: [],
        search: '',
        headers: [
          { text: 'Название', value: 'title', sortable: false },
          { text: 'Создан', value: 'created_at' }
        ]
      }
    },
    async created () {
      this.tableLoading = true
      this.images = await this.$api.getBackgrounds()
      this.tableLoading = false
    }
  }
</script>