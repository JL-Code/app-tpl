import Component from "./src/card";

Component.install = function(Vue) {
  Vue.component(Component.name, Component);
};

export default Component;
