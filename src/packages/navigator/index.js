import Component from "./src/navigator";

Component.install = function(Vue) {
  Vue.component(Component.name, Component);
};

export default Component;
