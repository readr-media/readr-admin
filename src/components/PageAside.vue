<template>
  <div class='pageaside'>
    <template v-for="item in items">
      <div class="pageaside__item" :class="get(item, 'name')" @click="goTo(get(item, 'name'))">
        <span v-text="$t(get(item, 'name'))"></span>
      </div>
    </template>
  </div>
</template>
<script>
  import { managerTools } from 'src/constants'
  import { find, get } from 'lodash'

  const debug = require('debug')('CLIENT:PageAside')
  export default {
    name: 'PageAside',
    data () {
      return {
        items: managerTools || []
      }
    },
    methods: {
      get,
      goTo (key) {
        debug('Going to', get(find(managerTools, { name: key }), 'route', '/'))
        const targetRoute = get(find(managerTools, { name: key }), 'route', '')
        this.$router.push(`/${targetRoute}`)
      }
    },
    mounted () {
      debug('this.items', this.items)
      debug('managerTools', managerTools)
      debug(this.$i18n)
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
    &__item
      color #fff
      padding 20px 50px
      background-color #1A1A1A
      cursor pointer
      &:hover
        background-color #2A2A2A
</style>