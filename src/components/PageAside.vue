<template>
  <div class='pageaside'>
    <template v-for="item in items">
      <div class="pageaside__item" :class="{ active: isCurrTool(get(item, 'route')), 'showSub': isSelected(get(item, 'route')) }"
        @click="goTo({ route: get(item, 'sub', []).length === 0 ? get(item, 'route') : null, tool: get(item, 'route') })">
        <span v-text="$t(get(item, 'name'))"></span>
      </div>
      <template v-for="subitem in get(item, 'sub', [])">
        <div class="pageaside__item--sub"
          :class="{ active: isCurrTool(get(subitem, 'route')), show: isCurrTool(get(item, 'route')) || isSelected(get(item, 'route')) }"
            @click="goTo({ route: get(subitem, 'route') })">
          <span v-text="$t(get(subitem, 'name'))"></span>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
  // import { SITE_ROOT } from 'api/config'
  import { managerTools } from 'src/constants'
  import { find, get } from 'lodash'

  const debug = require('debug')('CLIENT:PageAside')
  export default {
    name: 'PageAside',
    data () {
      return {
        selectedItem: '',
        items: managerTools || []
      }
    },
    methods: {
      isCurrTool (tool) {
        debug('this.$route.fullPath', this.$route.fullPath, tool)
        return this.$route.fullPath.indexOf(tool) > -1
      },
      get,
      goTo ({ route, tool }) {
        // debug('Going to', get(find(managerTools, { name: key }), 'route', '/'))
        // const targetRoute = get(find(managerTools, { name: key }), 'route', '')
        if (route) {
          // this.$router.push(`/${SITE_ROOT ? SITE_ROOT + '/' : ''}${route}`)
          location.replace(`/${route}`)
        } else {
          this.selectedItem = tool
        }
      },
      isSelected (tool) {
        return this.selectedItem === tool
      }
    },
    mounted () {
      debug('this.items', this.items)
      debug('managerTools', managerTools)
      debug(this.$i18n)
      debug(this.currTool)
      // this.$i18n.locale = 'en'
    },
  }
</script>
<style lang="stylus" scoped>
  .pageaside
    height 100%
    width 20%
    // max-width 400px
    position absolute
    left 0
    top: 0
    background-color #000
    padding-top 50px
    z-index 999
    &__item
      color #fff
      padding 20px 50px
      background-color #1A1A1A
      cursor pointer
      > span
        position relative
        &:before
          position absolute
          left -15px
          top 5px
          content ''
          border-style solid
          border-width 6px 0 6px 10px
          border-color transparent transparent transparent #fff
      &.active
        color #ddcf21
        > span
          position relative
          &:before
            position absolute
            left -15px
            top 5px
            content ''
            border-style solid
            border-width 10px 6px 0 6px
            border-color #fff transparent transparent transparent
      &.showSub
        > span
          position relative
          &:before
            position absolute
            left -15px
            top 5px
            content ''
            border-style solid
            border-width 10px 6px 0 6px
            border-color #fff transparent transparent transparent
      &:hover
        background-color #2A2A2A
      &--sub
        background-color #212121
        color #fff
        cursor pointer
        padding 20px 80px
        font-size 0.9375rem
        display none
        &.active
          color #ddcf21
        &.show
          display block
        &:hover
          background-color #2A2A2A
</style>