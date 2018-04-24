<template>
  <div class="delete-proj">
    <div class="delete-proj__title" @click="goDel"><span v-text="$t('project_page.button_delete')"></span></div>
    <div class="delete-proj__confirmation" :class="{ active: active }">
      <div class="cancel" @click="closeConf"><span v-text="$t('project_page.button_cancel')"></span></div>
      <div class="confirm" @click="goConf"><span v-text="$t('project_page.button_confirm')"></span></div>
    </div>
  </div>
</template>
<script>
  const debug = require('debug')('CLIENT:DeleteProject')
  export default {
    name: 'DeleteProject',
    data () {
      return {
        active: false,
      }
    },
    methods: {
      closeConf () {
        this.active = false
      },
      goConf () {
        this.active = false
        this.$emit('del')
      },
      goDel () {
        debug('go del!')
        this.active = true
      },
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
  .delete-proj
    cursor pointer
    position relative
    &__title
      position relative
      z-index 1
    &__confirmation
      position absolute
      opacity 0
      left -100%
      top 0
      margin-left 10px
      height 100%
      display flex
      transition left 0.5s, opacity 0.25s 0.05s
      &.active
        left 100%
        opacity 1
      > div
        width 50px
        height 100%
        font-size 0.75rem
        color #fff
        display flex
        justify-content center
        align-items center
        margin 0 2px
        &.cancel
          background-color #f04848
          &:hover
            background-color #bf3939
        &.confirm
          background-color #15b30b
          &:hover
            background-color #12900a

    &:hover
      text-decoration underline
</style>