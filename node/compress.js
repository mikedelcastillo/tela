var mike = require('mike-node');
mike.silent = false;

var inp = "../oimg";
var out = "../public/img";

mike.empty(out);
mike.imgs.resizeAndCompress(inp, out, [
  {
    affix: "-icon",
    maxSize: 192
  },
  {
    affix: "-small",
    maxSize: 400
  },
  {
    affix: "-medium",
    maxSize: 720
  },
  {
    affix: "-large",
    maxSize: 1920
  },
  {
    affix: "-xlarge",
    maxSize: 1920 * 2
  },
  {
    maxSize: 9999
  }
]);
