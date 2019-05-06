import Component from "./src/load-more";

Component.install = function(Vue) {
  Vue.component(Component.name, Component);
};

export default Component;
