<template>
  <div class="create-project-panel" @click="closePanel">
    <div class="panel">
      <div class="panel__title"><h3 v-text="$t('project_page.create_project')"></h3></div>
      <div class="panel__container">
        <div class="panel__item">
          <div class="panel__item--title"><span v-text="$t('project_page.order')"></span></div>
          <InputItem width="60px"
            :placeHolder="$t('project_page.order')"
            :value.sync="formData.order"></InputItem>
        </div>
        <div class="panel__item slug">
          <div class="panel__item--title"><span v-text="$t('project_page.slug')"></span></div>
          <InputItem
            :placeHolder="$t('project_page.slug')"
            :value.sync="formData.slug"></InputItem>
        </div>
      </div>
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('project_page.title')"></span></div>
        <InputItem
          :placeHolder="$t('project_page.title')"
          :value.sync="formData.title"></InputItem>
      </div>
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('project_page.project_description')"></span></div>
        <TextareaItem
          :placeholder="$t('project_page.project_description')"
          :value.sync="formData.description"></TextareaItem>
      </div>
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('project_page.og_title')"></span></div>
        <InputItem
          :placeHolder="$t('project_page.og_title')"
          :value.sync="formData.ogTitle"></InputItem>
      </div>
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('project_page.og_description')"></span></div>
        <TextareaItem
          :placeholder="$t('project_page.og_description')"
          :value.sync="formData.ogDescription"></TextareaItem>
      </div>
      <div class="panel__container">
        <UploadImage class="panel__item upload" :title="$t('project_page.heroimage')" :imageUrl.sync="formData.heroImage"></UploadImage>
        <UploadImage class="panel__item upload" :title="$t('project_page.ogImage')" :imageUrl.sync="formData.ogImage"></UploadImage>
      </div>
      <div class="panel__alert" v-if="alert">
        <span v-text="$t('project_page.error_occurred') + ': '"></span>
        <span v-text="alert"></span>
      </div>
      <div class="panel__create" @click="goCreate">
        <span v-text="$t('project_page.button_create')" v-if="!isSaving"></span>
        <Spinner class="panel__create__spinner" v-else="!isSaving" :show="true"></Spinner>
      </div>
    </div>
  </div>
</template>
<script>
  import InputItem from 'src/components/formItem/InputItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextareaItem from 'src/components/formItem/TextareaItem.vue'
  import UploadImage from 'src/components/formItem/UploadImage.vue'
  import { get, map } from 'lodash'
  import { PROJECT_STATUS, PROJECT_PUBLISH_STATUS, } from 'api/config'

  const debug = require('debug')('CLIENT:CreateProjectPanel')
  const createProject = (store, params) => {
    return store.dispatch('CREATE_PROJECT', {
      params
    })
  }
  export default {
    name: 'CreateProjectPanel',
    components: {
      InputItem,
      Spinner,
      TextareaItem,
      UploadImage
    },
    data () {
      return {
        alert: null,
        formData: {
          description: '',
          heroImage: '',
          ogDescription: '',
          ogImage: '',
          ogTitle: '',
          order: 0,
          slug: '',
          status: PROJECT_STATUS.WIP,
          publish_status: PROJECT_PUBLISH_STATUS.DRAFT,
          title: '',
        },
        isSaving: false,
        tagsArray: [],
      }
    },
    methods: {
      closePanel (e) {
        const target = e.target
        const className = target.getAttribute('class')
        if (className && className.indexOf('create-project-panel') > -1) {
          debug('Abt to close panel.', target.className)
          this.$emit('update:shouldShowCreatePanel', false)
        }
      },
      goCreate () {
        debug('Abt to create a new project.')
        this.isSaving = true
        /**
         * ToDo: need to validate input.
         */
        createProject(this.$store, {
          active: 1,
          description: get(this.formData, 'description', ''),
          hero_Image: get(this.formData, 'heroImage', ''),
          og_title: get(this.formData, 'ogTitle', ''),
          og_description: get(this.formData, 'ogDescription', ''),
          og_image: get(this.formData, 'ogImage', ''),
          project_order: Number(get(this.formData, 'order', 0)),
          publish_status: PROJECT_PUBLISH_STATUS.DRAFT,
          slug: get(this.formData, 'slug', ''),
          status: PROJECT_STATUS.WIP,
          title: get(this.formData, 'title', ''),
          updated_by: get(this.profile, 'id'),
        }).then(res => {
          debug('res', res)
          this.isSaving = false
          this.$emit('refreshProjects', false)
          this.$emit('update:shouldShowCreatePanel', false)
        }).catch (err => {
          this.isSaving = false
          this.alert = err.message
          debug('err', err)
        })
      }
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .create-project-panel
    position fixed
    top 0
    left 0
    width 100vw
    height 100vh
    display flex
    align-items center
    justify-content center
    background-color rgba(0, 0, 0, 0.6)
    z-index 9999
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
        &.slug, &.upload
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
</style>
