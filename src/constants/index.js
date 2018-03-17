export const managerTools = [
  {
    name: 'candidate',
    route: 'project-candidate'
  },
  {
    name: 'project',
    route: 'project-manager',
    sub: [
      { name: 'project', route: 'project-manager/manager' },
      { name: 'candidate', route: 'project-manager/candidate' }
    ]
  },
]