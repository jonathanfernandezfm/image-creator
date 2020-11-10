
const { createCanvas, loadImage } = require('canvas')
const { client, client_secret } = require('./config/auth.json')['wow'];
const wowAPI = require("./lib/wowAPI");

const express = require('express')
const app = express()
const port = 3000

const wowClient = new wowAPI(client, client_secret);

const WIDTH = 1120
const HEIGHT = 290

const canvas = createCanvas(WIDTH, HEIGHT)
const context = canvas.getContext('2d')

context.font = 'bold 70pt Menlo'
context.textAlign = 'center'
context.textBaseline = 'top'
context.fillStyle = '#3574d4'

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.get('/create-image', async (req, res) => {
  const id = req.query.id;
  const text = req.query.text;
  const date = req.query.date;

  if(!id || !text || !date){
    res.status(404).json({status: 404, error: 'Bad parameters', message: 'Provide id, text and date'})
    return;
  }

  let achievement = await wowClient.getAchievementMedia(14068);
  let assets = achievement.assets;
  let icon_url;

  assets.forEach(item => {
    if(item.key === 'icon') {
      icon_url = item.value;
    }
  })
  context.fillStyle = '#000'
  context.font = 'bold 30pt Menlo'
  context.fillText(`Mythic: N'Zoth killed`, 200, 50)

  loadImage('./assets/achieve-back.png').then(image => {
    context.drawImage(image, 0, 0, WIDTH, HEIGHT)

    loadImage(icon_url).then(image1 => {
      context.drawImage(image1, 28, 63, 160, 160)
      
      context.fillStyle = '#fff'
      context.font = '30pt Cambria Math'
      context.shadowColor="black";
      context.shadowBlur=2;
      context.lineWidth=2;
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 3;
      context.fillText(`${text}`, WIDTH/2+30, 30)

      context.font = '15pt Cambria Math'
      context.shadowColor = 'transparent';
      context.fillStyle = '#222'
      context.fillText(`${date}`, WIDTH/2+30, 148)
      
      const buffer = canvas.toBuffer('image/png');
      res.write(buffer);
      res.end();
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
