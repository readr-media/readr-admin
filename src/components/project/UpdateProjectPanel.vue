<template>
  <ItemMaintainContainer :closePanelHandler="closePanel">
    <template class="panel" slot="panel">
      <div class="panel__container">
        <div class="panel__title"><h3 v-text="$t('project_page.update_project')"></h3></div>
      </div>
      <div class="panel__container">
        <div class="panel__item">
          <div class="panel__item--title"><span v-text="$t('project_page.status')"></span></div>
          <div class="panel__option">
            <RadioItem v-for="s in status" name="status"
              :label="$t(`project_page.${get(s, 'name')}`)"
              :key="get(s, 'code')"
              :value="get(s, 'code')"
              :disabled="!isEditable"
              :currSelected.sync="formData.status"></RadioItem>
          </div>
        </div>
        <div class="panel__item publish-status">
          <div class="panel__item--title"><span v-text="$t('project_page.is_published')"></span></div>
          <div class="panel__option">
            <RadioItem v-for="s in statusPublished" name="isPublished"
              :label="$t(`project_page.${get(s, 'name')}`)"
              :key="get(s, 'code')"
              :value="get(s, 'code')"
              :disabled="!isEditable"
              :currSelected.sync="formData.isPublished"></RadioItem>
          </div>
        </div>
      </div>
      <div class="panel__container">
        <div class="panel__item progress">
          <div class="panel__item--title"><span v-text="$t('project_page.progress')"></span></div>
          <InputItem width="60px"
            :placeHolder="$t('project_page.progress')"
            :value.sync="formData.progress"></InputItem>
        </div>
        <div class="panel__item">
          <div class="panel__item--title"><span v-text="$t('project_page.points')"></span></div>
          <InputItem width="100px"
            :placeHolder="$t('project_page.points')"
            :value.sync="formData.memoPoints"></InputItem>
        </div>
        <div class="panel__item puclished-time">
          <div class="panel__item--title"><span v-text="$t('project_page.published_time')"></span></div>
          <Datetime
            v-model="formData.publishedAt"
            type="datetime"
            input-class="datepicker__input"
            :format="dateFormat"></Datetime>
        </div>        
      </div>      
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
            :alert.sync="alert.slug"
            alertPosition="bottom"
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
      <div class="panel__btn" @click="goUpdate">
        <span v-text="$t('project_page.button_update')" v-if="!isUpdating"></span>
        <Spinner class="panel__update__spinner" v-else="!isUpdating" :show="true"></Spinner>
      </div>
    </template>
  </ItemMaintainContainer>
