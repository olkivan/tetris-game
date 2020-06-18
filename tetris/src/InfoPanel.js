class InfoPanel {
  constructor() {
    this.scoreElement = document.querySelector('.score-value');
    this.linesElement = document.querySelector('.lines-value');
    this.levelElement = document.querySelector('.level-value');
  }

  render(currentScore, totalLines, level) {
    if (currentScore === undefined ||
        totalLines === undefined ||
        level === undefined) {
      throw new Error('Invalid params');
    }
    this.scoreElement.textContent = currentScore;
    this.linesElement.textContent = totalLines;
    this.levelElement.textContent = level;
  }
}

export {
  InfoPanel
};
