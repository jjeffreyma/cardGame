let currentHand = [];
let clickedCards = [];
let gamePlayers = 1;

function newDeck() {
  let deck = [];
  // building the deck
  let suits = [1, 2, 3, 4];
  for (let i = 30; i <= 150; i += 10) {
    suits.forEach(suit => {
      deck.push(i + suit);
    });
  }
  //shuffling the deck using the Fisher-Yates shuffle
  let m = deck.length;
  let t;
  let i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = deck[m];
    deck[m] = deck[i];
    deck[i] = t;
  }
  return deck;
}

function startGame(number) {
  // dividing the deck
  let players = [];
  let numberOfPlayers = number;
  let deck = newDeck();
  players.push('');
  for (let i = 1; i <= numberOfPlayers; i += 1) {
    let playerHand = deck.splice(0, 52 / numberOfPlayers);
    players[i] = playerHand.sort((a, b) => {
      return a - b;
    });
  }
  players.forEach((player, index) => {
    $.ajax({
      url: 'http://localhost:3000/start',
      type: "POST",
      data: sendCards(player, 'player' + index, '', '', ''),
      dataType: "json",
      contentType: "application/json"
    });
  });
  $.ajax({
    url: 'http://localhost:3000/player/player0',
    type: "PUT",
    data: sendCards('', 'player0', '', 'player1', numberOfPlayers.toString()),
    dataType: "json",
    contentType: "application/json"
  });
  displayCards(players[1], true);
  addCardListener();
}

function sendCards(cards, player, hand, current, number) {
  var obj = {
    player: player,
    cards: cards,
    hand: hand,
    currentplayer: current,
    number: number
  }
  return JSON.stringify(obj);
}

function resetCards() {
  $.get('http://localhost:3000/player/player1', function (data) {
    currentHand = [];
    let cards = [...data.cards.split(",")];
    displayCards(cards, true);
    addCardListener();
  });
}

function updateCards(curr, left) {
  let current = storeCards(curr);
  let leftovers = storeCards(left);
  let nextPlayer = 'player1';
  if (gamePlayers >= 2) nextPlayer = 'player2';
  $.ajax({
    url: 'http://localhost:3000/player/player0',
    type: "PUT",
    data: sendCards(current, 'player0', checkHand(current), nextPlayer, gamePlayers.toString()),
    dataType: "json",
    contentType: "application/json"
  });
  $.ajax({
    url: 'http://localhost:3000/player/player1',
    type: "PUT",
    data: sendCards(leftovers, 'player1', '', '', ''),
    dataType: "json",
    contentType: "application/json"
  });
}

function updatePile() {
  $.get('http://localhost:3000/player/player0', function (data) {
    $('#pile').val(displayCards(data.cards, false));
    $('h3').text(data.currentplayer + '\'s turn');
  });
}

function displayCards(cards, buttons) {
  if (!buttons) {
    var result = [];
  }
  cards = cards.toString().split(',');
  cards.forEach((card, index) => {
    card = card.toString().split('');
    if (card[card.length - 1] === '1') {
      card.splice(card.length - 1, 1, '♣');
    }
    if (card[card.length - 1] === '2') {
      card.splice(card.length - 1, 1, '♦');
    }
    if (card[card.length - 1] === '3') {
      card.splice(card.length - 1, 1, '♥');
    }
    if (card[card.length - 1] === '4') {
      card.splice(card.length - 1, 1, '♠');
    }
    if (card[1] === '1') {
      card.splice(0, 2, 'J');
    }
    if (card[1] === '2') {
      card.splice(0, 2, 'Q');
    }
    if (card[1] === '3') {
      card.splice(0, 2, 'K');
    }
    if (card[1] === '4') {
      card.splice(0, 2, 'A');
    }
    if (card[1] === '5') {
      card.splice(0, 2, '2');
    }
    card = card.join('');
    if (!buttons) result.push(card);
    if (buttons) {
      currentHand.push(card);
      let $cards = $('<button class="cards"></button>');
      $cards.text(card);
      $cards.attr('id', 'card' + index);
      $cards.appendTo('.playerCardsDisplay');
    }
  });
  if (!buttons) return result;
}

