import request from "@/plugins/axios";

export function FetchAbout() {
  var url = "/api/overallplan/about";
  return request.get(url);
}
