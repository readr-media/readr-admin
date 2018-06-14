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
  theme-color = hsl(176.1, 40.9%, 70.8%)
  theme-color-dark = hsl(176.1, 40.9%, 50.8%)

  .pageaside
    height 100%
    width 180px
    // max-width 400px
    position absolute
    left calc(20% - 180px)
    top: 0
    background-color #f2f2f2
    padding-top 146px
    z-index 999
    &.dark
      background-color #000
      .pageaside__item
        color #fff
        background-color #1A1A1A
        > span
          &:before
            position absolute
            left -20px
            top 5px
            content ''
            width 10px
            height 10px
            background-color #fff
            border-radius 50%
        &.active
          color #ddcf21
          background-color none
          > span
            &:before
              position absolute
              left -20px
              top 5px
              content ''
              width 10px
              height 10px
              background-color #fff
              border-radius 50%
        &.showSub
          > span
            &:before
              position absolute
              left -20px
              top 5px
              content ''
              width 10px
              height 10px
              background-color #fff
              border-radius 50%
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
      padding 20px 20px 20px 40px
      color #000
      font-weight 700
      background-color #f2f2f2
      border-top 2px solid #4a4a4a
      cursor pointer
      > span
        position relative
      &.active
        color #000
        background-color theme-color
        > span
          position relative
      &.showSub
        > span
          position relative
      &:hover
        background-color theme-color-dark
      &--sub
        color #000
        cursor pointer
        padding 20px 20px 20px 40px
        font-size 0.9375rem
        display none
        
        &.parent-active
          background-color theme-color    
        &.active
          color #000
          span
            position relative
            &:before
              position absolute
              left -20px
              top 5px
              content ''
              width 10px
              height 10px
              background-color #fff
              border-radius 50%
        &.show
          display block
        &:hover
          background-color theme-color-dark
</style>