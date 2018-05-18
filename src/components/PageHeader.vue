<template>
  <header class="header">
    <nav class="nav">
      <ul>
        <li class="nav--user">使用者</li>
      </ul>
    </nav>
  </header>
</template>
<script>
  export default {
    name: 'PageHeader',
  }
</script>
<style lang="stylus" scoped>
.header
  position absolute
  top 0
  left 0
  right 0
  z-index 1000
  padding-right 310px
  background-color #96d3cf

.nav
  display flex
  align-items flex-end
  height 70px
  margin-left auto
  ul
    margin 0 0 10px auto
    padding 0
  li
    display inline-block
    padding .2em .8em
    cursor pointer
    border-left 2px solid #000
    border-right 2px solid #000
    &.nav--user
      position relative
      padding-right 60px
      &::after
        content ''
        position absolute
        right 10px
        bottom -10px
        width 50px
        height 50px
        background-image url(/public/icons/account-black.png)
        background-size contain
        background-position center center
        background-repeat no-repeat
</style>