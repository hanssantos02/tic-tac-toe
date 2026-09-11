const gameState = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    isGameActive: false,
    hasStarted: false,
    players: {
        X: 'Player X',
        O: 'Player O'
    }
};
const statusMessage = document.querySelector('.status-message');
const boardGrid = document.querySelector('.board');
const resetBtn = document.querySelector('.btn-reset');
const cells = document.querySelectorAll('.cell');
const playerXInput = document.querySelector('#player-x');
const playerOInput = document.querySelector('#player-o');
const primaryActionBtn = document.querySelector('#primary-action-btn');
const resultOverlay = document.querySelector('#result-overlay');
const resultBody = document.querySelector('#result-body');
const playAgainBtn = document.querySelector('#play-again-btn');

function makeMove(board, index, player) {
    if (index < 0 || index > 8 || board[index] !== '') {
        return false;
    }
    board[index] = player;
    return true;
}

function checkWinner(board) {
    const winningLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b, c] of winningLines) {
        if (board[a] !== ' ' && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function isBoardFull(board) {
    return board.every(cell => cell !== '');
}

function render() {
    resultOverlay.classList.add('hidden');
    playerXInput.disabled = gameState.isGameActive;
    playerOInput.disabled = gameState.isGameActive;
    cells.forEach((cell, index) => {
        const cellValue = gameState.board[index];
        cell.textContent = cellValue;

        cell.disabled = cellValue !== '' || !gameState.isGameActive;

        cell.classList.remove('x', 'o');
        if (cellValue !== '') {
            cell.classList.add(cellValue.toLowerCase());
        }
    });

    const winner = checkWinner(gameState.board);
    const tie = isBoardFull(gameState.board);

    primaryActionBtn.textContent = gameState.hasStarted ? 'Restart Game' : 'Start Game';

    if (!gameState.hasStarted) {
        statusMessage.textContent = 'Enter names and click Start';
    } 
    else if (winner) {
        resultBody.textContent = `${gameState.players[winner]} Wins!`;
        resultOverlay.classList.remove('hidden');
        statusMessage.textContent = 'Game Over';
    }
    else if (tie) {
        resultBody.textContent = "It's a Tie";
        resultOverlay.classList.remove('hidden');
        statusMessage.textContent = 'Game Over';
    }
    else {
        statusMessage.textContent = `${gameState.players[gameState.currentPlayer]}'s Turn (${gameState.currentPlayer});`
    }
}


boardGrid.addEventListener('click', (event) => {
    const button = event.target.closest('button');

    if (gameState.isGameActive && button && button.hasAttribute('data-cell-index')) {
        const cellIndex = parseInt(button.dataset.cellIndex);

        const success = makeMove(gameState.board, cellIndex, gameState.currentPlayer);
        if (!success) {
            return;
        }

        const winner = checkWinner(gameState.board);
        const tie = isBoardFull(gameState.board);
        if (winner || tie) {
            gameState.isGameActive = false;
        }
        else {
            gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        }
        
        render();
    }

});



function startOrRestartGame() {
    gameState.players.X = playerXInput.value.trim() || 'Player X';
    gameState.players.O = playerOInput.value.trim() || 'Plyaer O';

    gameState.board = ['', '', '', '', '', '', '', '', ''];
    gameState.currentPlayer = 'X';
    gameState.isGameActive = true;
    gameState.hasStarted = true;

    render();
}

primaryActionBtn.addEventListener('click', startOrRestartGame);
playAgainBtn.addEventListener('click', startOrRestartGame);

render();