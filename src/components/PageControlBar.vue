<template>
  <section class="control-bar">
    <h2 v-text="title"></h2>
    <div class="control-bar__buttons">
      <slot v-for="(t, i) in slotItems" :name="i"></slot>
    </div>
    <div class="filter" @keyup.enter="keyupHandler">
      <InputItem
        :placeHolder="$t('project_page.please_type_id_or_nickname')"
        :value.sync="filter"></InputItem>
      <div class="filter__search" @click="goSearch"></div>
    </div>
  </section>
</template>
<script>
  import InputItem from '../components/formItem/InputItem.vue'
  
  export default {
    name: 'PageControlBar',
    components: {
      InputItem,
    },
    props: {
      amount: {
        type: Number,
        default: 0,
      },
      title: {
        type: String,
      }
    },
    data () {
      return {
        filter: '',
      }
    },
    computed: {
      slotItems () {
        const items = []
        items.length = this.amount
        return items
      },
    },
    methods: {
      goSearch () {
        this.$emit('goSearch', this.filter)
      },
      keyupHandler () {
        this.goSearch()
      },
    }
  }
</script>
<style lang="stylus" scoped>
  theme-color = hsl(176.1, 40.9%, 70.8%)
  theme-color-dark = hsl(176.1, 40.9%, 50.8%)

  .control-bar
    display flex
    align-items center
    h2
      margin 0
      color #fff
    &__buttons
      margin-left 20px
      button
        padding 5px 10px
        margin 0
        color theme-color
        background-color transparent
        border 1px solid theme-color
        border-radius 5px
        cursor pointer
        outline none
        transition color .5s, border-color .5s
        &:hover
          color theme-color-dark
          border-color theme-color-dark
      button + button
        margin-left 10px
  .filter
    display flex
    margin-left auto
    &__search
      width 35px
      height 35px
      background-color #fff
      background-image url(/public/icons/search-grey.png)
      background-size 70%
      background-repeat no-repeat
      background-position center center
      cursor pointer
</style>