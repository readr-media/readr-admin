<template>
  <div class="create-memo-panel" @click="closePanel">
    <div class="panel">
      <div class="panel__title"><h3 v-text="$t('memo_page.create_memo')"></h3></div>
      <div class="panel__container">
        <!-- <div class="panel__item">
          <div class="panel__item--title"><span v-text="$t('memo_page.order')"></span></div>
          <InputItem width="60px"
            :placeHolder="$t('memo_page.order')"
            :value.sync="formData.order"></InputItem>
        </div> -->
        <div class="panel__item project_id">
          <div class="panel__item--title"><span v-text="$t('memo_page.project_id')"></span></div>
          <InputItem
            :placeHolder="$t('memo_page.project_id')"
            :value.sync="formData.project_id"></InputItem>
        </div>
      </div>
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('memo_page.title')"></span></div>
        <InputItem
          :placeHolder="$t('memo_page.title')"
          :value.sync="formData.title"></InputItem>
      </div>
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('memo_page.memo_description')"></span></div>
        <TextareaItem
          :placeholder="$t('memo_page.memo_description')"
          :value.sync="formData.description"></TextareaItem>
      </div>
      <!-- <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('memo_page.og_title')"></span></div>
        <InputItem
          :placeHolder="$t('memo_page.og_title')"
          :value.sync="formData.ogTitle"></InputItem>
      </div> -->
      <!-- <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('memo_page.og_description')"></span></div>
        <TextareaItem
          :placeholder="$t('memo_page.og_description')"
          :value.sync="formData.ogDescription"></TextareaItem>
      </div> -->
      <!-- <InputTagItem
        :placeholder="$t('memo_page.author')"
        :currTagValues.sync="currTagValues"
        :autocomplete="autocompleteForAuthor"></InputTagItem> -->
      <!-- <UploadImage :title="$t('memo_page.heroimage')" :imageUrl.sync="formData.heroImage"></UploadImage>
      <UploadImage :title="$t('memo_page.ogImage')" :imageUrl.sync="formData.ogImage"></UploadImage> -->
      <div class="panel__alert" v-if="alert">
        <span v-text="$t('memo_page.error_occurred') + ': '"></span>
        <span v-text="alert"></span>
      </div>
      <div class="panel__create" @click="goCreate">
        <span v-text="$t('memo_page.button_create')" v-if="!isSaving"></span>
        <Spinner class="panel__create__spinner" v-else="!isSaving" :show="true"></Spinner>
      </div>
    </div>
  </div>
</template>
<script>
  import InputItem from 'src/components/formItem/InputItem.vue'
  import InputTagItem from 'src/components/formItem/InputTagItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextareaItem from 'src/components/formItem/TextareaItem.vue'
  import UploadImage from 'src/components/formItem/UploadImage.vue'
  import { get } from 'lodash'

  const debug = require('debug')('CLIENT:CreateMemoPanel')
  const createMemo = (store, params) => {
    return store.dispatch('CREATE_MEMO', {
      params
    })
  }
  const fetchAuthors = (store, params) => {
    return store.dispatch('FETCH_PEOPLE_BY_NAME', {
     params
    })
  }
  export default {
    name: 'CreateMemoPanel',
    components: {
      InputItem,
      InputTagItem,
      Spinner,
      TextareaItem,
      UploadImage
    },
    data () {
      return {
        alert: null,
        autocompleteForAuthor: [
          { name: 'Peter Kim', value: 'fa79fad7f9da88' },
          { name: 'Sherry Lim', value: 'aa79fad7f9da88' },
          { name: 'Tammy Kao', value: 'ca79fad7f9da88' },
          { name: 'Lora Lu', value: 'ba79fad7f9da88' },
          { name: '鐘聖雄', value: 'ga79fad7f9da88' },
        ],
        currTagValues: [ 'test' ],
        formData: {
          description: '',
          heroImage: '',
          ogDescription: '',
          ogImage: '',
          ogTitle: '',
          order: 0,
          project_id: 0,
          status: 0,
          title: '',
        },
        isSaving: false,
        tagsArray: [],
      }
    },
    methods: {
      closePanel (e) {
        const target = e.target
        const className = target.getAttribute('class')
        if (className && className.indexOf('create-memo-panel') > -1) {
          debug('Abt to close panel.', target.className)
          this.$emit('update:shouldShowCreatePanel', false)
        }
      },
      goCreate () {
        debug('Abt to create a new memo.')
        this.isSaving = true
        /**
         * ToDo: need to validate input.
         */
        createMemo(this.$store, {
          title: get(this.formData, 'title', ''),
          content: get(this.formData, 'description', ''),
          // link:,
          author: get(this.$store.state.profile, 'id'),
          project_id: Number(get(this.formData, 'project_id', 0)),
          active: 1,
          updated_by: get(this.$store.state.profile, 'id'),
          // published_at:,
        }).then(res => {
          debug('res', res)
          this.isSaving = false
          this.$emit('refreshMemos', false)
          this.$emit('update:shouldShowCreatePanel', false)
        }).catch (err => {
          this.isSaving = false
          this.alert = err.message
          debug('err', err)
        })
      }
    },
    mounted () {},
    watch: {
      currInputAuthor: function () {
        debug('currInputAuthor change detected:', this.currInputAuthor)
        // this.autocompleteForAuthor.push({ name: this.currInputAuthor, value: this.currInputAuthor })
        // fetchAuthors(this.$store, {
        //   where: {
        //     nickname: [ `神力%` ]
        //   }
        // })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .create-memo-panel
    position fixed
    top 0
    left 0
    width 100vw
    height 100vh
    display flex
    align-items center
    justify-content center
    background-color rgba(0, 0, 0, 0.6)
    .panel
      background-color #efefef
      // box-shadow 0 0 10px #afafaf
      width 900px
      max-height 80%
      padding 25px 50px
      border-radius 5px
      overflow auto
      > div:not(:first-child)
        margin 15px auto
        &.panel__create
          margin 30px auto 15px
      &__container
        width 100%
        display flex
        > div:not(:first-child)
          margin-left 20px
      &__item
        display flex
        &--title
          background-color #fff
          > span
            padding 5px 10px
            display flex
            justify-content center
            align-items center
            color #777
            background-color #e2e2e2
            height 100%
            max-height 35px
        > div:not(.panel__item--title)
          flex 1
        &.project_id
          flex 1
      &__title
        h3
          margin 0
      &__create
        width 100%
        height 40px
        background-color #000
        border-radius 5px
        display flex
        justify-content center
        align-items center
        color #fff
        padding 10px 20px
        cursor pointer
      &__alert
        color red
</style>
