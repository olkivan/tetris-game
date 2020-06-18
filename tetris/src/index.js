import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import "./tetris.css";
import './styles.scss';

// polyfills
import "core-js/stable";
import "regenerator-runtime/runtime";

//import "@babel/polyfill";

import { Tetris } from "./Tetris.js";
import { Settings } from "./Settings.js";
import { setupKeyboardHandler} from "./KeyboardHandler.js";

const tetris = new Tetris(
  Settings.NUM_ROWS,
  Settings.NUM_COLUMNS,
  Settings.VIEW_CELL_WIDTH,
  Settings.VIEW_CELL_HEIGHT,
  Settings.NEXT_FIGURE_FIELD_TOTAL_ROWS,
  Settings.NEXT_FIGURE_FIELD_TOTAL_COLUMNS
);


window.addEventListener('load', _ => {
  setupKeyboardHandler(tetris);

  const newGameBtn = document.querySelector('#newGameBtn');
  newGameBtn.addEventListener('click', _ => tetris.startNewGame());

  const pauseBtn = document.querySelector('#pauseBtn');
  pauseBtn.addEventListener('click', _ => tetris.togglePause());

  const submitBtn = document.querySelector('.hsdlgSubmitBtn');
  submitBtn.addEventListener('click', _ => {
    const playerName = document.querySelector('.hsdlgNameInput').value;
    tetris.toggleHighscoreDialog();
    sendHighscore.bind(tetris)({
      name: playerName,
      level: tetris.level,
      score: tetris.currentScore
    });
  });

  const cancelBtn = document.querySelector('.hsdlgCancelBtn');
  cancelBtn.addEventListener('click', _ => {
    tetris.toggleHighscoreDialog();
  });

  setTimeout(fetchHighscoreList.bind(tetris), 0)

  tetris.render();
});

function sendHighscore(highscore) {
  const abortController = new AbortController();

  const fetchTimeoutID = setTimeout(_ => abortController.abort(), 500);

  fetch(Settings.HIGHSCORE_POST_URL, {
    method: 'POST',
    signal: abortController.signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(highscore),
  })
    .then(response => {
      return response.json();
    })
    .then(highscoreList => {
      this.setHighscore(highscoreList);
    })
    .catch(reason => {
      console.log('Post highscore failed:', reason.message);
    })
    .finally( _ => {
      clearTimeout(fetchTimeoutID);
    });
}

function fetchHighscoreList() {
  const abortController = new AbortController();

  let fetchTimeoutID = setTimeout(_ => abortController.abort(), 500);

  fetch(Settings.HIGHSCORE_GET_URL, { signal: abortController.signal })
    .then(response => {
      return response.json();
    })
    .then(highscoreList => {
      this.setHighscore(highscoreList);
    })
    .catch(reason => {
      console.log('Get highscore failed:', reason.message);
    })
    .finally(_ => {
      clearTimeout(fetchTimeoutID);
      fetchTimeoutID = setTimeout(fetchHighscoreList.bind(this), 5 * 1000)
    });
}
