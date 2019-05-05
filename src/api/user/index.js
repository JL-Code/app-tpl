import request from "@/plugins/axios";

/**
 *  获取用户信息
 */
export function FetchUser() {
  const url = "/api/OverallPlan/user";
  return request.get(url);
}
