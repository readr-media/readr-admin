import Vue from 'vue'
import Router from 'vue-router'
import { ReadrPerm } from '../util/services'

Vue.use(Router)
Vue.use(ReadrPerm)

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
      { path: '/project-candidate', component: ProjectCandidate, meta: { permission: 'admin' } },
      { path: '/project-manager', component: ProjectManager, meta: { permission: 'admin' } },
      { path: '/project-manager/candidate', component: ProjectCandidate, meta: { permission: 'admin' } },
      { path: '/project-manager/manager', component: ProjectManager, meta: { permission: 'admin' } },
    ]
  })
}
