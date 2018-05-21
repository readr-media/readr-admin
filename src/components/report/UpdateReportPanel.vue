<template>
  <div class="update-report-panel" @click.self="closePanel">
    <div class="panel">
      <h2 v-text="$t('report_page.update_report')"></h2>
      <div class="item" :class="{ 'item--error': includes(validateErrors, 'projectId') }">
        <div class="item__title" v-text="$t('report_page.belong_to_project')"></div>
        <InputItem
          :placeHolder="$t('report_page.belong_to_project')"
          :type="'number'"
          :value.sync="formData.projectId"></InputItem>
      </div>
      <div class="item" :class="{ 'item--error': includes(validateErrors, 'slug') }">
        <div class="item__title" v-text="$t('report_page.slug')"></div>
        <InputItem
          :placeHolder="$t('report_page.slug')"
          :value.sync="formData.slug"></InputItem>
      </div>
      <div class="item" :class="{ 'item--error': includes(validateErrors, 'title') }">
        <div class="item__title" v-text="$t('report_page.title')"></div>
        <InputItem
          :placeHolder="$t('report_page.title')"
          :value.sync="formData.title"></InputItem>
      </div>
      <div class="item" :class="{ 'item--error': includes(validateErrors, 'description') }">
        <div class="item__title item--description" v-text="$t('report_page.description')"></div>
        <TextareaItem
          :placeholder="$t('report_page.description')"
          :value.sync="formData.description"></TextareaItem>
      </div>
      <div class="item" :class="{ 'item--error': includes(validateErrors, 'ogTitle') }">
        <div class="item__title" v-text="$t('report_page.og_title')"></div>
        <InputItem
          :placeHolder="$t('report_page.og_title')"
          :value.sync="formData.ogTitle"></InputItem>
      </div>
      <div class="item" :class="{ 'item--error': includes(validateErrors, 'ogDescription') }">
        <div class="item__title item--description" v-text="$t('report_page.og_description')"></div>
        <TextareaItem
          :placeholder="$t('report_page.og_description')"
          :value.sync="formData.ogDescription"></TextareaItem>
      </div>
      <div class="item" :class="{ 'item--error': includes(validateErrors, 'author') }">
        <div class="item__title" v-text="$t('report_page.author')"></div>
        <InputTagItem
          :placeholder="$t('report_page.author')"
          :currTagValues.sync="currTagValues"
          :currInput.sync="currTagInput"></InputTagItem>
      </div>
      <div class="panel__multiple">
        <div class="item" :class="{ 'item--error': includes(validateErrors, 'heroimage') }">
          <UploadImage class="panel__item upload" :title="$t('report_page.heroimage')" :imageUrl.sync="formData.heroImage"></UploadImage>
        </div>
        <div class="item" :class="{ 'item--error': includes(validateErrors, 'ogImage') }">
          <UploadImage class="panel__item upload" :title="$t('report_page.og_image')" :imageUrl.sync="formData.ogImage"></UploadImage>
        </div>
      </div>
      <div class="panel__multiple">
        <div class="item" :class="{ 'item--error': includes(validateErrors, 'ogTitle') }">
          <div class="item__title" v-text="$t('report_page.is_published')"></div>
          <div class="item__option">
            <RadioItem v-for="s in statusPublished" name="isPublished"
              :label="$t(`report_page.${get(s, 'name')}`)"
              :key="get(s, 'code')"
              :value="get(s, 'code')"
              :disabled="!isEditable"
              :currSelected.sync="formData.publishStatus"></RadioItem>
          </div>
        </div>
        <div class="item" :class="{ 'item--error': includes(validateErrors, 'publishedAt') }">
          <div class="item__title" v-text="$t('report_page.published_time')"></div>
          <Datetime
            v-model="formData.publishedAt"
            type="datetime"
            input-class="datepicker__input"
            :format="dateFormat"></Datetime>
        </div>
      </div>
      <button :disabled="isUpdating" @click="goUpdate">
        <span v-if="!isUpdating" v-text="$t('report_page.button_update')"></span>
        <Spinner v-else class="panel__create__spinner" :show="true"></Spinner>
      </button>
    </div>
  </div>
