const Player = require('./playerModel');

const playerController = {

  getAllUsers(req, res) {
    Player.find({}, (err, results) => {
      if (err) {
        console.log('find all players error', err);
        return res.end();
      }
      return res.status(200).json(results);
    });
  },

  createPlayer(req, res) {
    // console.log(req.body);
    Player.create(req.body, (err, studentRecord) => {
      if (err) {
        console.log('create player error', err);
        return res.end();
      }
      console.log('players created');
      return res.end();
    });
  },

  getPlayer(req, res) {
    const player = req.params.player;
    Player.findOne({ player: player }, (err, results) => {
      if (results === null) {
        return res.status(418).json(err);
      } else {
        return res.status(200).json(results);
      }
    });
  },

  updatePlayer(req, res) {
    const player = req.params.player;
    const newCardData = req.body.cards;
    const newHandData = req.body.hand;
    const newCurrentPlayer = req.body.currentplayer;
    const newNumber = req.body.number;
    console.log(req.body);

    Player.update(
      { player: player },
      {
        $set: {
          cards: newCardData,
          hand: newHandData,
          currentplayer: newCurrentPlayer,
          number: newNumber
        }
      }, function (err, result) {
        if (err) {
          return res.status(418).json(err);
        }
        console.log('updated!');
        return res.end();
      }
    )
  }
};

module.exports = playerController;
