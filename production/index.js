
const express = require('express')
const cors = require("cors")
require('dotenv').config()

const accountSid = process.env.SID || 'AC58e5cada1950ed6a0321d5b79110ff25'
const authToken = process.env.AUTH_TOKEN || '3254cd93ff0a8a57d5a4172a7f00fe62'

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

app.listen(5000, ()=>{
  console.log("App is listening on port 5000");
})
