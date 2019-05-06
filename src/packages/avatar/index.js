import Component from "./src/avatar";

Component.install = function(Vue) {
  Vue.component(Component.name, Component);
};

export default Component;
