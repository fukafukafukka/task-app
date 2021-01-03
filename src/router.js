import Vue from 'vue'
import VueRouter from "vue-router"
Vue.use(VueRouter);

import PreLogin from './components/PreLogin'
/** ログイン後に読み込みたい（Lazy Load）したいコンポーネント郡↓ */
// const TaskTable = function () {
//   return import('./components/TaskTable')
// }
// const DoneTaskTable = function () {
//   return import('./components/DoneTaskTable')
// }
// const DeletedTaskTable = function () {
//   return import('./components/DeletedTaskTable')
// }
// const CreaateUser = function () {
//   return import('./components/CreateUser')
// }
import TaskTable from './components/TaskTable'
import DoneTaskTable from './components/DoneTaskTable'
import DeletedTaskTable from './components/DeletedTaskTable'
import CreaateUser from './components/CreateUser'

// import store from './store';

let router = new VueRouter({
  routes: [
    {
      path: '/preLogin',
      component: PreLogin,
      meta: { isPublic: true }
    },
    {
      path: '/taskTable',
      component: TaskTable,
      meta: { isPublic: false }
    },
    {
      path: '/doneTaskTable',
      component: DoneTaskTable,
      meta: { isPublic: false }
    },
    {
      path: '/deletedTaskTable',
      component: DeletedTaskTable,
      meta: { isPublic: false }
    },
    {
      path: '/createUser',
      component: CreaateUser,
      meta: { isPublic: false }
    },
  ]
})

// router.beforeEach((to, from, next) => {
//   // isPublic でない場合(=認証が必要な場合)、かつ、ログインしていない場合
//   if (to.matched.some(record => !record.meta.isPublic) && store.state.csrfTokenByLogined == null) {
//     next({ path: '/preLogin', query: { redirect: to.fullPath }});
//   } else {
//     next();
//   }
// });

export default router
