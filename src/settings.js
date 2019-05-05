import { version, name } from "../package";

export default {
  constants: {
    TOKEN: "token"
  },
  http: {
    timeout: 15000
  },
  releases: {
    name,
    version
  },
  copywriting: {
    loadingText: "加载中"
  }
};
