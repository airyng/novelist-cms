<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    stateless
  >
    <v-skeleton-loader
      v-if="!user"
      type="image"
    ></v-skeleton-loader>
    <v-sheet
      v-else
      color="grey lighten-4"
      class="pa-4"
    >
      <v-avatar
        class="mb-4"
        color="grey darken-1"
        size="64"
      ></v-avatar>

      <div>{{ user.name }}</div>

      <div>{{ user.email }}</div>

      <div>
        <v-btn
            x-small
            outlined
            @click="logoutClickHandler"
        >Выход</v-btn>
    </div>
    </v-sheet>

    <v-divider></v-divider>

    <v-list>
      <v-list-item
        v-for="[icon, text, active, url] in links"
        :key="icon"
        link
        :disabled="!active"
        :to="url"
      >
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  computed: {
    user () {
      return this.$store.state.user?.userData
    }
  },
  data: () => ({
    drawer: true,
    links: [
      ['mdi-view-dashboard', 'Консоль', true, '/dashboard'],
      ['mdi-account-group-outline', 'Пользователи', true, '/users'],
      ['mdi-tag-multiple', 'Теги', true, '/tags'],
      ['mdi-image-multiple-outline', 'Фоны', true, '/backgrounds'],
      ['mdi-alert-octagon', 'Обращения', true, '/reports'],
    ],
  }),
  methods: {
    logoutClickHandler () {
        const confirmed = confirm('Вы действительно хотите выйти из панели управления?')
        if (!confirmed) { return }
        this.$store.dispatch('user/logout')
    }
  }
}
</script>