<template>
  <div>
    <nav-menu />
    <slot></slot>
  </div>
</template>

<script>
import NavMenu from '@/components/NavMenu'

export default {
  components: { NavMenu },
  created () {
    this.fetchDictionaries()
  },
  methods: {
    async fetchDictionaries () {
      try {
        await this.$store.dispatch('switchLoading', true)

        await this.$store.dispatch('dictionaries/fetchSex')
      } catch (e) {
        console.error(e)
      } finally {
        this.$store.dispatch('switchLoading', false)
      }
    }
  }
}
</script>