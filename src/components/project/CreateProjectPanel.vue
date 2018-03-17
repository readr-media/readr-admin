<template>
  <div class="create-project-panel" @click="closePanel">
    <div class="panel">
      <div class="panel__title"><h3 v-text="$t('project_page.create_project')"></h3></div>
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
        :value.sync="formData.ogTitle"></InputItem>
      <TextareaItem
        :placeholder="$t('project_page.og_description')"
        :value.sync="formData.ogDescription"></TextareaItem>
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
      <div class="panel__create" @click="goCreate">
        <span v-text="$t('project_page.button_create')" v-if="!isSaving"></span>
        <Spinner class="panel__create__spinner" v-else="!isSaving" :show="true"></Spinner>
      </div>
    </div>
  </div>
</template>
<script>
  import InputItem from 'src/components/formItem/InputItem.vue'
  import InputTagItem from 'src/components/formItem/InputTagItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextareaItem from 'src/components/formItem/TextareaItem.vue'
  import UploadImage from 'src/components/formItem/UploadImage.vue'
  import { get } from 'lodash'

  const debug = require('debug')('CLIENT:CreateProjectPanel')
  const createProject = (store, params) => {
    return store.dispatch('CREATE_PROJECT', {
      params
    })
  }
  const fetchAuthors = (store, params) => {
    return store.dispatch('FETCH_PEOPLE_BY_NAME', {
     params
    })
  }
  export default {
    name: 'CreateProjectPanel',
    components: {
      InputItem,
      InputTagItem,
      Spinner,
      TextareaItem,
      UploadImage
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
          ogDescription: '',
          ogImage: '',
          ogTitle: '',
          order: 0,
          slug: '',
          status: 0,
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
          "active": 1,
          "author": null,
          "description": get(this.formData, 'description', ''),
          "heroImage": get(this.formData, 'heroImage', ''),
          "og_title": get(this.formData, 'ogTitle', ''),
          "og_description": get(this.formData, 'ogDescription', ''),
          "og_image": get(this.formData, 'ogImage', ''),
          "project_order": Number(get(this.formData, 'order', 0)),
          "slug": get(this.formData, 'slug', ''),
          "title": get(this.formData, 'title', ''),
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
    watch: {
      currInputAuthor: function () {
        debug('currInputAuthor change detected:', this.currInputAuthor)
        // this.autocompleteForAuthor.push({ name: this.currInputAuthor, value: this.currInputAuthor })
        // fetchAuthors(this.$store, {
        //   where: {
        //     nickname: [ `神力%` ]
        //   }
        // })
      }
    }
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
        &.panel__create
          margin 30px auto 15px
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
