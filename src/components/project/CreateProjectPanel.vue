<template>
  <div class="create-project-panel" @click="closePanel">
    <div class="panel">
      <div class="panel__title"><h3 v-text="$t('project_page.create_project')"></h3></div>
      <InputItem inputKey="title"
        :placeHolder="$t('project_page.title')"
        :inputKey.sync=""></InputItem>
      <TextareaItem
        :placeholder="$t('project_page.project_description')"
        :value.sync="formData.description"></TextareaItem>
      <InputItem inputKey="og_title"
        :placeHolder="$t('project_page.og_title')"
        @filled="setInputValue"></InputItem>
      <TextareaItem
        :placeholder="$t('project_page.og_description')"
        :value.sync="formData.og_description"></TextareaItem>
      <InputItem inputKey="og_title" width="60px"
        :placeHolder="$t('project_page.order')"
        @filled="setInputValue"></InputItem>
      <InputTagItem
        :placeholder="$t('project_page.author')"
        :currTagValues.sync="currTagValues"
        :autocomplete="autocompleteForAuthor"></InputTagItem>
      <UploadImage :title="$t('project_page.heroimage')" :imageUrl.sync="heroimage"></UploadImage>
      <UploadImage :title="$t('project_page.ogImage')" :imageUrl.sync="ogImage"></UploadImage>
      <div class="panel__create" @click="goCreate"><span v-text="$t('project_page.button_create')"></span></div>
    </div>
  </div>
</template>
<script>
  import InputItem from 'src/components/formItem/InputItem.vue'
  import InputTagItem from 'src/components/formItem/InputTagItem.vue'
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
      TextareaItem,
      UploadImage
    },
    data () {
      return {
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
          og_description: '',
        },
        heroimage: null,
        ogImage: null,
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
        createProject(this.$store, {
          "active": 1,
          "hero_image": this.heroimage,
          "title": get(this.formData, 'title', ''),
          "description": get(this.formData, 'description', ''),
          "author": null,
          "og_title": get(this.formData, 'og_title', ''),
          "og_description": get(this.formData, 'og_description', ''),
          "og_image": this.ogImage,
        }).then(res => {
          debug('res', res)
          this.$emit('refreshProjects', false)
          this.$emit('update:shouldShowCreatePanel', false)
        }).catch (err => {
          debug('err', err)
        })
      },
      setInputValue (key, value) {
        this.formData[ key ] = value
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
        background-color #000
        border-radius 5px
        display flex
        justify-content center
        align-items center
        color #fff
        padding 10px 20px
        cursor pointer
</style>