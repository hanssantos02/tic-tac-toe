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
const statusMessage = document.querySelector('#status-message');
const boardGrid = document.querySelector('#board');
const cells = document.querySelectorAll('.cell');
const playerXInput = document.querySelector('#player-x');
const playerOInput = document.querySelector('#player-o');
const cardX = document.querySelector('#card-x');
const cardO = document.querySelector('#card-o');
const primaryActionBtn = document.querySelector('#primary-action-btn');
const resultOverlay = document.querySelector('#result-overlay');
const resultTitle = document.querySelector('#result-title');
const resultBody = document.querySelector('#result-body');
const playAgainBtn = document.querySelector('#play-again-btn');

const MARK_SVG = {
    X: '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><line x1="30" y1="30" x2="70" y2="70" pathLength="100" class="draw"/><line x1="70" y1="30" x2="30" y2="70" pathLength="100" class="draw" style="animation-delay:.1s"/></svg>',
    O: '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="50" r="30" pathLength="100" class="draw"/></svg>'
};

function makeMove(board, index, player) {
    if (index < 0 || index > 8 || board[index] !== '') {
        return false;
    }
    board[index] = player;
    return true;
}

const WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function getWinnerAndLine(board) {
    for (const line of WINNING_LINES) {
        const [a, b, c] = line;
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line };
        }
    }
    return { winner: null, line: [] };
}

function checkWinner(board) {
    return getWinnerAndLine(board).winner;
}

function isBoardFull(board) {
    return board.every(cell => cell !== '');
}

function render() {
    resultOverlay.classList.add('hidden');
    playerXInput.disabled = gameState.isGameActive;
    playerOInput.disabled = gameState.isGameActive;

    const { winner, line } = getWinnerAndLine(gameState.board);
    const tie = !winner && isBoardFull(gameState.board);
    const gameOver = Boolean(winner || tie);

    boardGrid.classList.toggle('has-win', Boolean(winner));

    cells.forEach((cell, index) => {
        const cellValue = gameState.board[index];
        cell.innerHTML = cellValue ? MARK_SVG[cellValue] : '';

        cell.disabled = cellValue !== '' || !gameState.isGameActive;

        cell.classList.remove('x', 'o', 'win');
        if (cellValue !== '') {
            cell.classList.add(cellValue.toLowerCase());
        }
        if (winner && line.includes(index)) {
            cell.classList.add('win');
        }
        cell.setAttribute('aria-label', `Cell ${index + 1}, ${cellValue || 'empty'}`);
    });

    cardX.classList.toggle('active', gameState.isGameActive && !gameOver && gameState.currentPlayer === 'X');
    cardO.classList.toggle('active', gameState.isGameActive && !gameOver && gameState.currentPlayer === 'O');

    primaryActionBtn.textContent = gameState.hasStarted ? 'Restart Game' : 'Start Game';

    if (!gameState.hasStarted) {
        statusMessage.textContent = 'Enter names and press Start.';
        statusMessage.dataset.turn = 'idle';
    }
    else if (winner) {
        resultTitle.textContent = `${gameState.players[winner]} takes it`;
        resultBody.textContent = winner === 'X' ? 'Three in a row — nicely played.' : 'Three in a row — beautifully done.';
        resultOverlay.classList.remove('hidden');
        statusMessage.textContent = 'That is the game — restart to play again';
        statusMessage.dataset.turn = 'done';
    }
    else if (tie) {
        resultTitle.textContent = 'A quiet draw';
        resultBody.textContent = 'No winner this time — board is full.';
        resultOverlay.classList.remove('hidden');
        statusMessage.textContent = 'That is the game — restart to play again';
        statusMessage.dataset.turn = 'done';
    }
    else {
        statusMessage.textContent = `${gameState.players[gameState.currentPlayer]}'s turn (${gameState.currentPlayer})`;
        statusMessage.dataset.turn = gameState.currentPlayer;
    }
}


boardGrid.addEventListener('click', (event) => {
    const button = event.target.closest('button');

    if (gameState.isGameActive && button && button.hasAttribute('data-cell-index')) {
        const cellIndex = parseInt(button.dataset.cellIndex, 10);

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
    gameState.players.O = playerOInput.value.trim() || 'Player O';

    gameState.board = ['', '', '', '', '', '', '', '', ''];
    gameState.currentPlayer = 'X';
    gameState.isGameActive = true;
    gameState.hasStarted = true;

    render();
}

primaryActionBtn.addEventListener('click', startOrRestartGame);
playAgainBtn.addEventListener('click', startOrRestartGame);

render();
