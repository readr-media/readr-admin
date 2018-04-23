<template>
  <div class="memo-manager">
    <main>
      <div class="memo-manager__header">
        <div class="memo-manager__title">
          <h2 v-text="title"></h2>
        </div>
        <div class="memo-manager__create">
          <div class="button" @click="openCreatePanel"><span v-text="$t('memo_page.button_create_memo')"></span></div>
        </div>
        <div class="memo-manager__filter">
          <InputItem
            :placeHolder="$t('memo_page.please_type_id_or_nickname')"
            :value.sync="filter"></InputItem>
          <div class="search">
          
          </div>
        </div>
      </div>
      <div class="memo-manager__item th">
        <span class="id" v-text="$t('memo_page.id')"></span>
        <span class="title" v-text="$t('memo_page.title')"></span>
        <span class="project_id" v-text="$t('memo_page.project_id')"></span>
        <!-- <span class="status" v-text="$t('memo_page.status')"></span> -->
        <!-- <span class="publish-status" v-text="$t('memo_page.is_published')"></span> -->
        <span class="order" v-text="$t('memo_page.order')"></span>
        <span class="updated" v-text="$t('memo_page.updated_time')"></span>
      </div>
      <template v-for="memo in memos">
        <div class="memo-manager__item td">
          <span class="id" v-text="get(memo, 'id')" @click="updateMemo(get(memo, 'id'))"></span>
          <span class="title" v-text="get(memo, 'title')"></span>
          <span class="project_id" v-text="get(memo, 'projectId')"></span>
          <!-- <span class="status" v-text="$t(`memo_page.${get(find(PROJECT_STATUS, { code: get(memo, 'status', 0) }), 'name', 'status_canadate')}`)"></span> -->
          <!-- <span class="publish-status" v-text="$t(`memo_page.${get(find(PROJECT_PUBLISH_STATUS, { code: get(memo, 'publishStatus', 0) }), 'name', 'status_draft')}`)"></span> -->
          <span class="order" v-text="get(memo, 'memoOrder', '')"></span>
          <span class="updated" v-text="getDatetime(get(memo, 'updatedAt'))"></span>
          <span class="delete" @click="deleteMemo(get(memo, 'id'))">刪除</span>
        </div>
      </template>
      <div class="memo-manager__infobar">
        <div class="total-record"><span v-text="$t('memo_page.total')"></span><span v-text="$t('memo_page.unit')"></span></div>
        <PaginationNav totalPages='10' :currPage.sync="curr_page"></PaginationNav>
      </div>
    </main>
    <CreateMemoPanel v-if="shouldShowCreatePanel" :shouldShowCreatePanel.sync="shouldShowCreatePanel" @refreshMemos="refreshMemos"></CreateMemoPanel>
    <UpdateMemoPanel v-if="shouldShowUpdatePanel" :shouldShowUpdatePanel.sync="shouldShowUpdatePanel" @refreshMemos="refreshMemos" :memo="projGoingToUpdate"></UpdateMemoPanel>
  </div>
</template>
<script>
  import CreateMemoPanel from 'src/components/memo/CreateMemoPanel.vue'
  import InputItem from 'src/components/formItem/InputItem.vue'
  import PaginationNav from 'src/components/PaginationNav.vue'
  import UpdateMemoPanel from 'src/components/memo/UpdateMemoPanel.vue'
  import moment from 'moment'
  // import { PROJECT_STATUS, PROJECT_PUBLISH_STATUS } from 'src/constants'
  import { find, get } from 'lodash'

  const MAXRESULT_MEMOS = 20
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const debug = require('debug')('CLIENT:MemoManager')
  const fetchMemos = (store, { page }) => {
    debug('Go fectch memos.')
    return store.dispatch('FETCH_MEMOS', {
      params: {
        max_result: MAXRESULT_MEMOS,
        page: page || DEFAULT_PAGE,
        sort: DEFAULT_SORT,
      }
    }).catch(err => debug(err))
  }

  const deleteMemos = (store, { ids, updated_by }) => {
    debug('delete a memo')
    return store.dispatch('DELETE_MEMOS', {
      params: {
        ids: ids,
        updated_by: updated_by
      }
    }).catch(err => debug(err))
  }

  export default {
    name: 'MemoManager',
    components: {
      CreateMemoPanel,
      InputItem,
      PaginationNav,
      UpdateMemoPanel,
    },
    computed: {
      memos () {
        return get(this.$store, 'state.memos')
      }
    },
    data () {
      return {
        // PROJECT_STATUS,
        // PROJECT_PUBLISH_STATUS,
        curr_page: DEFAULT_PAGE,
        filter: '',
        projGoingToUpdate: {},
        shouldShowCreatePanel: false,
        shouldShowUpdatePanel: false,
        title: this.$t('memo')
      }
    },
    methods: {
      getDatetime (dateStr) {
        return dateStr && moment(new Date(dateStr)).format('YYYY/MM/DD HH:mm:ss')
      },
      find,
      get,
      openCreatePanel () {
        this.shouldShowCreatePanel = true
        this.shouldShowUpdatePanel = false
      },
      refreshMemos () {
        fetchMemos(this.$store, { page: this.curr_page })
      },
      updateMemo (projid) {
        const memo = find(this.memos, { id: projid })
        this.shouldShowCreatePanel = false
        this.shouldShowUpdatePanel = true
        debug('Abt to update memo.', memo)
        this.projGoingToUpdate = memo
      },
      deleteMemo (projid) {
        if (!projid) return
        deleteMemos(this.$store, {
          ids: [Number(projid)],
          updated_by: get(this.$store.state.profile, 'id')
        })
      }
    },
    beforeMount () {
      fetchMemos(this.$store, { page: this.curr_page })
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
        fetchMemos(this.$store, {
          page: this.curr_page
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .memo-manager
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
        &.project_id
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
        span.id, span.delete
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