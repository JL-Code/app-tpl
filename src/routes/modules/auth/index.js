import Login from "@/views/auth/Login";
import PhoneLogin from "@/views/auth/PhoneLogin";
import Password from "@/views/auth/Password";
import WeixinOAuth from "@/views/auth/WeixinOAuth";
import BindOnAccount from "@/views/auth/BindOnAccount";

// auth
export default [
  {
    path: "/Auth/Login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false, title: "计划系统移动版" }
  },
  {
    path: "/Auth/Password",
    name: "Password",
    component: Password,
    meta: { requiresAuth: false, title: "计划系统移动版" }
  },
  {
    path: "/Auth/WeixinOAuth",
    name: "WeixinOAuth",
    component: WeixinOAuth,
    meta: { requiresAuth: false, title: "计划系统移动版" }
  },
  {
    path: "/Auth/PhoneLogin",
    name: "PhoneLogin",
    component: PhoneLogin,
    meta: { requiresAuth: false, title: "计划系统移动版" }
  },
  {
    path: "/Auth/BindOnAccount",
    name: "BindOnAccount",
    component: BindOnAccount,
    meta: { requiresAuth: false, title: "计划系统移动版" }
  }
];
