// refs: https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js
// Globally register all base components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.

import Vue from "vue";
// import upperFirst from "lodash/upperFirst";
// import camelCase from "lodash/camelCase";

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  // Look for files in the current directory
  ".",
  // look in subdirectories
  true,
  // Only include "index" prefixed .js files
  /index\.js$/
);
// console.debug("requireComponent keys", requireComponent.keys());
// For each matching file name...
requireComponent.keys().forEach(fileName => {
  // Get the component config
  const componentConfig = requireComponent(fileName);
  // Get the PascalCase version of the component name
  //   const componentName = upperFirst(
  //     camelCase(
  //       fileName
  //         // Remove the "./" from the beginning
  //         .replace(/^\.\//, "")
  //         // Remove the file extension from the end
  //         .replace(/\.\w+$/, "")
  //     )
  //   );

  if (componentConfig.default) {
    componentConfig.default.install(Vue);
  } else {
    componentConfig.install(Vue);
  }
  // Globally register the component
  //   Vue.component(componentName, componentConfig.default || componentConfig);
});
