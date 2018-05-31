<template>
  <div class="panel-container" @click="closePanel">
    <div class="panel">
      <slot name="panel"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ItemMaintainContainer',
    methods: {
      closePanel (e) {
        const target = e.target
        const className = target.getAttribute('class')
        if (className && className.indexOf('panel-container') > -1) {
          this.closePanelHandler()
        }
      },      
    },
    mounted () {},
    props: {
      closePanelHandler: {
        type: Function,
        default: () => {},
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .panel-container
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
        margin 20px auto
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
          max-height 35px
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
        &.slug, &.publish-status, &.upload, &.puclished-time, &.upload, &.project_id
          flex 1
      &__btn
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
        justify-content flex-start
        align-items center
        background-color #fff
        padding-left 20px
        > div
          display inline-block
          &:first-child
            margin 0 10px 0 0
          &:not(:first-child)
            margin 0 10px
      &__alert
        color red
</style>