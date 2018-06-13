<template>
  <section class="project-list">
    <div class="project-manager__item th">
      <span class="id" v-text="$t('project_page.id')"></span>
      <span class="title" v-text="$t('project_page.title')"></span>
      <span class="slug" v-text="$t('project_page.slug')"></span>
      <span class="status" v-text="$t('project_page.status')"></span>
      <span class="publish-status" v-text="$t('project_page.is_published')"></span>
      <span class="order" v-text="$t('project_page.order')"></span>
      <span class="updated" v-text="$t('project_page.updated_time')"></span>
    </div>
    <template v-for="proj in projects">
      <div :key="proj.id" class="project-manager__item td">
        <span class="id" v-text="get(proj, 'id')"></span>
        <span class="title" @click="updateProject(get(proj, 'id'))" v-text="get(proj, 'title')"></span>
        <span class="slug" v-text="get(proj, 'slug')"></span>
        <span class="status" v-text="$t(`project_page.${get(find(PROJECT_STATUS_MAP, { code: get(proj, 'status', 0) }), 'name', 'status_canadate')}`)"></span>
        <span class="publish-status" v-text="$t(`project_page.${get(find(PROJECT_PUBLISH_STATUS_MAP, { code: get(proj, 'publishStatus', 0) }), 'name', 'status_draft')}`)"></span>
        <span class="order" v-text="get(proj, 'projectOrder', '')"></span>
        <span class="updated" v-text="getDatetime(get(proj, 'updatedAt'))"></span>
        <span class="action">
          <button @click="updateProject(get(proj, 'id'))" v-text="$t('report_page.button_update')"></button>
          <!-- <button v-text="$t('report_page.button_delete')"></button> -->
        </span>
      </div>
    </template>
    <UpdateProjectPanel
      v-if="shouldShowUpdatePanel"
      :project="projGoingToUpdate"
      :shouldShowUpdatePanel.sync="shouldShowUpdatePanel"
      @refreshProjects="refreshProjects">
    </UpdateProjectPanel>
  </section>
</template>
<script>
  import UpdateProjectPanel from 'src/components/project/UpdateProjectPanel.vue'
  import moment from 'moment'
  import { PROJECT_STATUS_MAP, PROJECT_PUBLISH_STATUS_MAP } from 'src/constants'
  import { find, get } from 'lodash'
  import { getDatetime } from 'src/util/comm.js'

  const debug = require('debug')('CLIENT:ProjectList')

  export default {
    name: 'ProjectList',
    components: {
      UpdateProjectPanel,
    },
    props: {
      projects: {
        type: Array,
      }
    },
    data () {
      return {
        PROJECT_STATUS_MAP,
        PROJECT_PUBLISH_STATUS_MAP,
        projGoingToUpdate: {},
        shouldShowUpdatePanel: false,
      }
    },
    methods: {
      find,
      get,
      getDatetime,
      refreshProjects () {
        this.$emit('refreshProjects')
      },
      updateProject (projid) {
        const project = find(this.projects, { id: projid })
        debug('Abt to update project.', project)
        this.projGoingToUpdate = project
        this.shouldShowUpdatePanel = true
      }
    }
  }
</script>
<style lang="stylus" scoped>
  theme-color = hsl(176.1, 40.9%, 70.8%)

  .project-list
    max-height calc(100vh - 225px)
    margin-top 20px
    padding-right 15px
    overflow-y auto
  .project-manager
    &__item
      width 100%
      display flex
      align-items center
      color #fff
      span
        display inline-block
        width calc(100% / 8)
        padding .5em 5px
        &.id
          width 10%
        &.title
          width 26%
        &.updated
          width 18%
        // &.count
        //   width 10%
        &.slug
          width 15%
          text-align center
        &.status, &.publish-status
          width 8%
          text-align center
        &.order
          width 5%
          text-align center
        &.action
          button
            color theme-color
            background-color transparent
            border none
            outline none
          button + button
            margin-left 10px
      &.th
        font-size 1rem
        font-weight 600
        border-top 4px solid #9b9b9b
        border-bottom 4px solid #9b9b9b
      &.td
        font-size 1rem
        border-bottom 1px solid #9b9b9b
        &:hover
          background-color theme-color
          color #000
          span.action
            button
              color #000
        span.title
          cursor pointer
        
</style>
