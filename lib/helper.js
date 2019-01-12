var fs = require('fs');

exports.deleteFolderFile = (dir) => {
    if (fs.existsSync(dir)) { 
        fs.readdir(dir, (errFiles, files) => {
            if(errFiles) {
              console.log(errFiles);
            }else {
              var inputPdfList = [];
              files.forEach(file => {
                console.log(file);
                fs.unlinkSync(dir + '/' + file);
              }); 
              folderDelate(dir);
            }
          });
    }
  };

  function folderDelate (dir) {
    if (fs.existsSync(dir)) { 
        fs.unlinkSync(dir);
    } 
  }
