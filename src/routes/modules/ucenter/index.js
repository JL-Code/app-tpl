import Help from "@/views/ucenter/help";
import Answer from "@/views/ucenter/help/answer";

const routes = [
  {
    path: "/UCenter/Help",
    name: "Help",
    component: Help,
    meta: { requiresAuth: true, title: "帮助中心" }
  },
  {
    path: "/UCenter/Help/Answer",
    name: "Answer",
    component: Answer,
    meta: { requiresAuth: true, title: "" }
  }
];
export default routes;
