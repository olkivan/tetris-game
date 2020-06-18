// Tetris server. Provides highscore storage

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');


const app = express();
const port = 3000;
const highscoreSaveInterval = 10000;
const maxHighscoreListSize = 5;
const highscoreFilePath = 'highscore.json';

let g_highscoreList = [];


function loadHighscoreList() {
  fs.readFile(highscoreFilePath, (err, data) => {
    if (err)  {
      console.log('Warning: Can\'t load highscore file:', err);
      return;
    }

    g_highscoreList = JSON.parse(data);
  });
}

function saveHighscoreList() {
  const content = JSON.stringify(g_highscoreList);
  fs.writeFile(highscoreFilePath, content, err => {
    if (err) console.log('Can\'t save highscore file. Error:', err);
  });
}

app.use(cors());
app.use(bodyParser());

app.get('/highscorelist', async (_, res) => {
  res.send(g_highscoreList);
});

app.post('/highscore', (req, res) => {
  g_highscoreList.push(req.body);
  g_highscoreList.sort((left, right) => {  return right.score - left.score; });
  g_highscoreList.splice(maxHighscoreListSize);

  res.send(g_highscoreList);
});

loadHighscoreList();

setInterval(_ => {
  saveHighscoreList();
}, highscoreSaveInterval);

app.listen(port, () => console.log(`Tetris App Srv is listening on port ${port}!`))
