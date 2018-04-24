<template>
  <div class='pageaside' :class="{ dark: isDark, }">
    <template v-for="item in items">
      <div class="pageaside__item" :class="{ active: isCurrTool(get(item, 'route')), 'showSub': isSelected(get(item, 'route')) }"
        @click="goTo({ route: get(item, 'sub', []).length === 0 ? get(item, 'route') : null, tool: get(item, 'route') })">
        <span v-text="$t(get(item, 'name'))"></span>
      </div>
      <template v-for="subitem in get(item, 'sub', [])">
        <div class="pageaside__item--sub"
          :class="{
            'parent-active': isCurrTool(get(item, 'route')),
            active: isCurrTool(get(subitem, 'route')),
            show: isCurrTool(get(item, 'route')) || isSelected(get(item, 'route')) }"
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
    computed: {
      isDark () {
        debug('isDark?', get(this.$route, [ 'query', 'dark' ]))
        return get(this.$route, [ 'query', 'dark' ])
      },
    },
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
          location.replace(`/${route}${this.isDark ? '?dark=true' : ''}`)
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
    background-color #d8d8d8
    padding-top 50px
    z-index 999
    &.dark
      background-color #000
      .pageaside__item
        color #fff
        background-color #1A1A1A
        > span
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
          background-color none
          > span
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
          color #fff
          background-color #212121
          &.active
            color #ddcf21
          &:hover
            background-color #2A2A2A
    &__item
      padding 20px 50px
      color #000
      background-color #d8d8d8
      cursor pointer
      > span
        position relative
      &.active
        color #000
        background-color #ddcf21
        > span
          position relative
      &.showSub
        > span
          position relative
      &:hover
        background-color #d4c50d
      &--sub
        color #000
        cursor pointer
        padding 20px 80px
        font-size 0.9375rem
        display none
        &.parent-active
          background-color #ddcf21        
        &.active
          color #000
          span
            position relative
            &:before
              position absolute
              left -15px
              top 5px
              content ''
              border-style solid
              border-width 6px 0 6px 10px
              border-color transparent transparent transparent #fff          
        &.show
          display block
        &:hover
          background-color #d4c50d
</style>