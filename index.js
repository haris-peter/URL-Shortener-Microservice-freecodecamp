require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended:false}))

const urlDatabase={}
let urlcounter=1

const isvalidUrl=(submitedUrl)=>{
  try{
    const parsedurl=new URL(submitedUrl)
    return parsedurl.protocol==='http:'|| parsedurl.protocol==='https:'
  }catch(err){
    return false;
  }
}
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl',(req,res)=>{
  const {url:originaUrl}=req.body;

  if(!isvalidUrl(originaUrl)){
    return res.json({error:'invalid url'})
  }

  const shorturl=urlcounter++;
  urlDatabase[shorturl]=originaUrl;

  res.json({
    original_url:originaUrl,
    short_url:shorturl,
  })
})

app.get('/api/shorturl/:short_url',(req,res)=>{
  const { short_url}=req.params;
  const originaUrl=urlDatabase[short_url]

  if(!originaUrl){
    return res.status(400).json({erro:'No short URL found for the given input'})
  }

  res.redirect(originaUrl);
})

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
