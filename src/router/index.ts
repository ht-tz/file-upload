/*
 * @Author: htz
 * @Date: 2024-05-31 21:49:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-02 16:14:52
 * @Description: base64文件上传
 */
import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router"



const routes: Array<RouteRecordRaw> = [ 
  {
        name: "首页",
        path: "/",
    component: () => import("@components/single-formData/index.vue")
  },
  {
    name: "base64",
    path: "/base64",
    component: () => import("@components/single-formData-base64/index.vue")
  },
  {
    name: "sut",
    path: "/sut",
    component: () => import("@components/slt_upload/index.vue")
  },
  {
    name: "pg",
    path: "/pg",
    component: () => import("@components/progress-control/index.vue")
  },
  {
    name: "mu",
    path: "/mu",
    component: () => import("@components/mulfile_upload/index.vue")
  },
  {
    name: "du",
    path: "/du",
    component: () => import("@components/drag_upload/index.vue")
  },
  {
    name: "bd",
    path: "/bd",
    component: () => import("@components/bigfile_upload/index.vue")
  }
]


const router  = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router