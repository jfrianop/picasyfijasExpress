//Generate random Number
let currentGame;
var token = "12345";

const start = () => {
  $(".result tbody").html("")
  $("input").val("");

  fetch("/games?token=" + token, {
    headers: { 'Content-Type': 'application/json' },
    method: "POST",
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.log(data.error);
        return;
      }
      currentGame = data.gameId;
    });
}

var number = 0;
$(document).ready(start());


$("input").on('keypress', function (e) {
  if (e.which == 13) {
    var test = $(this).val();
    if (validate(test)) {
      postAttempt(test);
    } else {
      $("#wnum").modal('show');
      $(".bad-number").html('<p>El número <strong>' + test + '</strong> no es válido,' +
        ' recuerda que deben ser cuatro dígitos del 0 al 9 sin repetirse.</p>');
      $("input").val("");
    }
  }
});

const validate = (num) => {
  let attempt = num.replace(/\D/g, '');
  const valideNumber = Array.from(new Set(attempt.split('').map(Number)))
  return valideNumber.length === 4;
}

const postAttempt = (num) => {
  fetch("/games/" + currentGame + "/attempts?token=" + token, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({ num: num })
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.log(data.error);
        return;
      }
      var fijas = data.bulls;
      var picas = data.cows;
      var test = data.number;
      $(".results tbody").append('<tr><th scope="row">' + $(".results tr").length + '</th><td>' + test + '</td><td>' + picas + '</td><td>' + fijas + '</td></tr>')
      $("input").val("");
      if (fijas == 4) {
        $("#win").modal('show');
        $(".win-number").html('<p>Adivinaste el número: ' + test + '</p>');
        start();
      }
    });
}