function storeCards(cards) {
  let result = [];
  cards.forEach((card, index) => {
    card = card.toString().split('');
    if (card[card.length - 1] === '♣') {
      card.splice(card.length - 1, 1, '1');
    }
    if (card[card.length - 1] === '♦') {
      card.splice(card.length - 1, 1, '2');
    }
    if (card[card.length - 1] === '♥') {
      card.splice(card.length - 1, 1, '3');
    }
    if (card[card.length - 1] === '♠') {
      card.splice(card.length - 1, 1, '4');
    }
    if (card[0] === 'J') {
      card.splice(0, 1, '1', '1');
    }
    if (card[0] === 'Q') {
      card.splice(0, 1, '1', '2');
    }
    if (card[0] === 'K') {
      card.splice(0, 1, '1', '3');
    }
    if (card[0] === 'A') {
      card.splice(0, 1, '1', '4');
    }
    if (card[0] === '2') {
      card.splice(0, 1, '1', '5');
    }
    card = card.join('');
    result.push(card);
  });
  result = result.sort((a, b) => {
    return a - b;
  });
  return result;
}

function addCardListener() {
  $('.cards').on('click', function (event) {
    console.log(this.innerHTML);
    $('#send').show();
    clickedCards.push(this.innerHTML);
    if (clickedCards.length === 4) {
      $('#send').hide();
    }
    if (clickedCards.length === 5) {
      $('#send').show();
    }
    if (clickedCards.length > 5) {
      clickedCards.pop();
      return;
    }
    $('#clickedCards').val(clickedCards);
    this.remove();
  });
}

function resetHand() {
  clickedCards = [];
  $('#clickedCards').val('');
  $('.cards').remove();
  resetCards();
}

function checkHand(array) {
  numarray = storeCards(array);
  if (numarray.length === 1) {
    let temp1 = numarray[0].slice(0, -1);
    return 'single' + temp1;
  }
  if (numarray.length === 2) {
    let temp1 = numarray[0].slice(0, -1);
    let temp2 = numarray[1].slice(0, -1);
    if (temp1 === temp2) {
      return 'double' + temp1;
    } else {
      return false;
    }
  }
  if (numarray.length === 3) {
    let temp1 = numarray[0].slice(0, -1);
    let temp2 = numarray[1].slice(0, -1);
    let temp3 = numarray[2].slice(0, -1);
    if (temp1 === temp2 && temp1 === temp3) {
      return 'triple' + temp1;
    } else {
      return false;
    }
  }
  if (numarray.length === 5) {
    let num1 = +numarray[0].slice(0, -1);
    let num2 = +numarray[1].slice(0, -1);
    let num3 = +numarray[2].slice(0, -1);
    let num4 = +numarray[3].slice(0, -1);
    let num5 = +numarray[4].slice(0, -1);
    let suit1 = +numarray[0].slice(-1);
    let suit2 = +numarray[1].slice(-1);
    let suit3 = +numarray[2].slice(-1);
    let suit4 = +numarray[3].slice(-1);
    let suit5 = +numarray[4].slice(-1);
    let flush = false;

    if (suit1 === suit2 && suit1 === suit3 && suit1 === suit4 && suit1 === suit5) {
      flush = true;
    }

    if ((num1 === num2 && num1 === num3 && num1 === num4) || (num2 === num3 && num2 === num4 && num2 === num5)) {
      return 'quad' + num3;
    }

    if (num1 === num2 && num3 === num4 && num3 === num5) {
      return 'fullhouse' + num3;
    }

    if (num1 === num2 && num1 === num3 && num4 === num5) {
      return 'fullhouse' + num1;
    }

    if ((num1 + 1 === num2) && (num2 + 1 === num3) && (num3 + 1 === num4) && (num4 + 1 === num5)) {
      if (flush && num5 === 14) return 'straightflushroyal' + suit1;
      if (flush) return 'straightflush' + numarray[4];
      return 'straight' + numarray[4];
    }

    if (num1 === 3 && num2 === 4 && num3 === 5 && num4 === 6 & num5 === 15) {
      return 'straight' + numarray[3];
    }

    if (num1 === 3 && num2 === 4 && num3 === 5 && num4 === 14 & num5 === 15) {
      return 'straight' + numarray[2];
    }

    if (flush) return 'flush' + numarray[4];

    return false;
  }
}

function isSubstring(s1, s2) {
  return s1.indexOf(s2) >= 0;
}

