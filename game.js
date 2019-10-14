class Game {
  constructor() {
    this.number = this.generateNumber();
    console.log("Number: ", this.number);
    this.attempts = [];
  }

  generateNumber() {
    var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array.slice(0, 4).join("");
  }

  //Check the number for cows and bulls
  createAttempt(userNum) {
    let cows = 0; //picas
    let bulls = 0; //fijas

    for (let i = 0; i < 4; i++) {
      if (this.number[i] == userNum[i]) {
        bulls++;
      } else {
        cows += this.number.indexOf(userNum[i]) > -1 ? 1 : 0;
      }
    }

    let attempt = { number: userNum, cows: cows, bulls: bulls }
    this.attempts.push(attempt);
    return attempt
  }

}

module.exports = Game;
