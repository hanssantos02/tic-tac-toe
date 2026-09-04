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
    return board.every(cell => cell !== ' ');
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

    if (gameState.isGameActive) {
        statusMessage.textContent = `Player ${gameState.currentPlayer}'s Turn`;
    }
}
