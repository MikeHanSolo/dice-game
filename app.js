/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

function init () {
  scores = [0, 0];
  activePlayer = 0;
  roundScore = 0;
  gamePlaying = true;

  document.querySelector('.die').style.display = 'none';
  document.getElementById('score-0').textContent = '0';
  document.getElementById('score-1').textContent = '0';
  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';
  document.getElementById('name-0').textContent = 'Player 1';
  document.getElementById('name-1').textContent = 'Player 2';
  document.querySelector('.player-0-panel').classList.remove('winner');
  document.querySelector('.player-1-panel').classList.remove('winner');
  document.querySelector('.player-0-panel').classList.remove('active');
  document.querySelector('.player-1-panel').classList.remove('active');
  document.querySelector('.player-0-panel').classList.add('active');
}

function nextPlayer() {
  activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
  roundScore = 0;
  
  // Reset current round score to 0 after player becomes active
  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';

  // Swap active player
  document.querySelector('.player-0-panel').classList.toggle('active');
  document.querySelector('.player-1-panel').classList.toggle('active');

  // Reset by hiding die roll from last player until current player rolls
  document.querySelector('.die').style.display = 'none';
}

var scores, roundScore, activePlayer, gamePlaying;

init ();

document.querySelector('.btn-roll').addEventListener('click', function() {
  // Disable rolling or holding until animation is done
  $('.btn-roll').prop('disabled', true);
  $('.btn-hold').prop('disabled', true);
  if (gamePlaying) {
    // Roll logic and display correct die side
    var rollVal = Math.floor(Math.random() * 6) + 1;
    var dieDOM = document.querySelector('.die');

    console.log(rollVal + ',' + roundScore);
    $(dieDOM)
    .show()
    .attr('current-roll', rollVal)
    .toggleClass('pos-spin neg-spin')
    .one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() { 
      // If player doesn't roll === 1, then keep adding up round score
      if (rollVal !== 1) {
        roundScore += rollVal;
        document.getElementById('current-' + activePlayer).textContent = roundScore;
      } else {
        setTimeout(nextPlayer, 500);
      }
      // Re-enable roll and hold buttons
      setTimeout(function(){
        $('.btn-roll').prop('disabled', false);
        $('.btn-hold').prop('disabled', false);
      }, 500);
    });
  }
});

document.querySelector('.btn-hold').addEventListener('click', function() {
  if (gamePlaying) {
    // Add current round score to total
    scores[activePlayer] += roundScore;

    // Update UI for player score
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

    // Check if current player won
    if (scores[activePlayer] >= 100) {
      document.getElementById('name-' + activePlayer).textContent = 'WINNER!'
      $('.die').hide();
      // document.querySelector('.die').style.display = 'none';
      document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
      document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
      gamePlaying = false;
    } else {
      // Swap active player
      nextPlayer();
    }
  }
});

// Don't want init to be called immediately, tell event listener to call it
document.querySelector('.btn-new').addEventListener('click', init);