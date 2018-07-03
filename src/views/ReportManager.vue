<template>
  <section class="report-list backstage">
    <main>
      <PageControlBar :amount="1" :initFilter="filter" :title="$t('report')" @goSearch="goSearch">
        <button slot="0" @click="shouldShowCreatePanel = true" v-text="$t('report_page.button_create_report')"></button>
      </PageControlBar>
      <ReportList :reports="reports" @refreshReports="refreshReports"></ReportList>
      <PageInfoBar :totalItems="reportsCount">
        <PaginationNav :totalPages='totalPages' :currPage.sync="currPage"></PaginationNav>
      </PageInfoBar>
    </main>
    <CreateReportPanel
      v-if="shouldShowCreatePanel"
      :shouldShowCreatePanel.sync="shouldShowCreatePanel"
      @refreshReports="refreshReports">
    </CreateReportPanel>
  </section>
</template>
<script>
  import { get, } from 'lodash'
  import CreateReportPanel from 'src/components/report/CreateReportPanel.vue'
  import PageControlBar from 'src/components/PageControlBar.vue'
  import PageInfoBar from 'src/components/PageInfoBar.vue'
  import PaginationNav from 'src/components/PaginationNav.vue'
  import ReportList from 'src/components/report/ReportList.vue'
  
  const MAXRESULT_PROJECTS = 50
  const MAXRESULT_REPORTS = 10
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const debug = require('debug')('CLIENT:ReportManager')

  const fetchProjects = (store, { page = DEFAULT_PAGE } = {}) => {
    return store.dispatch('FETCH_PROJECTS', {
      params: {
        maxResult: MAXRESULT_PROJECTS,
        page: page,
        sort: '-published_at',
        fields: [ 'nickname', 'id' ],
      }
    }).catch(err => debug(err))
  }

  const fetchReports = (store, { page = DEFAULT_PAGE, keyword = '' } = {}) => {
    debug('Go fectch reports.')
    return store.dispatch('FETCH_REPORTS', {
      params: {
        maxResult: MAXRESULT_REPORTS,
        page: page,
        sort: DEFAULT_SORT,
        keyword,
        fields: [ 'nickname', 'id' ],
      }
    }).catch(err => debug(err))
  }

  const fetchReportsCount = (store, { keyword = '' } = {}) => {
    debug('Go fectch reports count.')
    return store.dispatch('FETCH_REPORTS_COUNT', {
      params: {
        keyword
      }
    }).catch(err => debug(err))
  }

  export default {
    name: 'ReportManagerList',
    components: {
      CreateReportPanel,
      PageControlBar,
      PageInfoBar,
      PaginationNav,
      ReportList,
    },
    data () {
      return {
        currPage: DEFAULT_PAGE,
        filter: '',
        shouldShowCreatePanel: false,
      }
    },
    computed: {
      reports () {
        return get(this.$store, 'state.reports')
      },
      reportsCount () {
        return get(this.$store, 'state.reportsCount')
      },
      totalPages () {
        return Math.ceil(this.reportsCount / MAXRESULT_REPORTS) || 1
      },
    },
    watch: {
      currPage (value) {
        debug('watch currPage', value)
        fetchReports(this.$store, {
          page: value
        })
      }
    },
    beforeMount () {
      Promise.all([
        fetchProjects(this.$store),
        fetchReports(this.$store),
        fetchReportsCount(this.$store),
      ])
    },
    methods: {
      goSearch (filter) {
        this.currPage = 1
        this.filter = filter
        Promise.all([
          fetchReports(this.$store, { page: this.currPage, keyword: this.filter }),
          fetchReportsCount(this.$store, { keyword: this.filter }),
        ])
      },
      refreshReports () {
        Promise.all([
          fetchReports(this.$store, { page: this.currPage, keyword: this.filter }),
          fetchReportsCount(this.$store, { keyword: this.filter }),
        ])
      },
    }
  }
</script>
<style lang="stylus" scoped></style>
