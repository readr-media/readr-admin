<template>
  <ItemMaintainContainer :closePanelHandler="closePanel">
    <template slot="panel">
      <div class="panel__title"><h3 v-text="$t('memo_page.update_memo')"></h3></div>
      <div class="panel__container">
        <div class="panel__item publish-status">
          <div class="panel__item--title"><span v-text="$t('memo_page.is_published')"></span></div>
          <div class="panel__option">
            <RadioItem v-for="s in statusPublished" name="isPublished"
              :label="$t(`memo_page.${get(s, 'name')}`)"
              :key="get(s, 'code')"
              :value="get(s, 'code')"
              :disabled="!isEditable"
              :currSelected.sync="formData.isPublished"></RadioItem>
          </div>
        </div>
      </div>
      <div class="panel__item puclished-time">
        <div class="panel__item--title"><span v-text="$t('memo_page.published_time')"></span></div>
        <Datetime 
          v-model="formData.publishedAt"
          input-format="YYYY/MM/DD HH:mm"
          input-class="datepicker__input"
          type="datetime"/>
      </div>
      <div class="panel__container">
        <div class="panel__item">
          <div class="panel__item--title"><span v-text="$t('memo_page.order')"></span></div>
          <InputItem width="60px"
            :placeHolder="$t('memo_page.order')"
            :value.sync="formData.order"></InputItem>
        </div>
        <div class="panel__item project_id">
          <div class="panel__item--title"><span v-text="$t('memo_page.project_id')"></span></div>
          <ProjectSelect class="project-select" :projectId.sync="formData.projectId"/>
        </div>
      </div>
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('memo_page.title')"></span></div>
        <InputItem
          :placeHolder="$t('memo_page.title')"
          :value.sync="formData.title"></InputItem>
      </div>
      <div class="panel__item">
        <QuillEditorNews :content="content" @updateContent="$_postPanel_updateContent"/>
      </div>
      <div class="panel__alert" v-if="alert">
        <span v-text="$t('memo_page.error_occurred') + ': '"></span>
        <span v-text="alert"></span>
      </div>
      <div class="panel__btn" @click="goUpdate">
        <span v-text="$t('memo_page.button_update')" v-if="!isUpdating"></span>
        <Spinner class="panel__update__spinner" v-else="!isUpdating" :show="true"></Spinner>
      </div>
    </template>
  </ItemMaintainContainer>
</template>
<script>
  import 'vue-datetime/dist/vue-datetime.css'
  import { Datetime, } from 'vue-datetime'
  import InputItem from 'src/components/formItem/InputItem.vue'
  import ItemMaintainContainer from 'src/components/ItemMaintainContainer.vue'  
  import RadioItem from 'src/components/formItem/RadioItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextareaItem from 'src/components/formItem/TextareaItem.vue'
  import UploadImage from 'src/components/formItem/UploadImage.vue'
  import QuillEditorNews from 'src/components/QuillEditorNews.vue'
  import ProjectSelect from 'src/components/formItem/ProjectSelect.vue'
  import validator from 'validator'

  import { MEMO_PUBLISH_STATUS_MAP } from 'src/constants'
  import { get, map } from 'lodash'

  const debug = require('debug')('CLIENT:UpdateMemoPanel')
  const updateMemo = (store, params) => {
    return store.dispatch('UPDATE_MEMO', {
      params
    })
  }

  export default {
    name: 'UpdateMemoPanel',
    components: {
      InputItem,
      ItemMaintainContainer,
      RadioItem,
      Spinner,
      TextareaItem,
      UploadImage,
      QuillEditorNews,
      Datetime,
      ProjectSelect
    },
    computed: {
      statusValue () {
        return get(this.status, [ 0, 'code' ])
      },
    },
    data () {
      return {
        alert: null,
        formData: {
          description: get(this.memo, 'content', ''),
          order: get(this.memo, 'memoOrder'),
          projectId:  get(this.memo, 'projectId', ''),
          title: get(this.memo, 'title', ''),
          updatedBy: get(this.profile, 'id'),
          isPublished: get(this.memo, 'publishStatus', get(MEMO_PUBLISH_STATUS_MAP, [ 0, 'code' ])),
          publishedAt: get(this.memo, 'publishedAt', new Date(Date.now()).toISOString())
        },
        isEditable: true,
        isUpdating: false,
        statusPublished: MEMO_PUBLISH_STATUS_MAP,
        content: get(this.memo, 'content', '')
      }
    },
    methods: {
      closePanel (e) {
        this.$emit('update:shouldShowUpdatePanel', false)
      },
      get,
      goUpdate () {
        const memo = {
          id: this.memo.id,
          title: get(this.formData, 'title', this.memo.title),
          content: get(this, 'content', this.memo.content),
          memo_order: validator.toInt(`${get(this.formData, 'order')}` || '') || this.memo.memoOrder,
          project_id: get(this.formData, 'projectId', this.memo.projectId),
          updated_by: get(this.$store.state.profile, 'id'),
          publish_status: get(this.formData, 'isPublished', this.memo.publishStatus),
          published_at: get(this.formData, 'publishedAt', this.memo.publishStatus)
        }
        debug('Abt to update the curr memo.', memo)
        this.isUpdating = true
        updateMemo(this.$store, memo)
          .then(res => {
            debug('res', res)
            this.isUpdating = false
            this.$emit('refreshMemos', false)
            this.$emit('update:shouldShowUpdatePanel', false)
          })
          .catch(err => {
            this.isUpdating = false
            debug('err', err)
          })
      },
      setInputValue (key, value) {
        this.formData[ key ] = value
      },
      selectedHandler (group, value) {
        this.selectedOption[ group ] = value
      },
      $_postPanel_updateContent (content) {
        this.$set(this, 'content', content)
      },
    },
    mounted () {},
    props: {
      memo: {
        type: Object
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .vdatetime
    >>> input
      border none
      width 100%
      height 35px
      font-size 1.125rem
      padding 0 10px
      vertical-align top
      background-color #fff
      outline none
      font-weight 100
  .project-select
    border none
    flex 1
    height 35px
    font-size 1.125rem
    padding 0 10px
    vertical-align top
    background-color #fff
    outline none
    font-weight 100
</style>