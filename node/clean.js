var mike = require('mike-node');

test("../public", "../public/img");

function test(path, images) {
	// get images
	var exts = [
		".html",
		".css",
		".js",
		".json",
		".sass",
		".pug"
	];
  var regs = [
    /\"(.*?)\"/g,
    /\'(.*?)\'/g,
    /\((.*?)\)/g
  ];
  var paths = [];
	mike.sweep(path).files.forEach(function(file) {
		var pp = mike.modules.path.parse(file);
    var ext = pp.ext;
		if (exts.indexOf(ext) != -1) {
			var text = mike.read(file);
      regs.forEach(function(reg){
  			while ((m = reg.exec(text)) !== null) {
				if (m.index === reg.lastIndex) {
					reg.lastIndex++;
				}
        m.forEach(function(link){
          if(link){
            link = link.trim()
            if(link.search(/\?/g) >= 0){
              link = link.split("?");
              link = link.shift();
            }
            var rel;
            //check if absolute or relative
            if(link.substr(0, 1) == "/" || link.substr(0, 4) == "http"){
              rel = path + "/" + link;
            } else{
              rel = pp.dir + link;
            }
            if(mike.exists(rel))
            if(mike.file(rel))
            if(mike.img.is(rel)){
              var p = rel.replace(/\/\/*/g, "/");
              if(paths.indexOf(p) == -1) paths.push(p);
            }
          }
        });
			}
      });
		}
	});
  var tempDir = ".cleaning";
  mike.mkdir(tempDir);
  mike.empty(tempDir);
  paths.forEach(function(file){
    var rel = tempDir + "/" + file.replace(images, "");
    mike.copy(file, rel);
    console.log(file, rel);
  });
  mike.empty(images);
  mike.copy(tempDir, images);
  mike.empty(tempDir);
  mike.modules.fs.remove(tempDir);
}
