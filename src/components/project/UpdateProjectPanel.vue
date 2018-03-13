<template>
  <div class="update-project-panel" @click="closePanel">
    <div class="panel">
      <div class="panel__title"><h3 v-text="$t('project_page.update_project')"></h3></div>
      <InputItem inputKey="title" 
        :initValue="get(project, 'title')"
        :placeHolder="$t('project_page.title')"
        @filled="setInputValue"></InputItem>
      <InputItem inputKey="og_title"
        :initValue="get(project, 'ogTitle')"
        :placeHolder="$t('project_page.og_title')"
        @filled="setInputValue"></InputItem>
      <div class="panel__update" @click="goUpdate"><span v-text="$t('project_page.button_update')"></span></div>
    </div>
  </div>
</template>
<script>
  import InputItem from 'src/components/formItem/InputItem.vue'
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
      InputItem
    },
    data () {
      return {
        formData: {}
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
          ogTitle: get(this.formData, 'og_title', this.project.ogTitle)
        })
        debug('Abt to update the curr proj.', project)
        updateProject(this.$store, project)
          .then(res => {
            debug('res', res)
            this.$emit('refreshProjects', false)
            this.$emit('update:shouldShowUpdatePanel', false)
          })
          .catch(err => {
            debug('err', err)
          })
      },
      setInputValue (key, value) {
        this.formData[ key ] = value
      }
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
      > div:not(:first-child)
        margin 15px auto
        &.panel__update
          margin 30px auto 15px
      &__title
        h3
          margin 0
      &__update
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