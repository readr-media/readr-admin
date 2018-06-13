<template>
  <section class="alert-delete" @click.self="$emit('update:shouldShowAlert', false)">
    <div class="alert-panel">
      <h3 v-if="get(item, 'title')" v-text="item.title"></h3>
      <h1 v-text="$t('alert.message_delete')"></h1>
      <button class="cancel" @click="$emit('cancel')" v-text="$t('alert.cancel')"></button>
      <button class="confirm" @click="$emit('confirm')" v-text="$t('alert.confirm')"></button>
    </div>
  </section>
</template>
<script>
  import { get } from 'lodash'

  export default {
    name: 'AlertDelete',
    props: {
      item: {
        type: Object,
      }
    },
    methods: {
      get
    }
  }
</script>
<style lang="stylus" scoped>
  cancel-color = #d3969a
  cancel-color-dark = #c47277
  confirm-color = #9ad396
  confirm-color-dark = #77c472

  .alert-delete
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
  .alert-panel
    display flex
    justify-content space-between
    flex-wrap wrap
    width 500px
    padding 30px 50px
    background-color #f2f2f2
    border-radius 10px
    h1
      width 100%
      margin 0 auto 1em
      color #000
      text-align center
      font-size 2rem
    h3
      width 100%
      margin 0 auto 1em
      color #000
      text-align center
      font-size 1.2rem
    button
      padding .5em 1em
      background-color transparent
      border none
      border-radius 5px
      outline none
      transition background-color .3s
      &.cancel
        width 60%
        background-color cancel-color
        &:hover
          background-color cancel-color-dark
      &.confirm
        width 30%
        background-color confirm-color
        &:hover
          background-color confirm-color-dark
  
</style>