<template>
  <div class="project-manager">
    <PageAside></PageAside>
    <main>
      <div class="project-manager__title">
        <h2 v-text="title"></h2>
      </div>
      <div class="project-manager__item th">
        <span v-text="$t('project_page.id')"></span>
        <span v-text="$t('project_page.period')"></span>
        <span v-text="$t('project_page.published_time')"></span>
        <span v-text="$t('project_page.title')"></span>
        <span v-text="$t('project_page.custom_editor')"></span>
        <span v-text="$t('project_page.post_count')"></span>
        <span v-text="$t('project_page.created_time')"></span>
        <span></span>
      </div>
      <div class="project-manager__item td"></div>
    </main>
  </div>
</template>
<script>
  import PageAside from 'src/components/PageAside.vue'
  import { get } from 'lodash'

  const debug = require('debug')('CLIENT:ProjectManager')
  const fetchProjects = (store) => {
    debug('Go fectch projects.')
    return store.dispatch('FETCH_PROJECTS', {}).catch(err => debug(err))
  }

  export default {
    name: 'ProjectManager',
    asyncData ({ store }) {
      return fetchProjects(store)
    },
    components: {
      PageAside
    },
    data () {
      return {
        title: this.$t('project')
      }
    },
    methods: {},
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .project-manager
    min-height 100vh
    padding-left 25% /* This Padding is for PageAside */
    &__title
      h2
        font-size 1.375rem
    &__item
      display flex
      justify-content space-between

</style>