
const express = require('express')
const cors = require("cors")
const fs = require('fs')
require('dotenv').config()

const accountSid = process.env.SID 
const authToken = process.env.AUTH_TOKEN 

const client = require('twilio')(accountSid, authToken);

const app = express();

app.use(cors())
app.use(express.json())

app.use(express.static("client/build"))

app.post('/verifynumber', function (req, res) {
  const { number } = req.body
  try {    

    client.lookups.v1.phoneNumbers(number)
      .fetch({type: ['carrier']})
      .then(num => {
          res.status(200).json({num})
          })
      .catch(error => console.log(error.message));
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({message: 'Server Error'})
  }
})

app.post('/insert-number', async(req, res)=> {
  const { number } = req.body
  try {
    fs.writeFile('numbers.txt', number, (err)=>{
      console.log(err);
    })
    return res.status(200).json({message: 'Number added'})
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({message: 'Server Error'})
  }
})

app.listen(5000, ()=>{
  console.log("App is listening on port 5000");
})
