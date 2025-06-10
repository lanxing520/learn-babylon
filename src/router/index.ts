import { createRouter, createWebHistory } from "vue-router"
const HomePage = () => import("@/views/homepage/index.vue")
const ExperimentPage = () => import("@/views/scene/experiment/index.vue")

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "homepage",
      component: HomePage,
    },
    {
      path: "/experiment-page",
      name: "experiment-page",
      component: ExperimentPage,
    },

    // 添加通配符路由用于跳转到首页
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
})

export default router
