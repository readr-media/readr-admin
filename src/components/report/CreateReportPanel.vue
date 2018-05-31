<template>
  <div class="create-report-panel" @click.self="closePanel">
    <div class="panel">
      <h2 v-text="$t('report_page.create_report')"></h2>
      <div class="item" :class="{ 'item--error': includes(validateErrors, 'projectId') }">
        <div class="item__title" v-text="$t('report_page.belong_to_project')"></div>
        <ProjectSelect class="project-select" :projectId.sync="formData.projectId"/>
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
          :autocomplete="autocompleteForAuthor"
          :currInput.sync="currInputAuthor"
          :currTagValues.sync="currTagValues"
          :placeholder="$t('report_page.author')"></InputTagItem>
      </div>
      <div class="panel__multiple">
        <div class="item" :class="{ 'item--error': includes(validateErrors, 'heroimage') }">
          <UploadImage class="panel__item upload" :title="$t('report_page.heroimage')" :imageUrl.sync="formData.heroImage"></UploadImage>
        </div>
        <div class="item" :class="{ 'item--error': includes(validateErrors, 'ogImage') }">
          <UploadImage class="panel__item upload" :title="$t('report_page.og_image')" :imageUrl.sync="formData.ogImage"></UploadImage>
        </div>
      </div>
      <button :disabled="isSaving" @click="goCreate">
        <span v-if="!isSaving" v-text="$t('report_page.button_create')"></span>
        <Spinner v-else class="panel__create__spinner" :show="true"></Spinner>
      </button>
    </div>
  </div>
</template>
<script>
  import { get, includes, map, } from 'lodash'
  import InputItem from 'src/components/formItem/InputItem.vue'
  import InputTagItem from 'src/components/formItem/InputTagItem.vue'
  import ProjectSelect from 'src/components/formItem/ProjectSelect.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextareaItem from 'src/components/formItem/TextareaItem.vue'
  import UploadImage from 'src/components/formItem/UploadImage.vue'
  
  const MAXRESULT_PROJECTS = 10
  const DEFAULT_PAGE = 1
  const DEFAULT_SORT = '-updated_at'

  const debug = require('debug')('CLIENT:CreateReportPanel')
  const createReport = (store, params) => {
    return store.dispatch('CREATE_REPORT', {
      params
    })
  }
  const fetchAuthors = (store, params) => {
    return store.dispatch('FETCH_PEOPLE_BY_NAME', {
     params
    })
  }
  const fetchProjects = (store, { keyword = '' }) => {
    debug('Go fectch projects.')
    return store.dispatch('FETCH_PROJECTS', {
      params: {
        max_result: MAXRESULT_PROJECTS,
        page: DEFAULT_PAGE,
        sort: DEFAULT_SORT,
        keyword
      }
    }).catch(err => debug(err))
  }
  const fetchUserList = (store, params) => {
    return store.dispatch('FETCH_PEOPLE_BY_NAME', {
      params
    })
  }

  export default {
    name: 'CreateReportPanel',
    components: {
      InputItem,
      InputTagItem,
      ProjectSelect,
      Spinner,
      TextareaItem,
      UploadImage,
    },
    data () {
      return {
        currTagValues: [ ...map(get(this.report, 'authors'), a => ({ name: a.nickname, value: a.id, })) ],
        currInputAuthor: '',
        formData: {
          description: '',
          heroImage: '',
          ogDescription: '',
          ogImage: '',
          ogTitle: '',
          projectId: 0,
          publishStatus: 2,
          slug: '',
          title: '',
          updated_by: `${get(this.$store, 'state.profile.id')}`,
        },
        isSaving: false,
        tagsArray: [],
        validateErrors: [],
      }
    },
    computed: {
      autocompleteForAuthor () {
        return map(get(this.$store, 'state.peopleList', []), p => ({ name: p.nickname, value: p.id, }))
      },
    },
    watch: {
      currInputAuthor (value) {
        debug('currInputAuthor change detected:', value)
        fetchUserList(this.$store, {
          keyword: value,
        })
      },
    },
    methods: {
      closePanel () {
        this.$emit('update:shouldShowCreatePanel', false)
      },
      goCreate () {
        debug('Abt to create a new report.')
        this.isSaving = true

        this.formData.projectId = Number(this.formData.projectId)
        this.formData.authors = this.currTagValues

        createReport(this.$store, this.formData)
          .then(res => {
            debug('res', res)
            this.isSaving = false
            this.$emit('refreshReports', false)
            this.$emit('update:shouldShowCreatePanel', false)
          })
          .catch(err => {
            this.isSaving = false
            // this.alert = err.message
            debug('err', err)
          })
      },
      includes
    },
  }
</script>
<style lang="stylus" scoped>
  theme-color = hsl(176.1, 40.9%, 70.8%)
  theme-color-dark = hsl(176.1, 40.9%, 50.8%)

  .create-report-panel
    display flex
    align-items center
    justify-content center
    position fixed
    top 0
    left 0
    width 100%
    height 100vh
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
    padding 30px 50px 50px
    background-color #f2f2f2
    border-radius 10px
    &__multiple
      display flex
      .item
        margin-top 0
        & + .item
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
    &--error
      >>> input
        background-color #ffe5e5 !important
        border 1px solid #ff0000 !important
    &--description
      align-self flex-start
    &--not-full
      flex 0 1 auto
  
  .project-select
    flex 1
    height 35px
    background-color #fff
    border none
    border-radius 0
    outline none
</style>
