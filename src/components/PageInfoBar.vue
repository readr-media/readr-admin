<template>
  <section class="page-info">
    <div>
      <span v-text="$t('project_page.total')"></span>
      <span v-text="` ${totalItems} `"></span>
      <span v-text="$t('project_page.unit')"></span>
    </div>
    <slot></slot>
  </section>
</template>
<script>

  export default {
    name: 'PageInfoBar',
    props: {
      totalItems: {
        type: Number
      },
    },
  }
</script>
<style lang="stylus" scoped>
  theme-color = hsl(176.1, 40.9%, 70.8%)

  .page-info
    display flex
    justify-content space-between
    margin-top 40px
    color theme-color
    >>> div
      color theme-color

</style>
