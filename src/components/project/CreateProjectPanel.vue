<template>
  <div class="create-project-panel" @click="closePanel">
    <div class="panel">
      <div class="panel__title"><h3 v-text="$t('project_page.create_project')"></h3></div>
      <InputItem inputKey="title"
        :placeHolder="$t('project_page.title')"
        @filled="setInputValue"></InputItem>
      <TextareaItem :placeholder="$t('project_page.project_description')"></TextareaItem>
      <InputItem inputKey="og_title"
        :placeHolder="$t('project_page.og_title')"
        @filled="setInputValue"></InputItem>
      <TextareaItem :placeholder="$t('project_page.og_description')"></TextareaItem>
      <InputItem inputKey="og_title" width="60px"
        :placeHolder="$t('project_page.order')"
        @filled="setInputValue"></InputItem>
      <InputTagItem
        :placeholder="$t('project_page.author')"
        :currTagValues.sync="currTagValues"
        :autocomplete="autocompleteForAuthor"></InputTagItem>
      <div class="panel__create" @click="goCreate"><span v-text="$t('project_page.button_create')"></span></div>
    </div>
  </div>
</template>
<script>
  import InputItem from 'src/components/formItem/InputItem.vue'
  import InputTagItem from 'src/components/formItem/InputTagItem.vue'
  import TextareaItem from 'src/components/formItem/TextareaItem.vue'
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
      TextareaItem
    },
    data () {
      return {
        formData: {},
        tagsArray: [],
        currTagValues: [ 'test' ],
        autocompleteForAuthor: [
          { name: 'Peter Kim', value: 'fa79fad7f9da88' },
          { name: 'Sherry Lim', value: 'aa79fad7f9da88' },
          { name: 'Tammy Kao', value: 'ca79fad7f9da88' },
          { name: 'Lora Lu', value: 'ba79fad7f9da88' },
          { name: '鐘聖雄', value: 'ga79fad7f9da88' },
        ]
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
          "like_amount": null,
          "comment_amount": null,
          "active": 1,
          "hero_image": "https://projects.mirrormedia.mg/proj-assets/farmhouse/images/og.jpg",
          "title": get(this.formData, 'title', ''),
          "description": "《鏡傳媒》透過數據分析調查發現，宜蘭不只農舍多，違規農舍竟然還比合法多！更教人意外的是，農舍買賣市場的主要賣方，竟然是所謂的「老農」⋯⋯",
          "author": null,
          "og_title": get(this.formData, 'og_title', ''),
          "og_description": "《鏡傳媒》透過數據分析調查發現，宜蘭不只農舍多，違規農舍竟然還比合法多！更教人意外的是，農舍買賣市場的主要賣方，竟然是所謂的「老農」⋯⋯",
          "og_image": "萬畝農舍良田起 - 鏡週刊 Mirror Media",
          "post_id": 989902,
          "id": 989902
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