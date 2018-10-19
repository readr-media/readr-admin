<template>
  <div class="member-manager backstage">
    <main>
      <PageControlBar :amount="1" :initFilter="filter" :title="$t('member')" @goSearch="goSearch">
        <button slot="0" @click="isCreaterActive = true" v-text="$t('member_page.ADMIN_ADD_MEMBER')"></button>
      </PageControlBar>
      <MemberList @refreshMembers="refreshMembers"></MemberList>
      <PageInfoBar :totalItems="membersCount">
        <PaginationNav :totalPages='totalPages' :currPage.sync="curr_page"></PaginationNav>
      </PageInfoBar>          
    </main>  
    <CreateMember
      v-if="isCreaterActive"
      :active.sync="isCreaterActive"
      @refresh="refreshMembers">
    </CreateMember>
  </div>
</template>
<script>
  import CreateMember from 'src/components/member/CreateMember.vue'
  import MemberList from 'src/components/member/MemberList.vue'
  import PageControlBar from 'src/components/PageControlBar.vue'
  import PageInfoBar from 'src/components/PageInfoBar.vue'
  import PaginationNav from 'src/components/PaginationNav.vue'
  import { get, } from 'lodash'

  const MAXRESULT = 15
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const debug = require('debug')('CLIENT:MemberManager')
  const getMembers = (store, { page, sort, keyword, type, }) => {
    const fields = keyword && [ 'mail', 'role', 'custom_editor', ]
    return store.dispatch('GET_MEMBERS', {
      params: {
        maxResult: MAXRESULT,
        page: page || DEFAULT_PAGE,
        sort: sort || DEFAULT_SORT,
        keyword,
        fields,
      },
      type,
    })
  }

  const getMembersCount = (store, params = {}) => {
    return store.dispatch('GET_MEMBERS_COUNT', {
      params,
    })
  }

  export default {
    name: 'MemberManager',
    components: {
      CreateMember,
      MemberList,
      PageControlBar,
      PageInfoBar,
      PaginationNav,
    },
    computed: {
      membersCount () {
        return get(this.$store, 'state.membersCount')
      },
      totalPages () {
        return (Math.floor(get(this.$store, 'state.membersCount') / MAXRESULT)) + 1
      },      
    },
    data () {
      return {
        curr_page: 1,
        curr_sort: DEFAULT_SORT,
        filter: '',
        isCreaterActive: false,
      }
    },
    methods: {
      goSearch (filter) {
        this.curr_page = 1
        this.filter = filter
        if (filter) {
          this.$can('memberManage') && Promise.all([
            getMembers(this.$store, { page: this.curr_page, keyword: this.filter, type: 'byname' }),
            getMembersCount(this.$store, { keyword: this.filter }),
          ])
        } else {
          this.$can('memberManage') && Promise.all([
            getMembers(this.$store, { type: 'normal', }),
            getMembersCount(this.$store),
          ])
        }
      },
      refreshMembers (filter = {}) {
        this.curr_page = filter.page || this.curr_page
        this.curr_sort = filter.sort || this.curr_sort
        const { keyword, } = filter

        if (!keyword) {
          this.lastSearchType !== 'normal' && (this.curr_page = 1)
          this.lastSearchType = 'normal'
          return Promise.all([
            getMembers(this.$store, { page: this.curr_page, sort: this.curr_sort, type: this.lastSearchType, }),
            getMembersCount(this.$store),
          ])
        } else {
          this.lastSearchType !== 'byname' && (this.curr_page = 1)
          this.lastSearchType = 'byname'
          return Promise.all([
            getMembers(this.$store, { page: this.curr_page, sort: this.curr_sort, keyword, type: this.lastSearchType, }),
            getMembersCount(this.$store),
          ])
        }
      },      
    },
    beforeMount () {
      this.$can('memberManage') && Promise.all([
        getMembers(this.$store, { type: 'normal', }),
        getMembersCount(this.$store),
      ])      
    },
    mounted () {
    },
    watch: {
      curr_page: function () {
        getMembers(this.$store, { page: this.curr_page })
      }
    },
  }
</script>
<style lang="stylus" scoped></style>