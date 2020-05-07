//requirements and extensions for Project
const express = require("express");
const bodyParser = require("body-parser");
var request = require("request");
const app = express();
const ejs = require("ejs");

//Data Source
const diseaseList = require(__dirname + "/diseaseList.js");
const diseaseSymptoms = require(__dirname + "/diseaseSymptoms.js");
const homeRemedies = require(__dirname + "/homeRemedies.js");
const precautions = require(__dirname + "/precautions.js");
const locations = require(__dirname + "/locations.js");
const resources = require(__dirname + "/resources.js");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

app.use(express.static('public'));

//Port Used
app.listen("3000", function() {

  //Check if started
  console.log(" Server started on port 3000");
});

//Get request for root route
app.get("/", function(req, res) {

  //Response Object for home page
  res.render("index", {});
});

//Get request for DiseaseCategory List
app.get("/DiseaseCatList", function(req, res) {

  //Response Object for The Category of Disease
  res.render("DiseaseCategoryList", {
    Title: "Select the Category that Best Relates to your Symptoms",
    disease: diseaseList
  });
});

//Get request for resources of all the disease
app.get("/disease/allResoruces", function(req, res) {

  //Response object  for all the disease
  res.render("ResourcesList", {
    resource: resources
  });
});


//Get request for resources of  single disease
app.get("/:type/resources", function(req, res) {

  for (var i = 0; i < resources.length; ++i) {

    //Response object for Single disease Resources
    if (resources[i].name === req.params.type) {
      res.render("ResourcesList", {
        resource: [resources[i]]
      });
      break;
    }
  }
});

//Get request for about page
app.get("/aboutpage", function(req, res) {
  res.render("About", {});
});

//Get request for contacts page
app.get("/contacts", function (req, res) {
  res.render("Contacts", {});
});

//Get request for disease in the Category Selected
app.get("/:type", function(req, res) {
  var tempSymptoms = [],
    symptoms = [];

    //Looping through all disease category to find a match
  for (var i = 0; i < diseaseList.length; ++i) {

    //Match Found
    if (diseaseList[i].category == req.params.type) {

      //Getting all the required symptoms in Given Disease Category
      for (var j = 0; j < diseaseList[i].disease.length; ++j) {

        for (var k = 0; k < diseaseSymptoms[diseaseList[i].disease[j]].length; ++k)
          tempSymptoms.push(diseaseSymptoms[diseaseList[i].disease[j]][k]);
      }
    }
  }

  //To displaySymptoms Sorted Alphabetically
  tempSymptoms = tempSymptoms.sort();

  //Eliminating Symptoms which Got added Multiple Times
  //Done in O(n) Time
  for (var i = 0; i < tempSymptoms.length - 1; ++i) {

    //If current symptom differs from future symptom
     if (tempSymptoms[i] !== tempSymptoms[i + 1])
      {
        symptoms.push(tempSymptoms[i]);
        console.log(tempSymptoms[i]);
      }

  }

  //Adding Last Symptom
  symptoms.push(tempSymptoms[tempSymptoms.length - 1]);

  //Response Object for Displaying the symptoms under certain Disease Category
  res.render("SymptomsList", {
    Category: req.params.type,
    Title: "Select your Symptoms",
    symptoms: symptoms
  });

});

//Get request for home remedies
app.get("/homeRemedies/:type", function(req, res) {

  //Rendering Response Object for home Remedies of particular disease
  res.render("HomeRemediesList", {
    remedies: homeRemedies[req.params.type]
  });
});

//Get request for precautions
app.get("/precautions/:type", function(req, res) {

  //Rendering Response Object for precautions of particular disease
  res.render("PrecautionList", {
    precautions: precautions[req.params.type]
  });
});

//Get request for finding nearby  hospitals
app.get("/hospital/list", function(req, res) {

  //Rendering Response Object for Selecting Current Location To get nearby hospital Using Google API
  res.render("LocationList", {
    Location: locations
  });
});

//Assumed Relation for predciting disease
function assumedRelation(x)
{
  return x;
}

//Post requests  for finding the Disease a person may have
app.post("/answer", function(req, res) {

  //Accuracy of the Selected Answer
  var accuracy = 0;

  //Base Value for Checking
  var baseValue=1;

  //Increment variable for calculation of Result
   var assumedIncrement=0.2;

   //Answer Variable
    var answer = "";

    //Symptoms Exctracted
    occuredSymptoms = req.body.checkbox;

    //If User doesn't select any Symptom redirect to add  Symptom
    if(occuredSymptoms==null)
    res.redirect("/"+req.body.Category);

    //Finding the category from all the disease
  for (var i = 0; i < diseaseList.length; ++i) {

    //Category Found
    if (diseaseList[i].category == req.body.Category) {

      //Loop through all the disease in that Category
      for (var j = 0; j < diseaseList[i].disease.length; ++j) {

        //Name of the disease
        var key = diseaseList[i].disease[j];

        //Mean calculation variable
          var weight = 0;

        //Sum of Weights
        var totalWeight=0;

        //Looping through all the symptoms in disease(key) to find match
        for (var k = 0; k < diseaseSymptoms[key].length; ++k) {

          //Checking the match of symptoms in particular disease
          for (var l = 0; l < occuredSymptoms.length; ++l) {

            //If match Found
            if (occuredSymptoms[l] == diseaseSymptoms[key][k])
            {
              //Adding to the mean for answer
                weight+=baseValue+k*assumedRelation(assumedIncrement);
            }
          }

          //addition on Total weight;
          totalWeight=baseValue+k*assumedRelation(assumedIncrement);
        }

        //Accuracy calculation for the selected Disease
        var tempAccuracy = (weight/totalWeight) * 100;

        //For Selecting most Probable Disease
        if (accuracy < tempAccuracy) {
          accuracy = tempAccuracy;
          answer = key;
        }

      }
    }
  }

  //Posting Request to Required .ejs File(Answer.ejs)
  res.render("Answer", {
    Title: answer
  });
});
