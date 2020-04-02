const path = require("path"), fs = require("fs");
const { program } = require("commander");
const express = require("express")
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/", express.static(__dirname + '/public'));

program
  .requiredOption("-d, --data <folderpath>", "Folder path for data to label")
  .requiredOption("-s, --save <filepath>", "File path to save the resulting labels csv file")
  .requiredOption("-ll, --label-left <label>", "Name for left swipe label")
  .requiredOption("-lr, --label-right <label>", "Name for right swipe label")
  .option("-lu, --label-up <label>", "Name for up swipe label")
  .option("-p, --port <port>", "Port number", "8080");

program.parse(process.argv);

let config = {}, port;
let saveFileExists = false;

let validateArgs = (program)=>
{
  let saveFileFolder = path.dirname(program.save);
  if(!fs.existsSync(path.resolve(saveFileFolder)))
    return "Folder for the file path declared in --save argument does not exist";
  if(path.basename(program.save).split(".").pop().toLowerCase() != "csv")
    return "Saving file path declared is not of .csv format";
  saveFileExists = fs.existsSync(program.save);
  
  let dataPathValid = false;
  try
  {
    let stats = fs.lstatSync(path.resolve(program.data));
    if (!stats.isDirectory())
      dataPathValid = true;
  }
  catch(e){}
  if(!dataPathValid)
    
  
  config = { left: program.labelLeft, right: program.labelRight };

  if(program.labelUp)
    config.up = program.labelUp;

  if(String(parseInt(program.port)) != program.port)
    return "Port number passed to the --port argument is not a valid port";

  port = parseInt(program.port);

  return true;
}

let validationResult = validateArgs(program);
if(validationResult !== true)
{
  console.error(validationResult);
  process.exit(1);
}

let dataFiles = fs.readdirSync(program.data);

if(saveFileExists)
{
  console.log("Labels file exists, resuming labeling.");

  let csvContent = fs.readFileSync(program.save).toString();
  let labeledImages = csvContent.split("\n").slice(1).map((line)=>{ return line.split(",")[0]; });
  labeledImages.forEach((labeledImage)=>
  {
    let imageInd = dataFiles.indexOf(labeledImage);
    if(imageInd > -1)
      dataFiles.splice(imageInd, 1);
  });
}
else
{
  console.log("Labels file doesn't exist, creating the labels file.");
  fs.writeFileSync(program.save, "file,label\n");
}

let saveStream = fs.createWriteStream(program.save, {flags:'a', AutoClose:true});

app.get('/config', (req, res) => res.send(config));

app.get('/data/:imageName', (req, res) => 
{
  let imagePath = path.resolve(path.join(program.data, req.params.imageName));
  res.sendFile(imagePath);
});

app.get('/next-data', (req, res) => 
{
  let response = {name: dataFiles[0]};
  res.send(response);
});

app.post('/set-label', (req, res) => 
{
  let data = req.body;
  saveStream.write([data.name, data.label].join(",") + "\n")
  dataFiles.splice(dataFiles.indexOf(data.name), 1);
  res.sendStatus(200);
});

app.listen(port, () => console.log(`The server is running. You can navigate to http://<public_ip>:${port} on your touch-enabled device or http://localhost:${port} on your machine to access the labeler.`));