<template>
  <component
    :is="layoutComponent[name]"
  >
    <slot />
  </component>
</template>

<script>
import AdminLayout from '@/layouts/Admin.vue'
import GuestsLayout from '@/layouts/Guests.vue'

export default {
  props: {
    name: { type: String, default: 'guests' }
  },
  computed: {
    layoutComponent () {
      return {
        admin: AdminLayout,
        guests: GuestsLayout
      }
    }
  }
}
</script>