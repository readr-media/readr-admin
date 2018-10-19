<template>
  <div id="app">
    <PageHeader></PageHeader>
    <PageAside></PageAside>
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
import PageAside from 'src/components/PageAside.vue'
import PageHeader from 'src/components/PageHeader.vue'

export default {
  components: {
    PageAside,
    PageHeader
  },  
  mounted () {
    this.$store.dispatch('UPDATE_CLIENT_SIDE')
  },
}
</script>

<style lang="stylus">
a
  text-decoration none

button
  cursor pointer
  &:disabled
    cursor not-allowed
.view
  // max-width 800px
  margin 0 auto
  position relative
  background-color #4a4a4a
  padding-top 70px
  &.locked
    width 100%
    height 100vh
    overflow hidden


.backstage
  min-height 100vh
  max-height 100vh
  padding-left 20% /* This Padding is for PageAside */
  background-color #4a4a4a
  main
    padding 20px 40px
    
.datepicker__input
  padding-left 10px
  width 100%
  height 35px
  color #808080
  border none

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

</style>
