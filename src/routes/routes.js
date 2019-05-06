import Home from "../views/Home";
import Index from "../views/Index";
import UCenter from "../views/ucenter";

import AuthRoutes from "./modules/auth";
import UCenterRoutes from "./modules/ucenter";

export default [
  {
    path: "/",
    name: "Home",
    meta: { requiresAuth: true },
    redirect: { name: "Index" },
    component: Home,
    children: [
      {
        path: "/Index",
        name: "Index",
        component: Index,
        meta: { requiresAuth: true, title: "" }
      },
      {
        path: "/UCenter",
        name: "UCenter",
        component: UCenter,
        meta: { requiresAuth: true, title: "" }
      }
    ]
  },
  ...AuthRoutes,
  ...UCenterRoutes
];
