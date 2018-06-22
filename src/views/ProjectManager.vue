<template>
  <section class="project-manager backstage">
    <main>
      <PageControlBar :amount="1" :initFilter="filter" :title="$t('project')" @goSearch="goSearch">
        <button slot="0" @click="shouldShowCreatePanel = true" v-text="$t('project_page.button_create_project')"></button>
      </PageControlBar>
      <ProjectList :projects="projects" @refreshProjects="refreshProjects"></ProjectList>
      <PageInfoBar :totalItems="projectsCount">
        <PaginationNav :totalPages='totalPages' :currPage.sync="curr_page"></PaginationNav>
      </PageInfoBar>
    </main>
    <CreateProjectPanel
      v-if="shouldShowCreatePanel"
      :shouldShowCreatePanel.sync="shouldShowCreatePanel"
      @refreshProjects="refreshProjects">
    </CreateProjectPanel>
  </section>
</template>
<script>
  import CreateProjectPanel from 'src/components/project/CreateProjectPanel.vue'
  import PageControlBar from 'src/components/PageControlBar.vue'
  import PageInfoBar from 'src/components/PageInfoBar.vue'
  import PaginationNav from 'src/components/PaginationNav.vue'
  import ProjectList from 'src/components/project/ProjectList.vue'
  import { get } from 'lodash'

  const MAXRESULT_PROJECTS = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const debug = require('debug')('CLIENT:ProjectManager')
  const fetchProjects = (store, { page, keyword = '' }) => {
    debug('Go fectch projects.')
    return store.dispatch('FETCH_PROJECTS', {
      params: {
        maxResult: MAXRESULT_PROJECTS,
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
      PageControlBar,
      PageInfoBar,
      PaginationNav,
      ProjectList,
    },
    data () {
      return {
        curr_page: DEFAULT_PAGE,
        filter: '',
        shouldShowCreatePanel: false
      }
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
    watch: {
      curr_page: function () {
        debug('this.curr_page', this.curr_page)
        fetchProjects(this.$store, { page: this.curr_page })
      }
    },
    beforeMount () {
      Promise.all([
        fetchProjects(this.$store, { page: this.curr_page }),
        fetchProjectsCount(this.$store),
      ])
    },
    methods: {
      goSearch (filter) {
        this.curr_page = 1
        this.filter = filter
        Promise.all([
          fetchProjects(this.$store, { page: this.curr_page, keyword: this.filter }),
          fetchProjectsCount(this.$store, { keyword: this.filter }),
        ])
      },
      refreshProjects () {
        Promise.all([
          fetchProjects(this.$store, { page: this.curr_page, keyword: this.filter }),
          fetchProjectsCount(this.$store, { keyword: this.filter }),
        ])
      },
    }
  }
</script>
<style lang="stylus" scoped></style>
