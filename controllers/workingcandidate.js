exports.uploadcsv = catchAsyncErrors(async (req, res, next) => {
  let resFilePath1 = "";
  let fileName = "";
  let dataarray = [];
  let candidateorg = [];
  let imageDir = `./public/csv/`;
  let paths =""
  let resImageDir = `/csv/`;
  if (req.files?.abcd) {
    uploadPath = __dirname + "uploads";
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    if (req.files?.abcd.length === undefined || req.files?.abcd.length == 1) {
      let randstr = Math.random().toString(36).substring(2, 7);
      let multimedia = req.files.abcd;
      let imageExt = path.extname(multimedia.name);
      fileName = req.files.abcd.name;
      let filePath = fileName;
      resFilePath1 = imageDir + fileName;
      dataarray.push(resImageDir + fileName);

      multimedia.mv(resFilePath1);

      paths= path.join(__dirname, "..", `${resFilePath1}`);
      var newobj = {};
      const csvFile = fs.createReadStream(paths);
      const parser = csv
        .parseStream(csvFile, { headers: true })
        .on("data", async function (data) {
          var key,
            keys = Object.keys(data);
          var n = keys.length;
          
          while (n--) {
            key = keys[n];
            newobj[key.toLowerCase()] = data[key];
          }
        })
          await Candidate.collection.initializeUnorderedBulkOp().insert(newobj)
          .execute()
          .then(async(data) => {
            fs.stat(paths, function (err, stats) {
              console.log(stats);//here we got all information of file in stats variable
           
              if (err) {
                  return console.error(err);
              }
           
              fs.unlink(paths,function(err){
                   if(err) return console.log(err);
                   console.log('file deleted successfully');
              });  
           });
            return "data"
          })
          .catch((err) => {
            console.log("Errror is", err);
            return "err";
          });
        
          return res.json({
            status:true,
            message:"Data inserted Sucessfull."
          })
//   await uploadCsv(paths).then((op)=>{
    
      //console.log("op is",op)
    // });
    }
    console.log("fs.unlinkSync(filePath);")
    
   
  }
});