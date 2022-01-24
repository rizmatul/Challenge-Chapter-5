class Game {
  constructor(player, comp) {
    this.player = player;
    this.comp = comp;
    this.result = null;
    this.round = 1;

    this.versus = document.querySelector('.versus h1');
    this.resultClass = document.querySelector('.versus div div');
    this.textResult = document.querySelector('.versus h5');
    this.compBox = document.querySelectorAll('.greyBox.compImage');
    this.playerBox = document.querySelectorAll('.greyBox.playerImage');
  }

  getResult(player, comp) {
    if (player.choice === comp.choice) this.result = 'DRAW';
    if (player.choice === 'rock' && comp.choice === 'scissor') { this.result = 'PLAYER 1 WIN'; }
    if (player.choice === 'rock' && comp.choice === 'paper') { this.result = 'COM WIN'; }
    if (player.choice === 'paper' && comp.choice === 'rock') { this.result = 'PLAYER 1 WIN'; }
    if (player.choice === 'paper' && comp.choice === 'scissor') { this.result = 'COM WIN'; }
    if (player.choice === 'scissor' && comp.choice === 'paper') { this.result = 'PLAYER 1 WIN'; }
    if (player.choice === 'scissor' && comp.choice === 'rock') { this.result = 'COM WIN'; }
  }

  setPlayerGreyBox(player) {
    if (player.choice === 'rock') { this.playerBox[0].style.backgroundColor = '#c4c4c4'; } else if (player.choice === 'paper') { this.playerBox[1].style.backgroundColor = '#c4c4c4'; } else this.playerBox[2].style.backgroundColor = '#c4c4c4';
  }

  setCompGreyBox(comp) {
    if (comp.choice === 'rock') { this.compBox[0].style.backgroundColor = '#c4c4c4'; } else if (comp.choice === 'paper') { this.compBox[1].style.backgroundColor = '#c4c4c4'; } else this.compBox[2].style.backgroundColor = '#c4c4c4';
  }

  showResult(player, comp) {
    this.versus.style.color = '#9c835f';
    this.resultClass.classList.add('result');
    this.textResult.innerHTML = this.result;
    this.textResult.style.backgroundColor = '#4c9654';
    if (this.result === 'DRAW') { this.textResult.style.backgroundColor = '#225c0e'; }
    this.setCompGreyBox(comp);
  }

  compThink() {
    const start = new Date().getTime();
    let i = 0;

    setInterval(() => {
      if (new Date().getTime() - start >= 1000) {
        return clearInterval;
      }
      this.compBox[i++].style.backgroundColor = '#c4c4c4';
      if (i === this.compBox.length) i = 0;
    }, 50);

    setTimeout(() => {
      setInterval(() => {
        if (new Date().getTime() - start >= 1200) {
          return clearInterval;
        }
        const compBox = document.querySelectorAll('.greyBox.compImage');
        compBox[i++].style.backgroundColor = '#9c835f';
        if (i === compBox.length) i = 0;
      }, 50);
    }, 50);
  }

  startGame(player, comp) {
    comp.getCompChoice();
    this.getResult(player, comp);
    this.setPlayerGreyBox(player);

    this.compThink();

    setTimeout(() => {
      this.showResult(player, comp);
    }, 1200);

    this.round++;
  }

  sendHistory(player, comp) {
    const xhr = new XMLHttpRequest();
    const time = new Date().getTime();
    xhr.open('POST', '/rockpaperscissor');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    const msg = JSON.stringify({
      time: Math.floor(time / 1000),
      'player choice': player.choice.toUpperCase(),
      'comp choice': comp.choice.toUpperCase(),
      result: this.result,
    });
    xhr.send(msg);
  }

  refresh() {
    this.textResult.innerHTML = '';
    this.resultClass.classList.remove('result');
    this.versus.style.color = 'rgb(189,48,46)';
    this.result = null;

    for (let i = 0; i < this.compBox.length; i++) {
      this.playerBox[i].style.backgroundColor = '#9c835f';
      this.compBox[i].style.backgroundColor = '#9c835f';
    }
  }
}

class Player {
  constructor() {
    this.choice = null;
  }

  getPlayerChoice(choice) {
    this.choice = choice;
  }
}

class Comp extends Player {
  getCompChoice() {
    const choice = Math.random();
    if (choice <= 1 / 3) this.choice = 'rock';
    if (choice > 1 / 3 && choice <= 2 / 3) this.choice = 'paper';
    if (choice > 2 / 3) this.choice = 'scissor';
  }
}

const p1 = new Player();
const cpu = new Comp();
const game = new Game(p1, cpu);

document.querySelectorAll('.contentImage .player').forEach((playerimg) => {
  playerimg.addEventListener('click', () => {
    if (!game.result) {
      const playerChoice = playerimg.className.substr(7, 7);

      p1.getPlayerChoice(playerChoice);

      game.startGame(p1, cpu);
    }
  });
});

document
  .querySelector('.refresh')
  .addEventListener('click', () => {
    game.sendHistory(p1, cpu);
    game.refresh();
  });
