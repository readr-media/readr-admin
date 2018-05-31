<template>
  <ItemMaintainContainer :closePanelHandler="closePanel">
    <template slot="panel">
      <div class="panel__title"><h3 v-text="$t('project_page.create_project')"></h3></div>
      <div class="panel__container">
        <div class="panel__item">
          <div class="panel__item--title"><span v-text="$t('project_page.order')"></span></div>
          <InputItem width="60px"
            :placeHolder="$t('project_page.order')"
            :value.sync="formData.order"></InputItem>
        </div>
        <div class="panel__item slug">
          <div class="panel__item--title"><span v-text="$t('project_page.slug')"></span></div>
          <InputItem
            :placeHolder="$t('project_page.slug')"
            :value.sync="formData.slug"></InputItem>
        </div>
      </div>
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('project_page.title')"></span></div>
        <InputItem
          :placeHolder="$t('project_page.title')"
          :value.sync="formData.title"></InputItem>
      </div>
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('project_page.project_description')"></span></div>
        <TextareaItem
          :placeholder="$t('project_page.project_description')"
          :value.sync="formData.description"></TextareaItem>
      </div>
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('project_page.og_title')"></span></div>
        <InputItem
          :placeHolder="$t('project_page.og_title')"
          :value.sync="formData.ogTitle"></InputItem>
      </div>
      <div class="panel__item">
        <div class="panel__item--title"><span v-text="$t('project_page.og_description')"></span></div>
        <TextareaItem
          :placeholder="$t('project_page.og_description')"
          :value.sync="formData.ogDescription"></TextareaItem>
      </div>
      <div class="panel__container">
        <UploadImage class="panel__item upload" :title="$t('project_page.heroimage')" :imageUrl.sync="formData.heroImage"></UploadImage>
        <UploadImage class="panel__item upload" :title="$t('project_page.ogImage')" :imageUrl.sync="formData.ogImage"></UploadImage>
      </div>
      <div class="panel__alert" v-if="alert">
        <span v-text="$t('project_page.error_occurred') + ': '"></span>
        <span v-text="alert"></span>
      </div>
      <div class="panel__btn" @click="goCreate">
        <span v-text="$t('project_page.button_create')" v-if="!isSaving"></span>
        <Spinner class="panel__create__spinner" v-else="!isSaving" :show="true"></Spinner>
      </div>    
    </template>
  </ItemMaintainContainer>
</template>
<script>
  import InputItem from 'src/components/formItem/InputItem.vue'
  import ItemMaintainContainer from 'src/components/ItemMaintainContainer.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextareaItem from 'src/components/formItem/TextareaItem.vue'
  import UploadImage from 'src/components/formItem/UploadImage.vue'
  import { get, map } from 'lodash'
  import { PROJECT_STATUS, PROJECT_PUBLISH_STATUS, } from 'api/config'

  const debug = require('debug')('CLIENT:CreateProjectPanel')
  const createProject = (store, params) => {
    return store.dispatch('CREATE_PROJECT', {
      params
    })
  }
  export default {
    name: 'CreateProjectPanel',
    components: {
      InputItem,
      ItemMaintainContainer,
      Spinner,
      TextareaItem,
      UploadImage
    },
    data () {
      return {
        alert: null,
        formData: {
          description: '',
          heroImage: '',
          ogDescription: '',
          ogImage: '',
          ogTitle: '',
          order: 0,
          slug: '',
          status: PROJECT_STATUS.WIP,
          publish_status: PROJECT_PUBLISH_STATUS.DRAFT,
          title: '',
        },
        isSaving: false,
        tagsArray: [],
      }
    },
    methods: {
      closePanel (e) {
        this.$emit('update:shouldShowCreatePanel', false)
      },
      goCreate () {
        debug('Abt to create a new project.')
        this.isSaving = true
        /**
         * ToDo: need to validate input.
         */
        createProject(this.$store, {
          active: 1,
          description: get(this.formData, 'description', ''),
          hero_Image: get(this.formData, 'heroImage', ''),
          og_title: get(this.formData, 'ogTitle', ''),
          og_description: get(this.formData, 'ogDescription', ''),
          og_image: get(this.formData, 'ogImage', ''),
          project_order: Number(get(this.formData, 'order', 0)),
          publish_status: PROJECT_PUBLISH_STATUS.DRAFT,
          slug: get(this.formData, 'slug', ''),
          status: PROJECT_STATUS.WIP,
          title: get(this.formData, 'title', ''),
          updated_by: get(this.profile, 'id'),
        }).then(res => {
          debug('res', res)
          this.isSaving = false
          this.$emit('refreshProjects', false)
          this.$emit('update:shouldShowCreatePanel', false)
        }).catch (err => {
          this.isSaving = false
          this.alert = err.message
          debug('err', err)
        })
      }
    },
    mounted () {},
  }
</script>
