//requirements
const express = require("express");
const bodyParser = require("body-parser");
var request = require("request");
const app = express();
const ejs = require("ejs");
const  diseaseList=require(__dirname+"/diseaseList.js");
const  diseaseSymptoms=require(__dirname+"/diseaseSymptoms.js");
const homeRemedies=require(__dirname+"/homeRemedies.js");
const precautions=require(__dirname+"/precautions.js");
const locations=require(__dirname+"/locations.js");
const resources=require(__dirname+"/resources.js");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');



//Listening Port
app.listen("3000", function() {
  console.log(" Server started on port 3000");
});


//Get requests
app.get("/", function(req, res) {
  res.render("DiseaseCategoryList", {
    Title: "What Do you Think Where is the problem?",
    disease: diseaseList
  });
});



//Get request for all the Detailed Disease
app.get("/disease/allResoruces",function(req,res){
  //res.send("He");
 res.render("resources",{resource:resources});
});


//Get request for resources of  single disease
app.get("/:type/resources",function(req,res){
  for(var i=0;i<resources.length;++i)
  {
    if(resources[i].name===req.params.type)
    {
      res.render("resources",{resource:[resources[i]]});
      break;
    }
  }
});



//get request for disease name
app.get("/:type", function(req, res) {
  var tempSymptoms=[],symptoms=[];
  for(var i=0;i<diseaseList.length;++i)
  {
    if(diseaseList[i].category==req.params.type)
    {
      for(var j=0;j<diseaseList[i].disease.length;++j)
      {
        for(var k=0;k<diseaseSymptoms[diseaseList[i].disease[j]].length;++k)
        tempSymptoms.push(diseaseSymptoms[diseaseList[i].disease[j]][k]);
      }
    }
  }
  tempSymptoms=tempSymptoms.sort();
  for(var i=0;i<tempSymptoms.length-1;++i)
  {
    if(tempSymptoms[i]===tempSymptoms[i+1])
    i++;
    else
    symptoms.push(tempSymptoms[i]);
  }
   symptoms.push(tempSymptoms[tempSymptoms.length-1]);
  res.render("SymptomsList",{Category:req.params.type,Title:"Select the symptoms you have",symptoms:symptoms});
});


//Get request for home remedies
app.get("/homeRemedies/:type",function(req,res){
  res.render("homeRemedies",{remedies:homeRemedies[req.params.type]});
});

//Get request for precautions
app.get("/precautions/:type",function(req,res){
  res.render("precautions",{precautions:precautions[req.params.type]});
});

//Get request for finding hospitals
app.get("/hospital/list",function(req,res){
  console.log("heyhos");
  res.render("locationList",{Location:locations});
});
//Get request for finding hospitals
app.get("/hospita/list",function(req,res){
  res.render("locationList",{Location:locations});
});

//Post requests  for finding Disease
app.post("/answer", function(req, res) {
  var accuracy=0,answer="",occuredSymptoms=req.body.checkbox;
  for(var i=0;i<diseaseList.length;++i)
  {
    if(diseaseList[i].category==req.body.Category)
    {
      for(var j=0;j<diseaseList[i].disease.length;++j)
      {
        var key=diseaseList[i].disease[j],count=0;
        for(var k=0;k<diseaseSymptoms[key].length;++k)
        {
          for(var l=0;l<occuredSymptoms.length;++l)
          {
            if(occuredSymptoms[l]==diseaseSymptoms[key][k])
            count++;
          }
        }
        var tempAccuracy=(count/diseaseSymptoms[key].length)*100;
        if(accuracy<tempAccuracy)
        {
          accuracy=tempAccuracy;
          answer=key;
        }
      }
    }
  }
  res.render("Answer",{Title:answer});
});