function storeHand(string) {
  if (isSubstring(string, 'single')) return string.slice(6);
  if (isSubstring(string, 'double')) return '1' + string.slice(6);
  if (isSubstring(string, 'triple')) return '11' + string.slice(6);
  if (isSubstring(string, 'straightflushroyal')) return '6666' + string.slice(18);
  if (isSubstring(string, 'straightflush')) {
    if (string.length === 15) {
      return '550' + string.slice(13);
    }
    if (string.length === 16) {
      return '55' + string.slice(13);
    }
  }
  if (isSubstring(string, 'flush')) {
    if (string.length === 7) {
      return '110' + string.slice(5);
    }
    if (string.length === 8) {
      return '11' + string.slice(5);
    }
  }
  if (isSubstring(string, 'straight')) {
    if (string.length === 10) {
      return '220' + string.slice(8);
    }
    if (string.length === 11) {
      return '22' + string.slice(8);
    }
  }
  if (isSubstring(string, 'fullhouse')) return '3333' + string.slice(9);
  if (isSubstring(string, 'quad')) return '4444' + string.slice(4);
}

function compareHands(hand) {
  let pile = $('#pile').val();
  if (pile.length === 0) return true;
  pile = pile.split(',');
  pile = checkHand(storeCards(pile));
  if (isSubstring(hand, 'single') && isSubstring(pile, 'single')) {
    return +storeHand(hand) > +storeHand(pile) ? true : false;
  }
  if (isSubstring(hand, 'double') && isSubstring(pile, 'double')) {
    return +storeHand(hand) > +storeHand(pile) ? true : false;
  }
  if (isSubstring(hand, 'triple') && isSubstring(pile, 'triple')) {
    return +storeHand(hand) > +storeHand(pile) ? true : false;
  }
  if (hand.length >= 5 && pile.length >= 5) {
    return +storeHand(hand) > +storeHand(pile) ? true : false;
  }
  return false;
}

$(document).ready(function () {
  let $gameForm = $('<form id="start"><input id="playerNumber" type="text" placeholder="1-4players" maxlength="1"><input class="button" type="submit" value="Start game"></form>');
  let $pile = $('<input readonly id="pile" type="text">');
  let $playerCardsForm = $('<form id="send"><input class="button" type="submit" value="Send"></form>');
  let $resetButton = $('<button id="reset">Reset</button>');
  let $passButton = $('<button id="pass">Pass</button>');
  let $clickedCards = $('<input readonly id="clickedCards" type="text">');

  $gameForm.appendTo($('.roundDisplay'));
  $pile.appendTo('.pile');
  $passButton.appendTo($('.playerCardsForm'));
  $resetButton.appendTo($('.playerCardsForm'));
  $clickedCards.appendTo($('.playerCardsForm'));
  $playerCardsForm.appendTo($('.playerCardsForm'));
  $('h2').hide();
  $('#player2').hide();
  $('#player3').hide();
  $('#player4').hide();
  $('.pile').hide();
  $('.playerCardsForm').hide();

  $('#start').on('submit', function (event) {
    event.preventDefault();
    let number = $('#playerNumber').val()
    number = parseInt(number)
    gamePlayers = number;
    if (number > 0 && number < 5) {
      $('h2').show();
      if (number === 2) $('#player2').show();
      if (number === 3) {
        $('#player2').show();
        $('#player3').show();
      }
      if (number === 4) {
        $('#player2').show();
        $('#player3').show();
        $('#player4').show();
      }
      startGame(number);
      $gameForm.remove();
      $('.pile').show();
      $('.playerCardsForm').show();
      $('#send').hide();
      setInterval(function () {
        updatePile();
      }, 1000)
    } else {
      alert('Enter valid number between 1 and 4');
      $('#playerNumber').val('');
    }
  });

  $('#send').on('submit', function (event) {
    event.preventDefault();
    if (!checkHand(clickedCards)) {
      resetHand();
      return;
    }
    if (!compareHands(checkHand(clickedCards))) {
      resetHand();
      alert('Cards not high enough!')
      return;
    }
    clickedCards.forEach(card => {
      let index = currentHand.indexOf(card);
      currentHand.splice(index, 1);
    });
    if (currentHand.length === 0) alert('You win!');
    updateCards(clickedCards, currentHand);
    updatePile();
    clickedCards = [];
    $('#send').hide();
    $('#clickedCards').val('');
  });

  $('#reset').on('click', function (event) {
    resetHand();
  });

  $('#pass').on('click', function (event) {
    resetHand();
    updateCards([], currentHand);
  });
});