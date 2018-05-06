var mike = require('mike-node');
var AUTO_PUBLISH = true;

var DIR = {};
DIR.ROOT = "../";
DIR.PUBLIC = DIR.ROOT + "public/";
DIR.IMG = DIR.PUBLIC + "img/";
DIR.CSS = DIR.PUBLIC + "css/";
DIR.SASS = DIR.ROOT + "sass/";
DIR.JS = DIR.PUBLIC + "js/";
DIR.PUG = DIR.ROOT + "pug/";
DIR.DATA = DIR.ROOT + "data/";
DIR.PUBLIC_DATA = DIR.PUBLIC + "data/";

DIR.LOOKBOOK = DIR.PUBLIC + "matter/lookbook/";
DIR.CAMPAIGN = DIR.PUBLIC + "matter/campaign/";
DIR.SHOP = DIR.PUBLIC + "shop/";

//UTILS

var utils = {
  shopId: function(design, color){
    return design.id.toLowerCase() + "/" + color.id.toLowerCase();
  },
  sameId: function(a){
    return function(e){
      return a.id == e.id
    }
  },
  hexLuminance: function(c){
    c = c.replace("#", "");
    var rgb = parseInt(c, 16);
    var r = (rgb >> 16) & 0xff;
    var g = (rgb >>  8) & 0xff;
    var b = (rgb >>  0) & 0xff;

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma;
  }
};

function publish(){

  //EMPTY DIRECTORIES
  [
    DIR.LOOKBOOK,
    DIR.CAMPAIGN,
    DIR.SHOP
  ].forEach(dir => mike.empty(dir));

  //DATA
  var data = {
    navigation: mike.json.read(DIR.DATA + "navigation.json"),
    designs: mike.json.read(DIR.DATA + "designs.json"),
    colors: mike.json.read(DIR.DATA + "colors.json"),
    lookbooks: mike.json.read(DIR.DATA + "lookbooks.json"),
    campaigns: mike.json.read(DIR.DATA + "campaigns.json"),
    splash: mike.json.read(DIR.DATA + "splash.json"),
    social: mike.json.read(DIR.DATA + "social.json")
  }

  for(var prop in data){
    mike.write(
      DIR.PUBLIC_DATA + prop + ".json",
      mike.json.s(data[prop]));
  }
  mike.write(
    DIR.PUBLIC_DATA + "data.json",
    mike.json.s(data));

  //REGULAR PUGS
  [
    [ "index.pug",
      "index.html", {
      data: data,
    } ],
    [ "matter.pug",
      "matter/index.html", {
      data: data,
    } ],
    [ "lookbook/index.pug",
      "matter/lookbook/index.html", {
      data: data,
      books: data.lookbooks
    } ],
    [ "campaign/index.pug",
      "matter/campaign/index.html", {
      data: data,
      books: data.campaigns
    } ],
    [ "shop/index.pug",
      "shop/index.html", {
      data: data,
      utils: utils
    } ]
  ].forEach((e) => {
    mike.pug.write(
      DIR.PUG + e[0], null,
      DIR.PUBLIC + e[1], e[2]
    );
  });

  //CAMPAIGNS
  data.campaigns.forEach((campaign) => {
    var dir = DIR.CAMPAIGN + campaign.id;
    mike.pug.write(
      DIR.PUG + "campaign/campaign.pug", null,
      dir + "/index.html", {
        data: data,
        campaign: campaign
      }
    );
  });

  //LOOKBOOKS
  data.lookbooks.forEach((lookbook) => {
    var dir = DIR.LOOKBOOK + lookbook.id;
    mike.pug.write(
      DIR.PUG + "lookbook/lookbook.pug", null,
      dir + "/index.html", {
        data: data,
        lookbook: lookbook
      }
    );
  });

  //SHOP DESIGNS
  data.designs.forEach((design) => {
    design.colors.forEach((color) => {
      var dir = DIR.SHOP + utils.shopId(design, color);

      mike.pug.write(
        DIR.PUG + "shop/design.pug", null,
        dir + "/index.html", {
          data: data,
          utils: utils,
          design: design,
          images: color.images,
          colorId: color.id,
          color: data.colors.find(utils.sameId(color))
        });
    });
  });

  //SASS
  mike.sass.files("../sass", "../public/css");

  //PUBLISH MESSAGE
  console.log(new Date(), "Published!");
}

if(AUTO_PUBLISH){

  //AUTO PUBLISH CODE
  [
    DIR.PUG,
    DIR.SASS,
    DIR.JS,
    DIR.DATA
  ].forEach((dir) => {
    mike.watch(dir, publish);
  });
  console.log("Auto publishing...");
}

publish();
