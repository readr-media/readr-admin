<template>
  <div class="memo-manager backstage">
    <main>
      <PageControlBar :amount="1" :initFilter="filter" :title="$t('memo')" @goSearch="goSearch">
        <button slot="0" @click="shouldShowCreatePanel = true" v-text="$t('memo_page.button_create_memo')"></button>
      </PageControlBar>
      <MemoList :memos="memos" @refreshMemos="refreshMemos"></MemoList>
      <PageInfoBar :totalItems="memosCount">
        <PaginationNav :totalPages='totalPages' :currPage.sync="curr_page"></PaginationNav>
      </PageInfoBar>
    </main>
    <CreateMemoPanel
      v-if="shouldShowCreatePanel"
      :shouldShowCreatePanel.sync="shouldShowCreatePanel"
      @refreshMemos="refreshMemos">
    </CreateMemoPanel>
  </div>
</template>
<script>
  import CreateMemoPanel from 'src/components/memo/CreateMemoPanel.vue'
  import MemoList from 'src/components/memo/MemoList.vue'
  import PageControlBar from 'src/components/PageControlBar.vue'
  import PageInfoBar from 'src/components/PageInfoBar.vue'
  import PaginationNav from 'src/components/PaginationNav.vue'
  import { get } from 'lodash'

  const MAXRESULT_PROJECTS = 50
  const MAXRESULT_MEMOS = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const debug = require('debug')('CLIENT:MemoManager')
  const fetchMemos = (store, { page, keyword = '' }) => {
    debug('Go fectch memos.')
    return store.dispatch('FETCH_MEMOS', {
      params: {
        maxResult: MAXRESULT_MEMOS,
        memberId: get(store, 'state.profile.id'),
        page: page || DEFAULT_PAGE,
        sort: 'memo_order',
        keyword: keyword
      }
    }).catch(err => debug(err))
  }

  const fetchMemosCount = (store) => {
    debug('Go fectch memos count.')
    return store.dispatch('FETCH_MEMOS_COUNT').catch(err => debug(err))
  }

  const fetchProjects = (store, { page = DEFAULT_PAGE } = {}) => {
    return store.dispatch('FETCH_PROJECTS', {
      params: {
        maxResult: MAXRESULT_PROJECTS,
        page: page,
        sort: '-published_at',
      }
    }).catch(err => debug(err))
  }

  export default {
    name: 'MemoManagerList',
    components: {
      CreateMemoPanel,
      MemoList,
      PageControlBar,
      PageInfoBar,
      PaginationNav,
    },
    data () {
      return {
        curr_page: DEFAULT_PAGE,
        filter: '',
        shouldShowCreatePanel: false
      }
    },
    computed: {
      memos () {
        return get(this.$store, 'state.memos')
      },
      memosCount () {
        return get(this.$store, 'state.memosCount')
      },
      totalPages () {
        return Math.ceil(this.memosCount / MAXRESULT_MEMOS) || 1
      },
    },
    watch: {
      curr_page: function () {
        debug('this.curr_page', this.curr_page)
        fetchMemos(this.$store, { page: this.curr_page })
      }
    },
    beforeMount () {
      Promise.all([
        fetchMemos(this.$store, { page: this.curr_page }),
        fetchMemosCount(this.$store),
        fetchProjects(this.$store),
      ])
    },
    methods: {
      goSearch (filter) {
        this.curr_page = 1
        this.filter = filter
        Promise.all([
          fetchMemos(this.$store, { page: this.curr_page, keyword: this.filter }),
          fetchMemosCount(this.$store, { keyword: this.filter }),
        ])
      },
      refreshMemos () {
        Promise.all([
          fetchMemos(this.$store, { page: this.curr_page, keyword: this.filter }),
          fetchMemosCount(this.$store, { keyword: this.filter }),
        ])
      }
    }
  }
</script>
<style lang="stylus" scoped></style>
