<template>
  <div class="create-memo-panel" @click="closePanel">
    <div class="panel">
      <div class="panel__title"><h3 v-text="$t('memo_page.create_memo')"></h3></div>
      <div class="panel__container">
        <!-- <div class="panel__item">
          <div class="panel__item--title"><span v-text="$t('memo_page.status')"></span></div>
          <div class="panel__option">
            <RadioItem v-for="s in status" name="status"
              :label="$t(`memo_page.${get(s, 'name')}`)"
              :key="get(s, 'code')"
              :value="get(s, 'code')"
              :disabled="!isEditable"
              :currSelected.sync="formData.status"></RadioItem>      
          </div>
        </div> -->
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
          <!-- <InputItem
            :placeHolder="$t('memo_page.project_id')"
            :value.sync="formData.project_id"></InputItem> -->
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
        <InputTagItem
          :placeholder="$t('memo_page.author')"
          :currTagValues.sync="currTagValues"
          :tagLimitNum="1"
          :currInput.sync="currInputAuthor"
          :autocomplete="autocompleteForAuthor"></InputTagItem>
      </div>
      <div class="panel__item">
        <!-- <div class="panel__item--title"><span v-text="$t('memo_page.memo_description')"></span></div> -->
        <!-- <TextareaItem
          :placeholder="$t('memo_page.memo_description')"
          :value.sync="formData.description"></TextareaItem> -->
          <QuillEditorNews :content="content" @updateContent="$_postPanel_updateContent"/>
      </div>
      <!-- <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('memo_page.og_title')"></span></div>
        <InputItem
          :placeHolder="$t('memo_page.og_title')"
          :value.sync="formData.ogTitle"></InputItem>
      </div> -->
      <!-- <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('memo_page.og_description')"></span></div>
        <TextareaItem
          :placeholder="$t('memo_page.og_description')"
          :value.sync="formData.ogDescription"></TextareaItem>
      </div> -->
      <!-- <InputTagItem
        :placeholder="$t('memo_page.author')"
        :currTagValues.sync="currTagValues"
        :autocomplete="autocompleteForAuthor"></InputTagItem> -->
      <!-- <UploadImage :title="$t('memo_page.heroimage')" :imageUrl.sync="formData.heroImage"></UploadImage>
      <UploadImage :title="$t('memo_page.ogImage')" :imageUrl.sync="formData.ogImage"></UploadImage> -->
      <div class="panel__alert" v-if="alert">
        <span v-text="$t('memo_page.error_occurred') + ': '"></span>
        <span v-text="alert"></span>
      </div>
      <div class="panel__create" @click="goCreate">
        <span v-text="$t('memo_page.button_create')" v-if="!isSaving"></span>
        <Spinner class="panel__create__spinner" v-else="!isSaving" :show="true"></Spinner>
      </div>
    </div>
  </div>
</template>
<script>
  import 'vue-datetime/dist/vue-datetime.css'
  import { Datetime, } from 'vue-datetime'
  import InputItem from 'src/components/formItem/InputItem.vue'
  import InputTagItem from 'src/components/formItem/InputTagItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextareaItem from 'src/components/formItem/TextareaItem.vue'
  import RadioItem from 'src/components/formItem/RadioItem.vue'
  import UploadImage from 'src/components/formItem/UploadImage.vue'
  import QuillEditorNews from 'src/components/QuillEditorNews.vue'
  import ProjectSelect from 'src/components/memo/ProjectSelect.vue'
  import { MEMO_PUBLISH_STATUS_MAP } from 'src/constants'
  import { get, map, debounce, } from 'lodash'
  import validator from 'validator'

  const debug = require('debug')('CLIENT:CreateMemoPanel')
  const createMemo = (store, params) => {
    return store.dispatch('CREATE_MEMO', {
      params
    })
  }
  const fetchAuthors = (store, params) => {
    return store.dispatch('FETCH_PEOPLE_BY_NAME', {
     params
    })
  }
  const getUserList = (store, params) => {
    return store.dispatch('FETCH_PEOPLE_BY_NAME', {
      params
    })
  }
  export default {
    name: 'CreateMemoPanel',
    components: {
      InputItem,
      InputTagItem,
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
        currTagValues: [],
        currInputAuthor: '',
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
    computed: {
      autocompleteForAuthor () {
        return map(get(this.$store, 'state.peopleList', []), p => ({ name: p.nickname, value: p.uuid, }))
      },
    },
    methods: {
      get,
      closePanel (e) {
        const target = e.target
        const className = target.getAttribute('class')
        if (className && className.indexOf('create-memo-panel') > -1) {
          debug('Abt to close panel.', target.className)
          this.$emit('update:shouldShowCreatePanel', false)
        }
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
          author: get(this.currTagValues[0], 'value', get(this.$store.state.profile, 'id')),
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
      fetchUserDebounce: debounce(function () {
        getUserList(this.$store, {
          keyword: this.currInputAuthor,
        })
      }, 200)
    },
    mounted () {},
    watch: {
      currInputAuthor: function () {
        debug('currInputAuthor change detected:', this.currInputAuthor)
        if (this.currTagValues.length === 0) {
          this.fetchUserDebounce()
        }
      },
    }
  }
</script>
<style lang="stylus" scoped>
  .create-memo-panel
    position fixed
    top 0
    left 0
    width 100vw
    height 100vh
    display flex
    align-items center
    justify-content center
    background-color rgba(0, 0, 0, 0.6)
    .panel
      background-color #efefef
      // box-shadow 0 0 10px #afafaf
      width 900px
      max-height 80%
      padding 25px 50px
      border-radius 5px
      overflow auto
      > div:not(:first-child)
        margin 15px auto
        &.panel__create
          margin 30px auto 15px
      &__container
        width 100%
        display flex
        > div:not(:first-child)
          margin-left 20px
      &__item
        display flex
        &--title
          background-color #fff
          > span
            padding 5px 10px
            display flex
            justify-content center
            align-items center
            color #777
            background-color #e2e2e2
            height 100%
            max-height 35px
        > div:not(.panel__item--title)
          flex 1
        &.project_id, &.publish-status
          flex 1
      &__title
        h3
          margin 0
      &__create
        width 100%
        height 40px
        background-color #000
        border-radius 5px
        display flex
        justify-content center
        align-items center
        color #fff
        padding 10px 20px
        cursor pointer
      &__alert
        color red
      &__option
        // margin-left 10px
        display flex
        justify-content flex-start
        align-items center
        background-color #fff
        padding-left 20px
        > div
          display inline-block
          &:first-child
            margin 0 20px 0 0
          &:not(:first-child)
            margin 0 20px

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
    border: none;
    width: 100%;
    height: 35px;
    font-size: 1.125rem;
    padding: 0 10px;
    vertical-align: top;
    background-color: #fff;
    outline: none;
    font-weight: 100;
</style>
