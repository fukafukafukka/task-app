import Vue from 'vue'
import VueRouter from "vue-router"
Vue.use(VueRouter);

import PreLogin from './components/PreLogin'
import TaskTable from './components/TaskTable'
import DoneTaskTable from './components/DoneTaskTable'
import DeletedTaskTable from './components/DeletedTaskTable'
import CreaateUser from './components/CreateUser'
import Error from './components/Error'

let router = new VueRouter({
  routes: [
    {
      path: '/preLogin',
      component: PreLogin,
    },
    {
      path: '/taskTable',
      component: TaskTable,
    },
    {
      path: '/doneTaskTable',
      component: DoneTaskTable,
    },
    {
      path: '/deletedTaskTable',
      component: DeletedTaskTable,
    },
    {
      path: '/createUser',
      component: CreaateUser,
    },
    {
      path: '/error',
      component: Error,
    },
  ]
})

export default router
