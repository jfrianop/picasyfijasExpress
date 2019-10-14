const Game = require("./game.js");
const express = require('express');
const app = express();

//Public folder
app.use(express.static('public'));
app.use((req, res, next) => {
  if (req.query.token != "12345") {
    res.status(401).json({ error: "Not authorized, token not valid" });
  }
  console.log("client token: ", req.query.token);
  next();
});

//Transforms every request into JSON object
app.use(express.json());

//Creates locale var to host games array
app.locals.games = [];

//CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Creates a new game and returns the id
app.post("/games", (req, res) => {
  let gameId = app.locals.games.length
  app.locals.games.push({ id: gameId, game: new Game() })

  res.json({ gameId })
});

//Creates a new attempt in a given game and returns the result (cows and bulls)
app.post("/games/:gameId/attempts", (req, res) => {
  let gameId = req.params.gameId;
  let gameIndex = getGameIndex(gameId);
  if (gameIndex == -1) {
    res.status(404).json({ error: "Game not found" });
    return;
  }
  let attemptNumber = req.body.num;
  if (isValid(attemptNumber)) {
    let result = app.locals.games[gameIndex].game.createAttempt(attemptNumber);
    res.json(result);
  } else {
    res.status(422).json({ error: "Attempt not valid" });
  }
});

//Returns the array of attempts in a given game
app.get("/games/:gameId/attempts", (req, res) => {
  let gameId = req.params.gameId;
  let gameIndex = getGameIndex(gameId);
  if (gameIndex == -1) {
    res.status(404).json({ error: "Game not found" });
    return;
  }
  let result = app.locals.games[gameIndex].game.attempts;
  res.json(result);

});

//Handles server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
  next();
});



app.listen(3000)


//looks for the game with a given id in the array and returns the index
const getGameIndex = (id) => {
  let index = -1;
  app.locals.games.forEach((game, i) => {
    if (game.id == id) {
      index = i;
    }
  })
  return index;
}

//validates if an attempt is a string with four different digits
const isValid = (num) => {
  let attempt = num.replace(/\D/g, '');
  const valideNumber = Array.from(new Set(attempt.split('').map(Number)))
  return valideNumber.length === 4;
}

