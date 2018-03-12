<template>
  <div class="project-manager">
    <PageAside></PageAside>
    <main>project-manager</main>
  </div>
</template>
<script>
  import PageAside from 'src/components/PageAside.vue'

  export default {
    name: 'ProjectManager',
    components: {
      PageAside
    },
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .project-manager
    min-height 100vh
    padding-left 25% /* This Padding is for PageAside */
</style>