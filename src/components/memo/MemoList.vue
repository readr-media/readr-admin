<template>
  <section class="memo-list">
    <div class="memo-manager__item th">
      <span class="id" v-text="$t('memo_page.id')"></span>
      <span class="title" v-text="$t('memo_page.title')"></span>
      <span class="project_id" v-text="$t('memo_page.project_id')"></span>
      <!-- <span class="status" v-text="$t('memo_page.status')"></span> -->
      <span class="publish-status" v-text="$t('memo_page.is_published')"></span>
      <span class="order" v-text="$t('memo_page.order')"></span>
      <span class="updated" v-text="$t('memo_page.updated_time')"></span>
    </div>
    <template v-for="memo in memos">
      <div :key="memo.id" class="memo-manager__item td">
        <span class="id" v-text="get(memo, 'id')"></span>
        <span class="title" @click="updateMemo(get(memo, 'id'))" v-text="get(memo, 'title')"></span>
        <span class="project_id" v-text="get(memo, 'project.title')"></span>
        <!-- <span class="status" v-text="$t(`memo_page.${get(find(PROJECT_STATUS, { code: get(memo, 'status', 0) }), 'name', 'status_canadate')}`)"></span> -->
        <span class="publish-status" v-text="$t(`memo_page.${get(find(MEMO_PUBLISH_STATUS_MAP, { code: get(memo, 'publishStatus', 0) }), 'name', 'status_draft')}`)"></span>
        <span class="order" v-text="get(memo, 'memoOrder', '')"></span>
        <span class="updated" v-text="getDatetime(get(memo, 'updatedAt'))"></span>
        <span class="action">
          <button @click="updateMemo(get(memo, 'id'))" v-text="$t('memo_page.button_update')"></button>
          <button @click="deleteMemo(get(memo, 'id'))" v-text="$t('memo_page.button_delete')"></button>
        </span>
        <!-- <span class="delete" @click="deleteMemo(get(memo, 'id'))">刪除</span> -->
      </div>
    </template>
    <UpdateMemoPanel
      v-if="shouldShowUpdatePanel"
      :memo="memoGoingToUpdate"
      :shouldShowUpdatePanel.sync="shouldShowUpdatePanel"
      @refreshMemos="refreshMemos">
    </UpdateMemoPanel>
  </section>
</template>
<script>
  import UpdateMemoPanel from 'src/components/memo/UpdateMemoPanel.vue'
  import moment from 'moment'
  import { MEMO_PUBLISH_STATUS_MAP } from 'src/constants'
  import { find, get } from 'lodash'
  import { getDatetime } from 'src/util/comm.js'

  const debug = require('debug')('CLIENT:MemoList')

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
    name: 'MemoList',
    components: {
      UpdateMemoPanel,
    },
    props: {
      memos: {
        type: Array,
      }
    },
    data () {
      return {
        MEMO_PUBLISH_STATUS_MAP,
        memoGoingToUpdate: {},
        shouldShowUpdatePanel: false,
      }
    },
    methods: {
      deleteMemo (id) {
        debug('Going to del this proj')
        deleteMemos(this.$store, {
          ids: [Number(id)],
          updated_by: get(this.$store.state.profile, 'id')
        }).then(() => {
          this.$emit('refreshMemos')
        })
      },
      find,
      get,
      getDatetime,
      refreshMemos () {
        this.$emit('refreshMemos')
      },
      updateMemo (memoId) {
        const memo = find(this.memos, { id: memoId })
        debug('Abt to update memo.', memo)
        this.memoGoingToUpdate = memo
        this.shouldShowUpdatePanel = true
      }
    }
  }
</script>
<style lang="stylus" scoped>
  theme-color = hsl(176.1, 40.9%, 70.8%)

  .memo-list
    max-height calc(100vh - 225px)
    margin-top 20px
    padding-right 15px
    overflow-y auto
  
  .memo-manager
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
          width 30%
        &.updated
          width 20%
        // &.count
        //   width 10%
        &.project_id
          width 15%
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
