<template>
  <ItemMaintainContainer :closePanelHandler="closePanel">
    <template class="panel" slot="panel">
      <div class="panel__container">
        <div class="panel__title"><h3 v-text="$t('member_page.ADMIN_UPDATE_MEMBER')"></h3></div>
      </div>
      <div class="panel__item progress">
        <div class="panel__item--title"><span v-text="$t('member_page.ADMIN_EMAIL')"></span></div>
        <InputItem placeHolder="" :disabled="true" :value.sync="formData.mail"></InputItem>
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
      <div class="panel__btn" @click="goUpdate">
        <span v-text="$t('member_page.CONFIRM_TO_UPDATE')" v-if="!isUpdating"></span>
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

  export default {
    name: 'UpdateMember',
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
        formData: {
          mail: get(this.member, 'mail'),
          role: `${get(this.member, 'role', 1)}`,
        },
        isEditable: true,
        isUpdating: false,
      }
    },
    methods: {
      closePanel () {
        this.$emit('update:active', false)
      },  
      goUpdate () {
        this.isUpdating = true
        let role = typeof(get(this.formData, 'role', get(this.member, 'role', 1))) === 'number'
          ? get(this.formData, 'role', get(this.member, 'role', 1))
          : isNaN(get(this.formData, 'role', get(this.member, 'role', 1)))
          ? Number(get(this.formData, 'role', get(this.member, 'role', 1))) : 1
        this.updateMember(this.$store, { id: this.member.id, role,}).then(() => {
          this.isUpdating = false
          this.$emit('refresh')
        }) 
      },   
    },
    mounted () {},
    props: {
      member: {
        type: Object,
        default: {}
      },
      active: {
        type: Boolean,
        default: false,
      },
      updateMember: {
        type: Function,
        default: () => {},
      },
    },
  }
</script>
<style lang="stylus" scoped></style>