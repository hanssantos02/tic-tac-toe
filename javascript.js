const gameState = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    isGameActive: true
};
const statusMessage = document.querySelector('.status-message');
const boardGrid = document.querySelector('.board');
const resetBtn = document.querySelector('.btn-reset');
const cells = document.querySelectorAll('.cell');


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

    if (winner) {
        statusMessage.textContent = `Player ${winner} wins!`;
    }
    else if (tie) {
        statusMessage.textContent = "It's a tie!";
    }
    else {
        statusMessage.textContent = `Player ${gameState.currentPlayer}'s Turn`;
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

function resetGame() {
    gameState.board = ['', '', '', '', '', '', '', '', ''];
    gameState.currentPlayer = 'X';
    gameState.isGameActive = true;

    render();
}

resetBtn.addEventListener('click', resetGame);