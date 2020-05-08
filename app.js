/*
Start Date: March 15,2020
By: Shikha Singh
This is the back-end file for All the Server work done in JavaScript
The tech stack include using express files(.ejs).
It simplifies the complex project into simpler usable modules.
And write javaScript in HTML Like pages itself
*/


//requirements and extensions for Project
//These are the additional files needed
//Imported using Node Packagae Manager
const express = require("express");
const bodyParser = require("body-parser");
var request = require("request");
const app = express();
const ejs = require("ejs");



//Data Source
//These includes data files to be imported.
//Helps in Rendering the content.
//The creation of these files Required really long time
//because searching of reliable and uselful sources were needed
//Kept in database and imported into the .js file


//Date: 21 March 2020
//By : Surya Pratap Singh
const diseaseList = require(__dirname + "/diseaseList.js");
const diseaseSymptoms = require(__dirname + "/diseaseSymptoms.js");

//Date: 22 March 2020
//By Shikha Singh
const homeRemedies = require(__dirname + "/homeRemedies.js");
const precautions = require(__dirname + "/precautions.js");

//Date: 23 March 2020
//By Shaunaq Paul
const locations = require(__dirname + "/locations.js");
const resources = require(__dirname + "/resources.js");

//setting static source as public so that absolute path not needed.
//It will make our App ready to be hosted on online platform such as heroku
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true

}));

//Sets view engine as *.ejs files
//Ensures we can write Javascript Inside HTML like pages
 app.set('view engine', 'ejs');




//Date :30 March 2020
//By Surya Pratap Singh

//Setting up th server by adding Packages such as node.js and others.
//Check if started
//Port Used(The free port has to be checked)
app.listen("3000", function() {
  //A message to remind Server started without error
  console.log(" Server started on port 3000");
});

//Get request for root route.
//This is the initial page of our application.
//Friendly user interface ensured.
app.get("/", function(req, res) {
  //Response Object for home page
  res.render("index", {});
});



//Date: 31st March 2020
//By Shaunaq Paul
//Get request for DiseaseCategory List
app.get("/DiseaseCatList", function(req, res) {

  //Response Object for The Category of Disease
  //Fetches Disease Category List
  // in the form of List of JavaScript Object(JSO)
  //so that user can decide what kind of problem they are facing
  res.render("DiseaseCategoryList", {
    Title: "Select the Category that Best Relates to your Symptoms",
    disease: diseaseList
  });
});


//Date: 1st April 2020
//By Shikha Singh
//Get request for resources of  single disease
app.get("/:type/resources", function(req, res) {

  //This will search through all the List  of
  // JavaScript Resources object to get the required
  // disease resource.The :type parameter is dynamic and hence
  //single get request handles all different path requests
  //making our application modern and up-to-date.
  for (var i = 0; i < resources.length; ++i) {

    //If match found
    if (resources[i].name === req.params.type) {
      //Response object for Single disease Resources
      res.render("ResourcesList", {
        resource: [resources[i]]
      });
      break;
    }
  }
});


//Date: 7th April 2020
//By Shaunaq Paul
//Get request for resources of all the disease
app.get("/disease/allResoruces", function(req, res) {

  //This is used to get cumulative resources
  //of all the disease for better Understanding of any diseaseList
  //This gives user an extended functionality
  //Saving his/her time by otherwise they would have wasted on
  //Google Search
  //Response object  for all the disease
  res.render("ResourcesList", {
    resource: resources
  });
});

//Date: 8th April 2020
//By Shaunaq Paul
//Get request for about page
app.get("/aboutpage", function(req, res) {
  //Provides information about the Creator of application.
  //Response object  for About Page
  res.render("About", {});
});


//Date: 9th April 2020
//By Shaunaq Paul
//Get request for contacts page
app.get("/contacts", function (req, res) {
  //Provides information for whom to contact
  //In case of further query regarding application
  //They can mail their suggestion and query to us.
  //Response object  for Contacts
  res.render("Contacts", {});
});


//Date: 8th April 2020
//By Shikha Singh
//Get request for disease in the Category Selected
app.get("/:type", function(req, res) {

  //The get request finds all the symptoms in
  //particular Disease Category by doing  a really efficient
  //search on the data source. This is essentially a filtering algorithm.
  //This also provides sorted disease symptoms in the form of list
  //of strings passed as attribute to the required .ejs file
  //It is a dynamic page hence it combined numerous :type path request
  //in one get request

  //Variable for storing the Symptoms List
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
        //For backend check if all Symptoms added correctly.
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


//Date: 15th April 2020
//By Surya Pratap Singh
//Get request for home remedies
app.get("/homeRemedies/:type", function(req, res) {
  //This is for getting remedies of any disease.
  // Like other get request it uses request parameter to make Multiple
  //Get request combined to one.

  //Rendering Response Object for home Remedies of particular disease
  res.render("HomeRemediesList", {
    remedies: homeRemedies[req.params.type]
  });
});


//Date: 16th April 2020
//By Surya Pratap Singh
//Get request for precautions
app.get("/precautions/:type", function(req, res) {
  //This is for getting precautions of any disease.
  // Like other get request it uses request parameter to make Multiple
  //Get request combined to one.

  //Rendering Response Object for precautions of particular disease
  res.render("PrecautionList", {
    precautions: precautions[req.params.type]
  });
});


//Date: 17th April 2020
//By Surya Pratap Singh
//Get request for finding nearby  hospitals
app.get("/hospital/list", function(req, res) {
  //This helps user to get Nearby hospitals without switching application
  //We Map a user's Current location to geological coordinate
  //Then find all the hospitals near him/her.

  //Rendering Response Object for Selecting Current Location To get nearby hospital Using Google API
  res.render("LocationList", {
    Location: locations
  });
});



//Date: 25th-30th April 2020
//By Shikha Singh


//Assumed Relation for predciting disease
//This is the relation and amount of variance
//assumed between two Symptoms so that the provide better results
//To make our function modular we can change the  x Value
//any time we want in order to get different results
//We found liner relation works fine
//But as more disase is added we might need to change the function
//This function also can be changed when more dataset is available
function assumedRelation(x)
{
  return x;
}

//Post requests  for finding the Disease a person may have
app.post("/answer", function(req, res) {

  //This is where we find what disease a person
  //is inflicted with based on their Symptoms
  //To do so we calculate weighted mean of all the symptoms
  //for all the disease and find the disase best suited to the symptom
  //The algorithm use different data Resource file at different

  //stage to get the best result.
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
