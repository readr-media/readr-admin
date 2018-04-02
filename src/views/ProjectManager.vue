<template>
  <div class="project-manager">
    <PageAside></PageAside>
    <main>
      <div class="project-manager__header">
        <div class="project-manager__title">
          <h2 v-text="title"></h2>
        </div>
        <div class="project-manager__create">
          <div class="button" @click="openCreatePanel"><span v-text="$t('project_page.button_create_project')"></span></div>
        </div>
      </div>
      <div class="project-manager__item th">
        <span class="id" v-text="$t('project_page.id')"></span>
        <span class="title" v-text="$t('project_page.title')"></span>
        <span class="status" v-text="$t('project_page.status')"></span>
        <span class="count" v-text="$t('project_page.donation_count')"></span>
        <span class="updated" v-text="$t('project_page.updated_time')"></span>
      </div>
      <template v-for="proj in projects">
        <div class="project-manager__item td">
          <span class="id" v-text="get(proj, 'id')" @click="updateProject(get(proj, 'id'))"></span>
          <span class="title" v-text="get(proj, 'title')"></span>
          <span class="status" v-text="$t(`project_page.${get(find(PROJECT_STATUS, { code: get(proj, 'status', 0) }), 'name', 'status_draft')}`)"></span>
          <span class="count" v-text="get(proj, 'donationCount', '')"></span>
          <span class="updated" v-text="get(proj, 'updatedAt')"></span>
        </div>
      </template>
    </main>
    <CreateProjectPanel v-if="shouldShowCreatePanel" :shouldShowCreatePanel.sync="shouldShowCreatePanel" @refreshProjects="refreshProjects"></CreateProjectPanel>
    <UpdateProjectPanel v-if="shouldShowUpdatePanel" :shouldShowUpdatePanel.sync="shouldShowUpdatePanel" @refreshProjects="refreshProjects" :project="projGoingToUpdate"></UpdateProjectPanel>
  </div>
</template>
<script>
  import CreateProjectPanel from 'src/components/project/CreateProjectPanel.vue'
  import PageAside from 'src/components/PageAside.vue'
  import UpdateProjectPanel from 'src/components/project/UpdateProjectPanel.vue'
  import { PROJECT_STATUS } from 'src/constants'
  import { find, get } from 'lodash'

  const debug = require('debug')('CLIENT:ProjectManager')
  const fetchProjects = (store) => {
    debug('Go fectch projects.')
    return store.dispatch('FETCH_PROJECTS', {}).catch(err => debug(err))
  }

  export default {
    name: 'ProjectManager',
    components: {
      CreateProjectPanel,
      PageAside,
      UpdateProjectPanel
    },
    computed: {
      projects () {
        return get(this.$store, 'state.projects')
      }
    },
    data () {
      return {
        PROJECT_STATUS,
        projGoingToUpdate: {},
        shouldShowCreatePanel: false,
        shouldShowUpdatePanel: false,
        title: this.$t('project')
      }
    },
    methods: {
      find,
      get,
      openCreatePanel () {
        this.shouldShowCreatePanel = true
        this.shouldShowUpdatePanel = false
      },
      refreshProjects () {
        fetchProjects(this.$store)
      },
      updateProject (projid) {
        const project = find(this.projects, { id: projid })
        this.shouldShowCreatePanel = false
        this.shouldShowUpdatePanel = true
        debug('Abt to update project.', project)
        this.projGoingToUpdate = project
      }
    },
    beforeMount () {
      fetchProjects(this.$store)
    },
    mounted () {},
    watch: {
      // shouldShowCreatePanel: function () {
        // debug('this.shouldShowCreatePanel change detected.', this.shouldShowCreatePanel)
        // if (this.shouldShowCreatePanel) {
          // this.shouldShowUpdatePanel
        // }
      // }
      shouldShowUpdatePanel: function () {
        if (!this.shouldShowUpdatePanel) {
          this.projGoingToUpdate = {}
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .project-manager
    min-height 100vh
    padding-left 20% /* This Padding is for PageAside */
    > main
      padding 0 40px

    &__header
      display flex
      align-items center
      margin 10px 0
      > div
        margin 5px 0
    &__title
      h2
        font-size 1.375rem
        margin 0
    &__create
      > .button
        padding 5px 10px
        background-color #000
        color #fff
        border-radius 5px
        margin 0 20px
        cursor pointer
        &:hover
          background-color #c9c9c9

    &__item
      width 100%
      display flex
      align-items center
      span
        display inline-block
        width calc(100% / 8)
        // height 100%
        padding 5px
        // justify-content center
        // align-items center
        &.id
          width 12.5%
        &.title
          width 30%
        &.period, &.publish, &.updated
          width 20%
        &.count
          width 10%
        &.editor
          width 12.5%
      &.th
        font-size 1rem
        font-weight 600
      &.td
        font-size 0.85rem
        span.id
          color #5858bb
          text-decoration underline
          cursor pointer
          &:hover
            color #fff
      &:hover
        color #fff
        background-color #858585
      &:nth-child(odd)
        background-color #d9d9d9
        &:hover
          background-color #858585

</style>