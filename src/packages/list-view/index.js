import Component from "./src/list-view";

Component.install = function(Vue) {
  Vue.component(Component.name, Component);
};

export default Component;
