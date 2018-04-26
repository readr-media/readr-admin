<template>
<select name="country" v-model.number="selectedProjectId">
  <option disabled value="0">請選擇一項議題</option>
  <option v-for="project in projects"
          :key="project.id"
          :value="project.id"
          v-text="project.title">
  </option>
</select>
</template>

<script>
import { get, } from 'lodash'
const MAXRESULT_PROJECTS = 50
const DEFAULT_PAGE = 1
const DEFAULT_SORT = '-updated_at'
const fetchProjects = (store, { page }) => {
  return store.dispatch('FETCH_PROJECTS', {
    params: {
      max_result: MAXRESULT_PROJECTS,
      page: page || DEFAULT_PAGE,
      sort: DEFAULT_SORT,
    }
  }).catch(err => debug(err))
}

export default {
  props: {
    projectId: {
      type: Number,
      default: 0
    }
  },
  watch: {
    selectedProjectId (selectedProjectId) {
      if (this.optionChanged) {
        this.$emit('update:projectId', selectedProjectId)
      }
    }
  },
  data () {
    return {
      curr_page: DEFAULT_PAGE,
      selectedProjectId: get(this, 'projectId', 0),
    }
  },
  computed: {
    projects () {
      return get(this.$store.state, 'projects', [])
    },
    optionChanged () {
      return this.selectedProjectId !== 0
    }
  },
  beforeMount () {
    fetchProjects(this.$store, { page: this.curr_page })
  }  
}
</script>
