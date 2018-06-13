<template>
  <section class="report-list">
    <table>
      <thead>
        <tr>
          <th v-text="$t('report_page.id')"></th>
          <th class="report-list--title" v-text="$t('report_page.title')"></th>
          <th v-text="$t('report_page.slug')"></th>
          <th v-text="$t('report_page.belong_to_project')"></th>
          <th v-text="$t('report_page.is_published')"></th>
          <th v-text="$t('report_page.updated_time')"></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in reports" :key="report.id">
          <td class="align-center" v-text="report.id"></td>
          <td class="report-list--title"><span @click="updateReport(get(report, 'id'))" v-text="report.title"></span></td>
          <td class="align-center" v-text="report.slug"></td>
          <td class="align-center" v-text="get(report, 'project.title')"></td>
          <td class="align-center" v-text="$t(`report_page.${get(find(REPORT_PUBLISH_STATUS_MAP, { code: get(report, 'publishStatus', 0) }), 'name', 'status_draft')}`)"></td>
          <td class="align-center" v-text="getDatetime(report.updatedAt)"></td>
          <td>
            <button @click="updateReport(get(report, 'id'))" v-text="$t('report_page.button_update')"></button>
            <button @click="deleteReport(get(report, 'id'))" v-text="$t('report_page.button_delete')"></button>
          </td>
        </tr>
      </tbody>
    </table>
    <UpdateReportPanel
      v-if="shouldShowUpdatePanel"
      :report="reportGoingToUpdate"
      :shouldShowUpdatePanel.sync="shouldShowUpdatePanel"
      @refreshReports="refreshReports">
    </UpdateReportPanel>
    <AlertDelete
      v-if="shouldShowAlert"
      :item="reportGoingToDelete"
      :shouldShowAlert.sync="shouldShowAlert"
      @cancel="shouldShowAlert = false"
      @confirm="confirmDelete">
    </AlertDelete>
  </section>
</template>
<script>
  import { REPORT_PUBLISH_STATUS_MAP } from 'src/constants'
  import { find, get } from 'lodash'
  import { getDatetime } from 'src/util/comm.js'
  import AlertDelete from 'src/components/alert/AlertDelete.vue'
  import UpdateReportPanel from 'src/components/report/UpdateReportPanel.vue'

  const debug = require('debug')('CLIENT:ReportList')

  const deleteReport = (store, params) => {
    return store.dispatch('DELETE_REPORT', {
      params
    })
  }

  export default {
    name: 'ReportList',
    components: {
      AlertDelete,
      UpdateReportPanel,
    },
    props: {
      reports: {
        type: Array,
      }
    },
    data () {
      return {
        REPORT_PUBLISH_STATUS_MAP,
        reportGoingToDelete: {},
        reportGoingToUpdate: {},
        shouldShowAlert: false,
        shouldShowUpdatePanel: false,
      }
    },
    methods: {
      confirmDelete () {
        debug('Going to del this report')
        deleteReport(this.$store, {
          id: get(this.reportGoingToDelete, 'id')
        }).then(() => {
          this.shouldShowAlert = false
          this.$emit('refreshReports')
        })
      },
      deleteReport (id) {
        this.reportGoingToDelete = find(this.reports, { id: id })
        this.shouldShowAlert = true
      },
      find,
      get,
      getDatetime,
      refreshReports () {
        this.$emit('refreshReports')
      },
      updateReport (id) {
        const report = find(this.reports, { id: id })
        debug('Abt to update report.', report)
        this.shouldShowUpdatePanel = true
        this.reportGoingToUpdate = report
      }
    }
  }
</script>
<style lang="stylus" scoped>
  theme-color = hsl(176.1, 40.9%, 70.8%)

  .report-list
    max-height calc(100vh - 225px)
    margin-top 20px
    padding-right 15px
    color #fff
    overflow-y auto
    table
      width 100%
      border-collapse collapse
    th
      padding .5em 0
      border-top 4px solid #9b9b9b
      border-bottom 4px solid #9b9b9b
    tbody
      tr:hover
        color #000
        td
          background-color theme-color
        button 
          color #000
    td
      padding .5em 0
      border-bottom 1px solid #9b9b9b
    button
      color theme-color
      background-color transparent
      border none
      outline none
    button + button
      margin-left 10px
  .align-center
    text-align center
  .report-list--title
    max-width 280px
    padding-left .5em !important
    text-align left
    text-overflow ellipsis
    white-space nowrap
    overflow hidden
    span
      cursor pointer
      
</style>
