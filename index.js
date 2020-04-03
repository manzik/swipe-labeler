#!/usr/bin/env node

const path = require("path"), fs = require("fs");
const { program } = require("commander");
const express = require("express")
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/", express.static(__dirname + '/public'));

program
  .name("swipe-labeler")
  .usage("[options]")
  .requiredOption("-d, --data <folderpath>", "folder path for data to label")
  .requiredOption("-s, --save <filepath>", "file path to save the resulting labels csv file")
  .requiredOption("-ll, --label-left <label>", "name for left swipe label")
  .requiredOption("-lr, --label-right <label>", "name for right swipe label")
  .option("-p, --port [port]", "Port number", "8080")
  .option("-lu, --label-up [label]", "name for up swipe label")
  .option("-hc, --hide-class-numbers", "hide the number of labled and remaining items in client's browser", false);

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
    if (stats.isDirectory())
      dataPathValid = true;
  }
  catch(e){}
  if(!dataPathValid)
    return "Folder declared in --data argument does not exist";
  
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

let counts = { "remaining": 0 };
counts[program.labelLeft] = 0;
counts[program.labelRight] = 0;
if(program.labelUp)
  counts[program.labelUp] = 0

if(saveFileExists)
{
  console.log("Labels file exists, resuming labeling.");

  let csvContent = fs.readFileSync(program.save).toString();
  let labeledImages = csvContent.split("\n").slice(1).filter((line) => { return line.length; }).map((line) =>
  { 
    let lineData = line.split(","); 
    return { name: lineData[0], label: lineData[1] };
  });
  labeledImages.forEach((labeledImage)=>
  {
    let imageInd = dataFiles.indexOf(labeledImage.name);
    if(imageInd > -1)
    {
      dataFiles.splice(imageInd, 1);
      counts[labeledImage.label]++;
    }
  });
}
else
{
  console.log("Labels file doesn't exist, creating the labels file.");
  fs.writeFileSync(program.save, "file,label\n");
}

counts.remaining = dataFiles.length;

let saveStream = fs.createWriteStream(program.save, {flags:'a', AutoClose:true});

app.get('/config', (req, res) => res.send(config));

app.get("/data/:fileName", (req, res) => 
{
  let filePath = path.resolve(path.join(program.data, req.params.fileName));
  res.sendFile(filePath);
});

app.get("/next-data", (req, res) => 
{
  let response = {name: dataFiles[0]};
  
  if(!program.hideClassNumbers)
    response.counts = counts;

  res.send(response);
});

app.post("/set-label", (req, res) => 
{
  let data = req.body;

  labelingFileIndex = dataFiles.indexOf(data.name);

  if(labelingFileIndex != -1)
  {
    counts[data.label]++;
    counts.remaining--;

    saveStream.write([data.name, data.label].join(",") + "\n")
    dataFiles.splice(labelingFileIndex, 1);
  }

  res.sendStatus(200);
});

app.listen(port, () => console.log(`The server is running. You can navigate to http://<public_ip>:${port} on your touch-enabled device or http://localhost:${port} on your machine to access the labeler.`));

module.exports = {};