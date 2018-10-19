<template>
  <div class="member-list">
    <MemberItem class="member-panel__items__item">
      <template slot="title">
        <div class="id title"><span v-text="$t('member_page.ADMIN_ID')" @click="orderBy('id')"></span></div>
        <div class="nickname title"><span v-text="$t('member_page.ADMIN_NICKNAME')" @click="orderBy('nickname')"></span></div>
        <div class="email title"><span v-text="$t('member_page.ADMIN_EMAIL')" @click="orderBy('mail')"></span></div>
        <div class="role title"><span v-text="$t('member_page.ADMIN_ROLE')" @click="orderBy('role')"></span></div>
        <div class="status title"><span v-text="$t('member_page.ADMIN_STATUS')"></span></div>
        <div class="register-type title"><span v-text="$t('member_page.ADMIN_REGISTER_TYPE')" @click="orderBy('register_mode')"></span></div>
        <div class="actions title" v-if="isClientSide">
          <div class="actions__guesteditor"><span v-text="$t('member_page.ADMIN_GUESTEDITOR')" @click="orderBy('custom_editor')"></span></div>
          <div class="filter title">
            <select @change="filterChanged">
              <option v-for="opt in filterOpts" v-text="opt.title" :value="opt.key"></option>
            </select>
          </div>
        </div>
      </template>
    </MemberItem>
    <MemberItem class="member-panel__items__item" v-for="(m, k) in members" :key="k"
      :toggleCheckboxItem="toggleCheckboxItem"
      :toogleCustomEditor="toogleCustomEditor"
      :update="update"
      :del="del"
      :index="k"
      :member="m"></MemberItem>  
    <UpdateMember
      v-if="isUpdatePanelActive"
      :member="selectedMember"
      :active.sync="isUpdatePanelActive"
      :updateMember="updateMember"
      @refresh="refreshMembers">
    </UpdateMember>   
    <AlertDelete
      v-if="isDeleteAlertActive"
      :item="selectedMember"
      :shouldShowAlert.sync="isDeleteAlertActive"
      @cancel="isDeleteAlertActive = false"
      @confirm="deleteMember">
    </AlertDelete>       
  </div>
</template>
<script>
  import AlertDelete from 'src/components/alert/AlertDelete.vue'
  import MemberItem from 'src/components/member/MemberItem.vue'
  import UpdateMember from 'src/components/member/UpdateMember.vue'
  import { CUSTOM_EDITOR_LIMIT, } from 'src/constants'
  import { FILTER, } from 'src/constants/admin'
  import { find, get, map, } from 'lodash'
  import { isClientSide } from 'src/util/comm'

  const debug = require('debug')('CLIENT:MemberList')
  const deleteMember = (store, profile) => {
    return store.dispatch('DELETE_MEMBER', {
      params: profile,
    })
  }
  const getCustomEditors = store => store.dispatch('GET_MEMBERS', {
    params: {
      custom_editor: true,
    },
  })
  const updateMember = (store, profile, type = '') => store.dispatch('UPDATE_MEMBER', {
    params: profile,
    type,
  })

  export default {
    name: 'MemberList',
    components: {
      AlertDelete,
      MemberItem,
      UpdateMember,
    },
    computed: {
      filterOpts () {
        return FILTER || []
      },
      isClientSide,
      members () {
        return get(this.$store, 'state.members.items', [])
      },
    },
    data () {
      return {
        currOrder: '',
        isDeleteAlertActive: false,
        isUpdatePanelActive: false,
        selectedMember: {},
        targMember: null,
      }
    },
    methods: {
      filterChanged (event) {
        debug()
        this.$emit('refreshMembers', { sort: event.target.value, })      
      },
      delMultiple () {},
      del (member_index) {
        const member = get(this.members, member_index, {})
        this.isDeleteAlertActive = true
        this.selectedMember = member        
      },
      deleteMember () {
        deleteMember(this.$store, { id: get(this.selectedMember, 'id'), })
        .then(() => {
          this.refreshMembers()
          this.isDeleteAlertActive = false
          this.selectedMember = {}
        })
      },
      orderBy (field) {
        if (this.currOrder === field || this.currOrder === `-${field}`) {
          this.currOrder = this.currOrder.indexOf('-') === 0 ? field : `-${field}`
          this.$emit('refreshMembers', { sort: this.currOrder, })
        } else {
          this.currOrder = field
          this.$emit('refreshMembers', { sort: field, })
        }
      },
      refreshMembers () {
        this.$emit('refreshMembers')
      },
      toogleCustomEditor (index, event) {
        const exceedMaxCustomEditor = () => {
          return get(this.$store, 'state.customEditors.items.length', 0) + 1 > CUSTOM_EDITOR_LIMIT
        }
        if (!event.target.checked) {
          this.targMember = this.members[ index ]
          updateMember(this.$store, {
            id: this.targMember.id,
            custom_editor: false,
          }).then(() => {
            event.target.checked = false
            this.updated()
            getCustomEditors(this.$store)
          })
        } else if (exceedMaxCustomEditor()) {
          this.action = 'customEditor_exceedError'
          this.showLightBox = true
          event.target.checked = false
        } else if (event.target.checked) {
          this.targMember = this.members[ index ]
          updateMember(this.$store, {
            id: this.targMember.id,
            custom_editor: true,
          }).then(() => {
            event.target.checked = true
            this.updated()
            getCustomEditors(this.$store)
          })
        }
      },
      toggleCheckboxItem () {},
      updateMember,
      update (member_index) {
        const member = get(this.members, member_index, {})
        this.isUpdatePanelActive = true
        this.selectedMember = member
      },
      updated () {
        this.$emit('refreshMembers')
      },      
    },
    mounted () {
      getCustomEditors(this.$store)
    },
  }
</script>
<style lang="stylus" scoped>
  .member-list
    margin-top 20px
    background-color #fff
    padding 20px 40px 40px
    max-height calc(100vh - 225px)
    overflow-y auto
</style>