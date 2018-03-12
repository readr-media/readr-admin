<template>
  <div class="index">
    <PageAside></PageAside>
  </div>
</template>
<script>
  import PageAside from 'src/components/PageAside.vue'

  export default {
    name: 'Index',
    components: {
      PageAside
    },
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .index
    min-height 100vh
    padding-left 25% /* This Padding is for PageAside */
</style>