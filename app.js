const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// This is used to incorporate styles.css and images to the html file
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
})


// The following is used to store the data given by the user.
app.post("/",function(req,res){

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
      email_address: email,
      status: "subscribed",
      merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/89875ccbf0";

  const options = {
    method: "POST",
    auth: "jose1:" //API KEY NEEDED AFTER COLON!!!!!!!!!
  }

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

})

app.post("/failure", function(req,res){
  res.redirect("/");
})



// Port was changed from local (3000) to process.evn.PORT for heroku
// process.evn.PORT || 3000 allows you to run the web app locally and on heroku
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
});
