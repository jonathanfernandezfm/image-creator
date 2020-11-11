
const { registerFont, createCanvas, loadImage } = require('canvas')
const { client, client_secret } = require('./config/auth.json')['wow'];
const wowAPI = require("./lib/wowAPI");

const express = require('express')
const app = express()
const port = 3000

const wowClient = new wowAPI(client, client_secret);

const WIDTH = 1120
const HEIGHT = 290

registerFont('./assets/FrizQuadrata.ttf', { family: 'FrizQuadrata' })

const canvas = createCanvas(WIDTH, HEIGHT)
const context = canvas.getContext('2d')

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.get('/create-image.png', async (req, res) => {
  const id = req.query.id;
  const text = req.query.text;
  const date = req.query.date;

  if(!id || !text || !date){
    res.status(404).json({status: 404, error: 'Bad parameters', message: 'Provide id, text and date'})
    return;
  }

  let achievement = await wowClient.getAchievementMedia(id);
  let assets = achievement.assets;
  let icon_url;

  if(!assets){
    res.status(404).json({status: 404, error: 'Bad id', message: 'Wrong ID'})
    return;
  }

  assets.forEach(item => {
    if(item.key === 'icon') {
      icon_url = item.value;
    }
  })

  if(!icon_url) {
    res.status(404).json({status: 404, error: 'Bad id', message: 'Wrong ID'})
    return;
  }

  let image, imageBack;

  try {
    image = await loadImage(icon_url);
    imageBack = await loadImage('./assets/achieve-back.png');
  } catch (err) {
    console.log("FAILED TO LOAD IMAGES", err);
    res.status(500).json({status: 500, error: 'Error loading images', message: 'Error loading images'})
    return;
  }
  
  context.drawImage(image, 25, 58, 175, 175)
  context.drawImage(imageBack, 0, 0, WIDTH, HEIGHT)
  context.textAlign = 'center'
  context.textBaseline = 'top'
  context.fillStyle = '#fff'
  context.font = '30pt FrizQuadrata'
  context.shadowColor="black";
  context.shadowBlur=2;
  context.lineWidth=2;
  context.shadowOffsetX = 3;
  context.shadowOffsetY = 3;
  context.fillText(`${text}`, WIDTH/2+30, 120)

  context.font = '24pt FrizQuadrata'
  context.shadowColor = 'transparent';
  context.fillStyle = '#111'
  context.fillText(`${date}`, WIDTH/2+30, 188)
  
  const buffer = canvas.toBuffer('image/png');
  res.contentType('image/png')
  res.write(buffer);
  res.end();
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`App started`)
})
