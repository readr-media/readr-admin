<template>
  <ItemMaintainContainer :closePanelHandler="closePanel">
    <template slot="panel">
      <div class="panel__title"><h3 v-text="$t('memo_page.create_memo')"></h3></div>
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
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('memo_page.published_time')"></span></div>
        <Datetime 
          v-model="formData.publishedAt"
          :format="dateFormat"
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
      <div class="panel__btn" @click="goCreate">
        <span v-text="$t('memo_page.button_create')" v-if="!isSaving"></span>
        <Spinner class="panel__create__spinner" v-else="!isSaving" :show="true"></Spinner>
      </div>
    </template>
  </ItemMaintainContainer>
</template>
<script>
  import 'vue-datetime/dist/vue-datetime.css'
  import { Datetime, } from 'vue-datetime'
  import InputItem from 'src/components/formItem/InputItem.vue'
  import ItemMaintainContainer from 'src/components/ItemMaintainContainer.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextareaItem from 'src/components/formItem/TextareaItem.vue'
  import RadioItem from 'src/components/formItem/RadioItem.vue'
  import UploadImage from 'src/components/formItem/UploadImage.vue'
  import QuillEditorNews from 'src/components/QuillEditorNews.vue'
  import ProjectSelect from 'src/components/formItem/ProjectSelect.vue'
  import { MEMO_PUBLISH_STATUS_MAP } from 'src/constants'
  import { get, map, } from 'lodash'
  import validator from 'validator'

  const debug = require('debug')('CLIENT:CreateMemoPanel')
  const createMemo = (store, params) => {
    return store.dispatch('CREATE_MEMO', {
      params
    })
  }

  export default {
    name: 'CreateMemoPanel',
    components: {
      InputItem,
      ItemMaintainContainer,
      Spinner,
      TextareaItem,
      RadioItem,
      UploadImage,
      QuillEditorNews,
      Datetime,
      ProjectSelect
    },
    data () {
      return {
        alert: null,
        dateFormat: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' },
        formData: {
          description: '',
          heroImage: '',
          ogDescription: '',
          ogImage: '',
          ogTitle: '',
          order: 0,
          projectId: 0,
          status: 0,
          title: '',
          isPublished: 0,
          publishedAt: new Date(Date.now()).toISOString()
        },
        isEditable: true,
        isSaving: false,
        tagsArray: [],
        statusPublished: MEMO_PUBLISH_STATUS_MAP,
        content: '',
      }
    },
    methods: {
      get,
      closePanel (e) {
        this.$emit('update:shouldShowCreatePanel', false)
      },
      goCreate () {
        debug('Abt to create a new memo.')
        this.isSaving = true
        /**
         * ToDo: need to validate input.
         */
        createMemo(this.$store, {
          title: get(this.formData, 'title', ''),
          content: get(this, 'content', ''),
          memo_order: validator.toInt(`${get(this.formData, 'order')}` || '0'),
          // link:,
          author: get(this.$store.state, 'profile.id'),
          project_id: get(this.formData, 'projectId', 0),
          active: 1,
          updated_by: get(this.$store.state.profile, 'id'),
          publish_status: get(this.formData, 'isPublished', 0),
          published_at: get(this.formData, 'publishedAt'),
        }).then(res => {
          debug('res', res)
          this.isSaving = false
          this.$emit('refreshMemos', false)
          this.$emit('update:shouldShowCreatePanel', false)
        }).catch (err => {
          this.isSaving = false
          this.alert = err.message
          debug('err', err)
        })
      },
      $_postPanel_updateContent (content) {
        this.$set(this, 'content', content)
      },
    },
    mounted () {},
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
