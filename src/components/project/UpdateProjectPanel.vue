<template>
  <div class="update-project-panel" @click="closePanel">
    <div class="panel">
      <div class="panel__title"><h3 v-text="$t('project_page.update_project')"></h3></div>
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('project_page.status')"></span></div>
        <div class="panel__option">
          <RadioItem v-for="s in status" name="status"
            :label="$t(`project_page.${get(s, 'name')}`)"
            :key="get(s, 'code')"
            :value="get(s, 'code')"
            :disabled="!isEditable"
            :currSelected.sync="formData.status"></RadioItem>      
        </div>
      </div>
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('project_page.is_published')"></span></div>
        <div class="panel__option">
          <RadioItem name="isPublished"
            :label="$t(`project_page.status_draft`)"
            :key="'draft'"
            :value="false"
            :disabled="!isEditable"
            :currSelected.sync="formData.isPublished"></RadioItem>
          <RadioItem name="isPublished"
            :label="$t(`project_page.status_published`)"
            :key="'published'"
            :value="true"
            :disabled="!isEditable"
            :currSelected.sync="formData.isPublished"></RadioItem>
        </div>
      </div>
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
      <InputTagItem
        :placeholder="$t('project_page.author')"
        :currTagValues.sync="currTagValues"
        :autocomplete="autocompleteForAuthor"></InputTagItem>
      <UploadImage :title="$t('project_page.heroimage')" :imageUrl.sync="formData.heroImage"></UploadImage>
      <UploadImage :title="$t('project_page.ogImage')" :imageUrl.sync="formData.ogImage"></UploadImage>
      <div class="panel__alert" v-if="alert">
        <span v-text="$t('project_page.error_occurred') + ': '"></span>
        <span v-text="alert"></span>
      </div>
      <div class="panel__update" @click="goUpdate">
        <span v-text="$t('project_page.button_update')" v-if="!isUpdating"></span>
        <Spinner class="panel__update__spinner" v-else="!isUpdating" :show="true"></Spinner>
      </div>
    </div>
  </div>
</template>
<script>
  import InputItem from 'src/components/formItem/InputItem.vue'
  import InputTagItem from 'src/components/formItem/InputTagItem.vue'
  import RadioItem from 'src/components/formItem/RadioItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextareaItem from 'src/components/formItem/TextareaItem.vue'
  import UploadImage from 'src/components/formItem/UploadImage.vue'
  import validator from 'validator'

  import { PROJECT_STATUS } from 'src/constants'
  import { get } from 'lodash'

  const debug = require('debug')('CLIENT:UpdateProjectPanel')
  const updateProject = (store, params) => {
    return store.dispatch('UPDATE_PROJECT', {
      params
    })
  }

  export default {
    name: 'UpdateProjectPanel',
    components: {
      InputItem,
      InputTagItem,
      RadioItem,
      Spinner,
      TextareaItem,
      UploadImage
    },
    computed: {
      statusValue () {
        return get(this.status, [ 0, 'code' ])
      },
    },
    data () {
      return {
        alert: null,
        autocompleteForAuthor: [
          { name: 'Peter Kim', value: 'fa79fad7f9da88' },
          { name: 'Sherry Lim', value: 'aa79fad7f9da88' },
          { name: 'Tammy Kao', value: 'ca79fad7f9da88' },
          { name: 'Lora Lu', value: 'ba79fad7f9da88' },
          { name: '鐘聖雄', value: 'ga79fad7f9da88' },
        ],
        currTagValues: [ 'test' ],        
        formData: {
          description: get(this.project, 'description', ''),
          heroImage: get(this.project, 'heroImage', ''),
          ogDescription: get(this.project, 'ogDescription', ''),
          ogImage: get(this.project, 'ogImage', ''),
          ogTitle: get(this.project, 'ogTitle', ''),
          order: get(this.project, 'projectOrder'),
          slug:  get(this.project, 'slug', ''),
          status: get(this.project, 'status', get(PROJECT_STATUS, [ 0, 'code' ])),
          title: get(this.project, 'title', ''),
        },
        isEditable: true,
        isUpdating: false,
        status: PROJECT_STATUS
      }
    },
    methods: {
      closePanel (e) {
        const target = e.target
        const className = target.getAttribute('class')
        if (className && className.indexOf('update-project-panel') > -1) {
          debug('Abt to close update panel.', target.className)
          this.$emit('update:shouldShowUpdatePanel', false)
        }
      },
      get,
      goUpdate () {
        const project = {
          id: this.project.id,
          title: get(this.formData, 'title', this.project.title),
          description: get(this.formData, 'description', this.project.description),
          hero_image: get(this.formData, 'heroImage', this.project.heroImage),
          og_title: get(this.formData, 'ogTitle', this.project.ogTitle),
          og_description: get(this.formData, 'ogDescription', this.project.ogDescription),
          og_image: get(this.formData, 'ogImage', this.project.ogImage),
          project_order: validator.toInt(`${get(this.formData, 'order')}` || '') || this.project.projectOrder,
          slug: get(this.formData, 'slug', this.project.slug),
          status: get(this.formData, 'status', this.project.status),
        }
        debug('Abt to update the curr proj.', project)
        debug('this.formData.ogImage', get(this.formData, 'ogImage', this.project.ogImage))
        this.isUpdating = true
        updateProject(this.$store, project)
          .then(res => {
            debug('res', res)
            this.isUpdating = false
            this.$emit('refreshProjects', false)
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
    },
    mounted () {},
    props: {
      project: {
        type: Object
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .update-project-panel
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
      width 500px
      max-height 80%
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
            color #fff
            background-color #949494
            height 100%
            max-height 35px
        > div:not(.panel__item--title)
          flex 1
        &.slug
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
        justify-content center
        align-items center
        background-color #fff
        > div
          display inline-block
          &:first-child
            margin 0 20px 0 0
          &:not(:first-child)
            margin 0 20px
</style>