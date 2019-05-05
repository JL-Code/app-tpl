/* global Buffer */
var fs = require("fs");

function UTF8BOMPlugin(options) {
  let defaults = { addBOM: false, fileMask: /\.(html|htm|css|js|map)$/ };
  let opts = Object.assign(defaults, options);

  // console.log("调用: " + Date.now())
  // console.log(opts)

  this.fileMask = opts.fileMask;
  this.addBOM = opts.addBOM;
}

UTF8BOMPlugin.prototype.apply = function (compiler) {
  var self = this;
  compiler.hooks.done.tap("utf8bom", function (Stats, callback) {
    var files = Stats.compilation.assets;
    for (var fileName in files) {
      var path = files[fileName]["existsAt"];
      if (!path) {
        return;
      }
      console.warn("done", fileName);
      console.warn("match", self.fileMask);
      if (!self.fileMask || !fileName.match(self.fileMask)) {
        continue;
      }

      // Whether add or remove BOM head
      var isAdd = self.addBOM;

      var buff = fs.readFileSync(path);

      if (isAdd) {
        // console.log("add bom:" + fileName);
        if (
          buff.length < 3 ||
          buff[0].toString(16).toLowerCase() != "ef" ||
          buff[1].toString(16).toLowerCase() != "bb" ||
          buff[2].toString(16).toLowerCase() != "bf"
        ) {
          var bom = new Buffer([0xef, 0xbb, 0xbf]);
          buff = bom + buff;
          fs.writeFile(path, buff.toString(), "utf8", function (err) {
            if (err) throw err;
          });
        }
      } else {
        // console.log("remove bom" + fileName);
        if (
          buff.length >= 3 &&
          buff[0].toString(16).toLowerCase() == "ef" &&
          buff[1].toString(16).toLowerCase() == "bb" &&
          buff[2].toString(16).toLowerCase() == "bf"
        ) {
          buff = buff.slice(3);
          fs.writeFile(path, buff.toString(), "utf8", function (err) {
            if (err) throw err;
          });
        }
      }
    }
  });
};

module.exports = UTF8BOMPlugin;
