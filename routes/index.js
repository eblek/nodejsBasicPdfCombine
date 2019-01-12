var express = require('express');
var router = express.Router();
const multer = require('multer');
const fs = require('fs');
const merge = require('easy-pdf-merge');
const helper = require('../lib/helper');




  router.post('/api/multiPdfCombine', (req, res) => {
    var dir = './' + Math.random();

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    var date = new Date();
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
         cb(null, '')
       },
       limits:{
        fileSize:10000
       },
       filename: (req, file, cb) => {
         cb(null,  dir + '/' + Date.now() + Math.round(Math.random() * 98765) + ".pdf" )
       },
       fileFilter: function (req, file, cb) {
         if (path.extension(file.originalname) !== '.pdf') {
           return cb(new Error('Only pdfs are allowed'))
         }
     
         cb(null, true)
       }
   });
   var upload = multer({storage: storage}).any('file');
   const cleanFolder =  (folderPath) => {
    del.sync([`${folderPath}/**`, `!${folderPath}`]);
   };
   upload(req, res, (err) => {
    if (err) {
      res.status(400);
      res.send(err);
    }else {
      if (fs.existsSync(dir)) {
        fs.readdir(dir, (errFiles, files) => {
          if(errFiles) {
            res.status(400);
            res.json(errFiles);
          }else {
            var inputPdfList = [];
            files.forEach(file => {
              console.log(file);
              inputPdfList.push(dir + '/' + file);
            }); 
            const pdfCombineName = Date.now() + Math.round(Math.random() * 98765);
            merge(inputPdfList, 'public/pdfConbineFile/' + pdfCombineName + '.pdf', (errMerge) => {
              if(errMerge) {
                console.log(errMerge);
                res.status(400);
                res.json(errMerge);
              }else {
                helper.deleteFolderFile(dir);
                res.status(200);
                res.json(JSON.parse(JSON.stringify({"link" : "localhost:3000/pdfConbineFile/" +pdfCombineName + ".pdf"})));
              }
           });
          }
        });
    }else {
      res.status(400);
      res.json("folder not found");
    }
    }
   });
  });

module.exports = router;
