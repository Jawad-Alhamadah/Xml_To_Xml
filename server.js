var express = require('express');
const readline = require('readline');
const fs = require('fs');
var app = express();
const SaveFiles = require("./models/SaveFiles.js")
var convert = require('xml-js');
const mongoose = require('mongoose');
const ConnectionString = "mongodb+srv://varonss:vortix2950@outputfiles.98cuc.mongodb.net/OutPutFiles?retryWrites=true&w=majority"
const multer = require('multer');
const uuid = require('uuid').v4;
const upload = multer({
  dest: 'upload/'
})
var bodyParser = require('body-parser')
var format = require('xml-formatter');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
require('body-parser-xml')(bodyParser);
// parse application/x-www-form-urlencoded
app.use(bodyParser.json())
app.use(bodyParser.xml())



app.post('/download', function (req, res) {

  var RandomSnapShot =  Math.floor(Math.random() * (999999999999 - 10000 + 1)) + 10000;
  const savefile = new SaveFiles({
  
    Name: "MyUpLoad-"+RandomSnapShot,
    Content: format(req.body.data,{ collapseContent: true,})
   
  })
/// make the stuff
  savefile.save().then(() => {
    console.log("saved!")
    res.send(format(req.body.data,{ collapseContent: true,}))
  });


});

app.get('/download', function (req, res) {

  res.download(__dirname + `/upload/Upload-${req.query.data}.xml`, function (err) {
    if (err) throw err;
    setTimeout(() => {
      fs.unlink(__dirname + `/upload/Upload-${req.query.data}.xml`, (err) => {
        if (err) {
          console.error(err)
          return
        }

        //file removed
      }, 3000)
    })

  })

});

//


mongoose.connect(ConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((result) => app.listen(port, function () {
    console.log("listen 3000...")
  }))
  .catch((err) => console.log(err))

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/upload'));
app.post('/upload', upload.single('avatar'), (req, res) => {
 
  fs.readFile(__dirname + '/upload/' + req.file.filename, 'utf8', function (err, data) {
    if (err) throw err;
    var options = {
      compact: true,
      elementNameFn: function (val) {
        return val.replace('foo:', '').toUpperCase();
      }
    };
    var result = convert.xml2json(data, options);
    return res.json(result)

  });
})
app.post('/post-input', upload.single('filename'), (req, res) => {
  fs.readFile(__dirname + '/upload/' + req.file.filename, 'utf8', function (err, data) {
    if (err) throw err;
    res.end(data, () => {

      fs.unlink(__dirname + '/upload/' + req.file.filename, (err) => {
        if (err) {
          console.error(err)
          return
        }

        //file removed
      })

    })



  });
})

/*
app.get("/SaveFile", (req, res) => {
  const savefile = new SaveFiles({
    Name: "hi",
    Content: "lints of stuff",
    listOfTags: ["stuff", "things"]
  })

  savefile.save().then(() => {
    console.log("saved!")
  });
})
*/



app.get("/hehe", (req, res) => {
  res.json({
    time: "sgs"
  })
})

fs.readFile(__dirname + '/upload/test.xml', 'utf8', function (err, data) {
  if (err) throw err;
  var options = {
    compact: true,
    elementNameFn: function (val) {
      return val.replace('foo:', '').toUpperCase();
    }
  };
  var result = convert.xml2json(data, options);
});