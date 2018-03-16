<template>
  <div class="textarea-container">
    <textarea rows="4" cols="50"
      v-model="value"
      :placeholder="placeholder"></textarea>
  </div>
</template>
<script>
  export default {
    name: 'TextareaItem',
    methods: {},
    mounted () {},
    props: [ 'placeholder', 'value' ]
  }
</script>
<style lang="stylus" scoped>
  .textarea-container
    width 100%
    textarea
      width 100%
      border none
      outline none
      font-size 1.125rem
      font-weight 100
      padding 5px 10px
      resize none
      &::-webkit-input-placeholder
        color #bdbdbd
        font-weight 100
</style>