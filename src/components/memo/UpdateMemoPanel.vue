<template>
  <div class="update-memo-panel" @click="closePanel">
    <div class="panel">
      <div class="panel__title"><h3 v-text="$t('memo_page.update_memo')"></h3></div>
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
          input-format="YYYY/MM/DD HH:mm"
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
        <!-- <div class="panel__item--title"><span v-text="$t('memo_page.memo_description')"></span></div>
        <TextareaItem
          :placeholder="$t('memo_page.memo_description')"
          :value.sync="formData.description"></TextareaItem> -->
        <QuillEditorNews :content="content" @updateContent="$_postPanel_updateContent"/>
      </div>
      <!-- <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('memo_page.og_title')"></span></div>
        <InputItem
          :placeHolder="$t('memo_page.og_title')"
          :value.sync="formData.ogTitle"></InputItem>
      </div>
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('memo_page.og_description')"></span></div>
        <TextareaItem
          :placeholder="$t('memo_page.og_description')"
          :value.sync="formData.ogDescription"></TextareaItem>
      </div> -->
      <!-- <InputTagItem
        :placeholder="$t('memo_page.author')"
        :currTagValues.sync="currTagValues"
        :autocomplete="autocompleteForAuthor"></InputTagItem>
      <UploadImage :title="$t('memo_page.heroimage')" :imageUrl.sync="formData.heroImage"></UploadImage>
      <UploadImage :title="$t('memo_page.ogImage')" :imageUrl.sync="formData.ogImage"></UploadImage> -->
      <div class="panel__alert" v-if="alert">
        <span v-text="$t('memo_page.error_occurred') + ': '"></span>
        <span v-text="alert"></span>
      </div>
      <div class="panel__update" @click="goUpdate">
        <span v-text="$t('memo_page.button_update')" v-if="!isUpdating"></span>
        <Spinner class="panel__update__spinner" v-else="!isUpdating" :show="true"></Spinner>
      </div>
    </div>
  </div>
</template>
<script>
  import 'vue-datetime/dist/vue-datetime.css'
  import { Datetime, } from 'vue-datetime'
  import InputItem from 'src/components/formItem/InputItem.vue'
  import InputTagItem from 'src/components/formItem/InputTagItem.vue'
  import RadioItem from 'src/components/formItem/RadioItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextareaItem from 'src/components/formItem/TextareaItem.vue'
  import UploadImage from 'src/components/formItem/UploadImage.vue'
  import QuillEditorNews from 'src/components/QuillEditorNews.vue'
  import ProjectSelect from 'src/components/formItem/ProjectSelect.vue'
  import validator from 'validator'

  import { MEMO_PUBLISH_STATUS_MAP } from 'src/constants'
  import { get, map, debounce } from 'lodash'

  const debug = require('debug')('CLIENT:UpdateMemoPanel')
  const updateMemo = (store, params) => {
    return store.dispatch('UPDATE_MEMO', {
      params
    })
  }
  const getUserList = (store, params) => {
    return store.dispatch('FETCH_PEOPLE_BY_NAME', {
      params
    })
  }
  const getMember = (store, params) => {
    return store.dispatch('GET_MEMBER', {
      params
    })
  }

  export default {
    name: 'UpdateMemoPanel',
    components: {
      InputItem,
      InputTagItem,
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
        currTagValues: [ get(this.memo, 'author', '') ],
        currInputAuthor: '',
        formData: {
          description: get(this.memo, 'content', ''),
          // heroImage: get(this.memo, 'heroImage', ''),
          // ogDescription: get(this.memo, 'ogDescription', ''),
          // ogImage: get(this.memo, 'ogImage', ''),
          // ogTitle: get(this.memo, 'ogTitle', ''),
          order: get(this.memo, 'memoOrder'),
          projectId:  get(this.memo, 'projectId', ''),
          // status: get(this.memo, 'status', get(PROJECT_STATUS, [ 0, 'code' ])),
          title: get(this.memo, 'title', ''),
          updatedBy: get(this.profile, 'id'),
          isPublished: get(this.memo, 'publishStatus', get(MEMO_PUBLISH_STATUS_MAP, [ 0, 'code' ])),
          publishedAt: get(this.memo, 'publishedAt', new Date(Date.now()).toISOString())
        },
        isEditable: true,
        isUpdating: false,
        statusPublished: MEMO_PUBLISH_STATUS_MAP,
        content: get(this.memo, 'content', '')
        // status: PROJECT_STATUS,
      }
    },
    computed: {
      autocompleteForAuthor () {
        return map(get(this.$store, 'state.peopleList', []), p => ({ name: p.nickname, value: p.uuid, }))
      },
    },
    methods: {
      closePanel (e) {
        const target = e.target
        const className = target.getAttribute('class')
        if (className && className.indexOf('update-memo-panel') > -1) {
          debug('Abt to close update panel.', target.className)
          this.$emit('update:shouldShowUpdatePanel', false)
        }
      },
      get,
      goUpdate () {
        const memo = {
          id: this.memo.id,
          author: get(this.currTagValues[0], 'value', this.memo.author),
          title: get(this.formData, 'title', this.memo.title),
          content: get(this, 'content', this.memo.content),
          // hero_image: get(this.formData, 'heroImage', this.memo.heroImage),
          // og_title: get(this.formData, 'ogTitle', this.memo.ogTitle),
          // og_description: get(this.formData, 'ogDescription', this.memo.ogDescription),
          // og_image: get(this.formData, 'ogImage', this.memo.ogImage),
          memo_order: validator.toInt(`${get(this.formData, 'order')}` || '') || this.memo.memoOrder,
          project_id: get(this.formData, 'projectId', this.memo.projectId),
          updated_by: get(this.$store.state.profile, 'id'),
          // status: get(this.formData, 'status', this.memo.status),
          publish_status: get(this.formData, 'isPublished', this.memo.publishStatus),
          published_at: get(this.formData, 'publishedAt', this.memo.publishStatus)
        }
        debug('Abt to update the curr memo.', memo)
        // debug('this.formData.ogImage', get(this.formData, 'ogImage', this.memo.ogImage))
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
      fetchUserDebounce: debounce(function () {
        getUserList(this.$store, {
          keyword: this.currInputAuthor,
        })
      }, 200)
    },
    watch: {
      currInputAuthor: function () {
        debug('currInputAuthor change detected:', this.currInputAuthor)
        this.fetchUserDebounce()
      },
    },
    beforeMount () {
      getMember(this.$store, { id: this.currTagValues[0] }).then((body) => {
        this.$set(this.currTagValues, 0, { name: get(body.items[0], 'nickname', this.currTagValues[0]), value: this.currTagValues[0]})
      })
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
  .update-memo-panel
    z-index 9999
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
      // width 900px
      // max-height 80%
      width 50vw
      height 90vh
      padding 25px 50px
      border-radius 5px
      overflow auto
      > div:not(:first-child)
        margin 15px auto
        &.panel__update
          margin 30px auto 15px
      &__title
        h3
          margin 0
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
      &__update
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