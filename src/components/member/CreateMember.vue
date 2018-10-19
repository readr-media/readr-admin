<template>
  <ItemMaintainContainer :closePanelHandler="closePanel">
    <template class="panel" slot="panel">
      <div class="panel__container">
        <div class="panel__title"><h3 v-text="$t('member_page.ADMIN_ADD_MEMBER')"></h3></div>
      </div>
      <div class="panel__item progress">
        <div class="panel__item--title"><span v-text="$t('member_page.ADMIN_EMAIL')"></span></div>
        <InputItem placeHolder="" :disabled="!isEditable" :value.sync="formData.mail"></InputItem>
      </div>      
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('member_page.ADMIN_ROLE')"></span></div>
        <div class="panel__option">
          <RadioItem v-for="(n, k) in ROLES" name="status"
            :label="n"
            :key="k"
            :value="k"
            :disabled="!isEditable"
            :currSelected.sync="formData.role"></RadioItem>
        </div>
      </div>
      <div class="panel__item" v-if="error"><span v-text="error"></span></div>
      <div class="panel__btn" @click="goCreate">
        <span v-text="isDone ? $t('member_page.CONFIRM') : $t('member_page.CONFIRM_TO_ADD')" v-if="!isCreating"></span>
        <Spinner class="panel__update__spinner" v-else :show="true"></Spinner>
      </div>
    </template>
  </ItemMaintainContainer>
</template>
<script>
  import ItemMaintainContainer from 'src/components/ItemMaintainContainer.vue'
  import InputItem from 'src/components/formItem/InputItem.vue'
  import RadioItem from 'src/components/formItem/RadioItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import { ROLE_MAP, } from 'src/constants'
  import { get, map, } from 'lodash'

  const addMember = (store, profile) => {
    return store.dispatch('ADD_MEMBER', {
      params: profile,
    })
  }

  export default {
    name: 'CreateMember',
    components: {
      ItemMaintainContainer,
      InputItem,
      RadioItem,
      Spinner,
    },
    computed: {
      ROLES () {
        const roles = {}
        map(ROLE_MAP, role => {
          roles[ role.key ] = role.value
        })
        return roles
      }, 
    },
    data () {
      return {
        error: '',
        formData: {},
        isCreating: false,
        isEditable: true,
        isDone: false,
      }
    },
    methods: {
      closePanel () {
        this.$emit('update:active', false)
      },
      goCreate () {
        if (this.isDone) { return this.closePanel() }
        this.isCreating = true
        let role = typeof(get(this.formData, 'role', get(this.member, 'role', 1))) === 'number'
          ? get(this.formData, 'role', get(this.member, 'role', 1))
          : isNaN(get(this.formData, 'role', get(this.member, 'role', 1)))
          ? Number(get(this.formData, 'role', get(this.member, 'role', 1))) : 1        
        addMember(this.$store, { email: this.formData.mail, role, })
        .then(() => {
          this.isCreating = false
          this.isDone = true
          this.isEditable = false
          this.$emit('refresh')
        }).catch(err => {
          this.error = err
        })
      },
    },
    mounted () {},
    props: {
      active: {
        type: Boolean,
        default: false,
      },
    },
  }
</script>
<style lang="stylus" scoped></style>