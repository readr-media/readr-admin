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
}
</script>