</template>
<script>
  import InputItem from 'src/components/formItem/InputItem.vue'
  import ItemMaintainContainer from 'src/components/ItemMaintainContainer.vue'
  import RadioItem from 'src/components/formItem/RadioItem.vue'
  import Spinner from 'src/components/Spinner.vue'
  import TextareaItem from 'src/components/formItem/TextareaItem.vue'
  import UploadImage from 'src/components/formItem/UploadImage.vue'
  import validator from 'validator'

  import moment from 'moment'
  import 'vue-datetime/dist/vue-datetime.css'
  import { Datetime } from 'vue-datetime'
  
  import { PROJECT_STATUS, PROJECT_PUBLISH_STATUS, } from 'api/config'
  import { PROJECT_STATUS_MAP, PROJECT_PUBLISH_STATUS_MAP } from 'src/constants'
  import { get, map, } from 'lodash'

  const debug = require('debug')('CLIENT:UpdateProjectPanel')
  const updateProject = (store, params) => {
    return store.dispatch('UPDATE_PROJECT', {
      params
    })
  }

  export default {
    name: 'UpdateProjectPanel',
    components: {
      Datetime,
      InputItem,
      ItemMaintainContainer,
      RadioItem,
      Spinner,
      TextareaItem,
      UploadImage
    },
    computed: {
      statusValue () {
        return get(this.status, [ 0, 'code' ])
      },
    },
    data () {
      return {
        alert: {},
        dateFormat: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' },
        formData: {
          description: get(this.project, 'description', ''),
          heroImage: get(this.project, 'heroImage', ''),
          ogDescription: get(this.project, 'ogDescription', ''),
          ogImage: get(this.project, 'ogImage', ''),
          ogTitle: get(this.project, 'ogTitle', ''),
          order: get(this.project, 'projectOrder'),
          slug:  get(this.project, 'slug', ''),
          status: get(this.project, 'status', get(PROJECT_STATUS, [ 0, 'code' ])),
          title: get(this.project, 'title', ''),
          updatedBy: get(this.profile, 'id'),
          progress: get(this.project, 'progress'),
          memoPoints: get(this.project, 'memoPoints'),
          publishedAt: get(this.project, 'publishedAt'),
          isPublished: get(this.project, 'publishStatus', get(PROJECT_PUBLISH_STATUS, [ 0, 'code' ])),
        },
        isEditable: true,
        isUpdating: false,
        statusPublished: PROJECT_PUBLISH_STATUS_MAP,
        status: PROJECT_STATUS_MAP,
      }
    },
    methods: {
      closePanel () {
        this.$emit('update:shouldShowUpdatePanel', false)
      },
      get,
      goUpdate () {
        debug('moment', moment(new Date(get(this.formData, 'publishedAt', this.project.publishedAt))).format('YYYY-MM-DD hh:mm:ss'))
        const project = {
          id: this.project.id,
          title: get(this.formData, 'title', this.project.title),
          description: get(this.formData, 'description', this.project.description),
          hero_image: get(this.formData, 'heroImage', this.project.heroImage),
          og_title: get(this.formData, 'ogTitle', this.project.ogTitle),
          og_description: get(this.formData, 'ogDescription', this.project.ogDescription),
          og_image: get(this.formData, 'ogImage', this.project.ogImage),
          project_order: validator.toInt(`${get(this.formData, 'order') || 0}`),
          slug: get(this.formData, 'slug', this.project.slug),
          status: get(this.formData, 'status', this.project.status),
          progress: validator.toFloat(`${get(this.formData, 'progress') || 0}`),
          memo_points: validator.toInt(`${get(this.formData, 'memoPoints') || 0}`),          
          published_at: get(this.formData, 'publishedAt', this.project.publishedAt) ? new Date(get(this.formData, 'publishedAt', this.project.publishedAt)).toISOString() : null,
          publish_status: get(this.formData, 'isPublished', this.project.publishStatus),
        }
        debug('Abt to update the curr proj.', project)
        debug('this.formData.ogImage', get(this.formData, 'ogImage', this.project.ogImage))
        this.isUpdating = true
        if (!this.validate(project)) {
          this.isUpdating = false
          return
        }
        updateProject(this.$store, project)
          .then(res => {
            debug('res', res)
            this.isUpdating = false
            this.$emit('refreshProjects', false)
            this.$emit('update:shouldShowUpdatePanel', false)
          })
          .catch(err => {
            this.isUpdating = false
            debug('err', err)
          })
      },
      setInputValue (key, value) {
        this.formData[ key ] = value
      },
      selectedHandler (group, value) {
        this.selectedOption[ group ] = value
      },
      validate (input) {
        let pass = true
        if (PROJECT_PUBLISH_STATUS.PUBLISHED === input.publish_status
          || PROJECT_PUBLISH_STATUS.SCHEDULING === input.publish_status) {
          if (validator.isEmpty(input.slug || '')) {
            debug('Slug must be not null.')
            this.alert.slug = {
              flag: true,
              msg: this.$t('project_page.slug_should_not_be_empty'),
            }
            pass = false
          }
          if (validator.isEmpty(input.published_at || '')) {
            debug('published_at must be not null.')
            // this.alert.pwd = {
            //   flag: true,
            //   msg: this.$t('login.WORDING_REGISTER_PWD_EMPTY'),
            // }
            pass = false
          }
        }
        return pass
      },
    },
    mounted () {},
    props: {
      project: {
        type: Object
      }
    },
  }
</script>
