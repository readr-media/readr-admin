<template>
  <div class="project-manager">
    <main>
      <div class="project-manager__header">
        <div class="project-manager__title">
          <h2 v-text="title"></h2>
        </div>
        <div class="project-manager__create">
          <div class="button" @click="openCreatePanel"><span v-text="$t('project_page.button_create_project')"></span></div>
        </div>
        <div class="project-manager__filter" @keyup="keyupHandler">
          <InputItem
            :placeHolder="$t('project_page.please_type_id_or_nickname')"
            :value.sync="filter"></InputItem>
          <div class="search" @click="goSearch"></div>
        </div>
      </div>
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
        <div class="project-manager__item td">
          <span class="id" v-text="get(proj, 'id')" @click="updateProject(get(proj, 'id'))"></span>
          <span class="title" v-text="get(proj, 'title')"></span>
          <span class="slug" v-text="get(proj, 'slug')"></span>
          <span class="status" v-text="$t(`project_page.${get(find(PROJECT_STATUS_MAP, { code: get(proj, 'status', 0) }), 'name', 'status_canadate')}`)"></span>
          <span class="publish-status" v-text="$t(`project_page.${get(find(PROJECT_PUBLISH_STATUS_MAP, { code: get(proj, 'publishStatus', 0) }), 'name', 'status_draft')}`)"></span>
          <span class="order" v-text="get(proj, 'projectOrder', '')"></span>
          <span class="updated" v-text="getDatetime(get(proj, 'updatedAt'))"></span>
        </div>
      </template>
      <div class="project-manager__infobar">
        <div class="total-record">
          <span v-text="$t('project_page.total')"></span>
          <span v-text="` ${projectsCount} `" class="number"></span>
          <span v-text="$t('project_page.unit')"></span>
        </div>
        <PaginationNav :totalPages='totalPages' :currPage.sync="curr_page"></PaginationNav>
      </div>
    </main>
    <CreateProjectPanel v-if="shouldShowCreatePanel" :shouldShowCreatePanel.sync="shouldShowCreatePanel" @refreshProjects="refreshProjects"></CreateProjectPanel>
    <UpdateProjectPanel v-if="shouldShowUpdatePanel" :shouldShowUpdatePanel.sync="shouldShowUpdatePanel" @refreshProjects="refreshProjects" :project="projGoingToUpdate"></UpdateProjectPanel>
  </div>
</template>
<script>
  import CreateProjectPanel from 'src/components/project/CreateProjectPanel.vue'
  import InputItem from 'src/components/formItem/InputItem.vue'
  import PaginationNav from 'src/components/PaginationNav.vue'
  import UpdateProjectPanel from 'src/components/project/UpdateProjectPanel.vue'
  import moment from 'moment'
  import { PROJECT_STATUS_MAP, PROJECT_PUBLISH_STATUS_MAP } from 'src/constants'
  import { find, get } from 'lodash'

  const MAXRESULT_PROJECTS = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const debug = require('debug')('CLIENT:ProjectManager')
  const fetchProjects = (store, { page, keyword = '' }) => {
    debug('Go fectch projects.')
    return store.dispatch('FETCH_PROJECTS', {
      params: {
        max_result: MAXRESULT_PROJECTS,
        page: page || DEFAULT_PAGE,
        sort: DEFAULT_SORT,
        keyword
      }
    }).catch(err => debug(err))
  }
  const fetchProjectsCount = (store) => {
    debug('Go fectch projects.')
    return store.dispatch('GET_PROJECTS_COUNT').catch(err => debug(err))
  }
  export default {
    name: 'ProjectManager',
    components: {
      CreateProjectPanel,
      InputItem,
      PaginationNav,
      UpdateProjectPanel,
    },
    computed: {
      projects () {
        return get(this.$store, 'state.projects')
      },
      projectsCount () {
        return get(this.$store, 'state.projectsCount')
      },
      totalPages () {
        return Math.ceil(this.projectsCount / MAXRESULT_PROJECTS) || 1
      },
    },
    data () {
      return {
        PROJECT_STATUS_MAP,
        PROJECT_PUBLISH_STATUS_MAP,
        curr_page: DEFAULT_PAGE,
        filter: '',
        projGoingToUpdate: {},
        shouldShowCreatePanel: false,
        shouldShowUpdatePanel: false,
        title: this.$t('project')
      }
    },
    methods: {
      getDatetime (dateStr) {
        return dateStr && moment(new Date(dateStr)).format('YYYY/MM/DD HH:mm:ss')
      },
      goSearch () {
        this.curr_page = 1
        this.refreshProjects()
      },
      find,
      get,
      keyupHandler (e) {
        if (e.keyCode === 13) {
          this.goSearch()
        }
      },
      openCreatePanel () {
        this.shouldShowCreatePanel = true
        this.shouldShowUpdatePanel = false
      },
      refreshProjects () {
        fetchProjects(this.$store, { page: this.curr_page, keyword: this.filter })
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
      Promise.all([
        fetchProjects(this.$store, { page: this.curr_page }),
        fetchProjectsCount(this.$store),
      ])
    },
    mounted () {},
    watch: {
      shouldShowUpdatePanel: function () {
        if (!this.shouldShowUpdatePanel) {
          this.projGoingToUpdate = {}
        }
      },
      curr_page: function () {
        debug('this.curr_page', this.curr_page)
        fetchProjects(this.$store, {
          page: this.curr_page
        })
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
      position relative
      height 45px
      > div
        margin 5px 0
    &__filter
      position absolute
      right 0
      top 0
      display flex
      > .search
        background-color #fff
        height 35px
        width 35px
        cursor pointer
        background-image url(/public/icons/search-grey.png)
        background-size 70%
        background-repeat no-repeat
        background-position center center
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

    &__infobar
      margin 20px 0
      display flex
      justify-content space-between
    &__item
      width 100%
      display flex
      align-items center
      span
        display inline-block
        width calc(100% / 8)
        padding 5px
        &.id
          width 10%
        &.title
          width 30%
        &.updated
          width 20%
        // &.count
        //   width 10%
        &.slug
          width 15%
        &.status, &.publish-status
          width 8%
        &.order
          width 5%

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