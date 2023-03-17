
const express = require('express')
const cors = require("cors")
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const accountSid = process.env.SID 
const authToken = process.env.AUTH_TOKEN 

const client = require('twilio')(accountSid, authToken);

const app = express();

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, "client/build")))

app.post('/verifynumber', function (req, res) {
  const { number } = req.body
  try {    

    client.lookups.v1.phoneNumbers(number)
      .fetch({type: ['carrier']})
      .then(num => {
          return  res.status(200).json({num})
          })
      .catch(error => {
        if(error)
          return res.status(500).json({message: 'API gets blocked'})
        }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({message: 'API gets blocked'})
  }
})

app.post('/insert-number', async(req, res)=> {
  const { number } = req.body
  try {
    const data = fs.readFileSync('numbers.txt', 'utf8');
    let numbers = data.split("\n");
    const check = numbers.some((num)=> num === number)
    if(check)
      return res.status(422).json({message: 'Number already saved'})
      
    fs.appendFile('numbers.txt', number + '\n', (err)=>{
      if(err)
        console.log(err);
    })
    return res.status(200).json({message: 'Number added'})
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({message: 'Server Error'})
  }
})

app.get('/get-numbers', async(req, res) => {
  try {
    const data = fs.readFileSync('numbers.txt', 'utf8');
    let numbers = data.split("\n");
    
    return res.status(200).json(numbers)
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({message: 'Server Error'})
  }
})


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", 'index.html'));
});

app.listen(5000, ()=>{
  console.log("App is listening on port 5000");
})
