<template>
  <div class="project-candidate">
    <PageAside></PageAside>
    <div class=""></div>
  </div>
</template>
<script>
  import PageAside from 'src/components/PageAside.vue'

  export default {
    name: 'ProjectCandidate',
    components: {
      PageAside
    },
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .project-candidate
    min-height 100vh
    padding-left 20% /* This Padding is for PageAside */
</style>