import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting
const Index = () => import('src/views/Index.vue')
const ProjectCandidate = () => import('src/views/ProjectCandidate.vue')
const ProjectManager = () => import('src/views/ProjectManager.vue')

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/', component: Index },
      { path: '/project-candidate', component: ProjectCandidate },
      { path: '/project-manager', component: ProjectManager },
    ]
  })
}
