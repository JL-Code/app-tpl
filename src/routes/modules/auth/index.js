import Login from "@/views/auth/Login";
import PhoneLogin from "@/views/auth/PhoneLogin";
import Password from "@/views/auth/Password";
import WeixinOAuth from "@/views/auth/WeixinOAuth";
import AccountBinding from "@/views/auth/AccountBinding";

/**
 * @description 身份认证及账号相关
 */
export default [
  {
    path: "/Auth/Login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false, title: "" }
  },
  {
    path: "/Auth/Password",
    name: "Password",
    component: Password,
    meta: { requiresAuth: false, title: "" }
  },
  {
    path: "/Auth/WeixinOAuth",
    name: "WeixinOAuth",
    component: WeixinOAuth,
    meta: { requiresAuth: false, title: "" }
  },
  {
    path: "/Auth/PhoneLogin",
    name: "PhoneLogin",
    component: PhoneLogin,
    meta: { requiresAuth: false, title: "" }
  },
  {
    path: "/Auth/AccountBinding",
    name: "AccountBinding",
    component: AccountBinding,
    meta: { requiresAuth: false, title: "" }
  }
];
