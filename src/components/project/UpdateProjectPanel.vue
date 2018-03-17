<template>
  <div class="update-project-panel" @click="closePanel">
    <div class="panel">
      <div class="panel__title"><h3 v-text="$t('project_page.update_project')"></h3></div>
      <div class="panel__option">
        <RadioItem v-for="s in status" name="status"
          :label="$t(`project_page.${get(s, 'name')}`)"
          :key="get(s, 'code')"
          :value="get(s, 'code')"
          :disabled="!isEditable"
          :currSelected.sync="formData.status"></RadioItem>      
      </div>
      <InputItem
        :placeHolder="$t('project_page.slug')"
        :value.sync="formData.slug"></InputItem>
      <InputItem
        :placeHolder="$t('project_page.title')"
        :value.sync="formData.title"></InputItem>
      <TextareaItem
        :placeholder="$t('project_page.project_description')"
        :value.sync="formData.description"></TextareaItem>
      <InputItem
        :placeHolder="$t('project_page.og_title')"
        :value.sync="formData.og_title"></InputItem>
      <TextareaItem
        :placeholder="$t('project_page.og_description')"
        :value.sync="formData.og_description"></TextareaItem>
      <InputItem width="60px"
        :placeHolder="$t('project_page.order')"
        :value.sync="formData.order"></InputItem>
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

  import { get } from 'lodash'

  const PROJECT_STATUS = [
    { code: 1, name: 'status_draft' },
    { code: 2, name: 'status_wip' },
    { code: 3, name: 'status_published' },
  ]
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
          description: '',
          heroImage: '',
          og_description: '',
          ogImage: '',
          og_title: '',
          order: 0,
          slug: '',
          status: get(PROJECT_STATUS, [ 0, 'code' ]),
          title: '',
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
        const project = Object.assign({}, this.project, {
          title: get(this.formData, 'title', this.project.title),
          ogTitle: get(this.formData, 'og_title', this.project.ogTitle),
          active: get(this.selectedOption, 'status', this.project.active)
        })
        debug('Abt to update the curr proj.', project)
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
        > div
          display inline-block
          &:first-child
            margin 0 20px 0 0
          &:not(:first-child)
            margin 0 20px
</style>