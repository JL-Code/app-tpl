import Home from "../views/Home";
import Index from "../views/Index";
import UCenter from "../views/ucenter";

export default [
  {
    path: "/",
    name: "Home",
    redirect: { name: "Index" },
    component: Home,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/Index",
        name: "Index",
        component: Index,
        meta: { requiresAuth: true, title: "我的首页" }
      },
      {
        path: "/UCenter",
        name: "UCenter",
        component: UCenter,
        meta: { requiresAuth: true, title: "我的信息" }
      }
    ]
  }
];