</template>
<script>
  import { Datetime } from 'vue-datetime'
  import { REPORT_PUBLISH_STATUS, } from 'api/config'
  import { REPORT_PUBLISH_STATUS_MAP } from 'src/constants'
  import { get, includes, } from 'lodash'
  import InputItem from 'src/components/formItem/InputItem.vue'
  import InputTagItem from 'src/components/formItem/InputTagItem.vue'
  import RadioItem from 'src/components/formItem/RadioItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextareaItem from 'src/components/formItem/TextareaItem.vue'
  import UploadImage from 'src/components/formItem/UploadImage.vue'
  import moment from 'moment'

  import 'vue-datetime/dist/vue-datetime.css'

  const debug = require('debug')('CLIENT:UpdateReportPanel')
  
  const fetchUserList = (store, params) => {
    return store.dispatch('FETCH_PEOPLE_BY_NAME', {
      params
    })
  }
  const updateReport = (store, params) => {
    return store.dispatch('UPDATE_REPORT', {
      params
    })
  }
  
  export default {
    name: 'UpdateReportPanel',
    components: {
      Datetime,
      InputItem,
      InputTagItem,
      RadioItem,
      Spinner,
      TextareaItem,
      UploadImage,
    },
    props: {
      report: {
        type: Object
      }
    },
    data () {
      return {
        config: REPORT_PUBLISH_STATUS,
        currTagValues: [ 'test' ],
        currTagInput: '',
        dateFormat: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' },
        formData: {
          description: get(this.report, 'description', ''),
          heroImage: get(this.report, 'heroImage', ''),
          id: get(this.report, 'id'),
          publishStatus: get(this.report, 'publishStatus', get(REPORT_PUBLISH_STATUS, [ 0, 'code' ])),
          memoPoints: get(this.report, 'memoPoints'),
          ogDescription: get(this.report, 'ogDescription', ''),
          ogImage: get(this.report, 'ogImage', ''),
          ogTitle: get(this.report, 'ogTitle', ''),
          order: get(this.report, 'projectOrder'),
          progress: get(this.report, 'progress'),
          projectId: get(this.report, 'projectId'),
          publishedAt: get(this.report, 'publishedAt') ? get(this.report, 'publishedAt') : null,
          slug:  get(this.report, 'slug', ''),
          title: get(this.report, 'title', ''),
          updatedBy: `${get(this.$store, 'state.profile.id')}`,
        },
        isEditable: true,
        isUpdating: false,
        statusPublished: REPORT_PUBLISH_STATUS_MAP,
        validateErrors: [],
      }
    },
    watch: {
      currInputAuthor (value) {
        debug('currInputAuthor change detected:', value)
        fetchUserList(this.$store, {
          keyword: value,
        })
      },
    },
    mounted () {
      console.log('config', this.config)
    },
    methods: {
      closePanel () {
        this.$emit('update:shouldShowUpdatePanel', false)
      },
      get,
      goUpdate () {
        debug('moment', moment(new Date(get(this.formData, 'publishedAt', this.report.publishedAt))).format('YYYY-MM-DD hh:mm:ss'))
        debug('Abt to update the curr report.', this.report)
        debug('this.formData.ogImage', get(this.formData, 'ogImage', this.report.ogImage))
        this.isUpdating = true

        this.formData.projectId = Number(this.formData.projectId)
        this.formData.publishedAt = this.formData.publishedAt ? this.formData.publishedAt : null
    
        updateReport(this.$store, this.formData)
          .then(res => {
            debug('res', res)
            this.isUpdating = false
            this.$emit('refreshReports', false)
            this.$emit('update:shouldShowUpdatePanel', false)
          })
          .catch(err => {
            this.isUpdating = false
            debug('err', err)
          })
      },
      includes,
    },
  }
</script>
<style lang="stylus" scoped>
  theme-color = hsl(176.1, 40.9%, 70.8%)
  theme-color-dark = hsl(176.1, 40.9%, 50.8%)

  .update-report-panel
    display flex
    align-items center
    justify-content center
    position fixed
    top 0
    left 0
    width 100%
    height 100vh
    color #000
    background-color rgba(0, 0, 0, 0.6)
    z-index 9999
    h2
      margin 0 0 15px
      font-size 1.25rem
    button
      display flex
      align-items center
      justify-content center
      width 100%
      height 40px
      margin-top 50px
      padding 0
      background-color theme-color
      border none
      outline none
      &:hover
        background-color theme-color-dark

  .panel
    width 1100px
    max-height 100vh
    padding 30px 50px 50px
    background-color #f2f2f2
    border-radius 10px
    overflow-y auto
    &__multiple
      flex 1
      display flex
      & + .panel__multiple
        margin-top 20px
      .item
        margin-top 0
        & + .item
          margin-left 40px
      .panel__multiple + .item
        margin-left 40px

  .item
    flex 1
    display flex
    align-items center
    margin-top 20px
    font-size 1.25rem
    > div:not(.item__title)
      flex 1
    & + .panel__multiple
      margin-top 20px
    &__title
      min-width 80px
      margin-right 15px
    &__option
      flex 1
      display flex
      justify-content space-between
      align-items center
      height 100%
      padding 0 20px
      background-color #fff
      
    &--error
      // >>> input
      //   background-color #ffe5e5 !important
      //   border 1px solid #ff0000 !important
    &--description
      align-self flex-start
    &--not-full
      flex 0 1 auto
</style>
