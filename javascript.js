function playGame() {
    let board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    let currentPlayer = 'X';

    printBoard(board);

    while (true) {
        const answer = prompt(`Player ${currentPlayer}, enter a cell (0-8): `);

        if (answer === null) {
            console.log("Game Cancelled.");
            break;
        }

        const index = parseInt(answer, 10);

        if (isNaN(index)) {
            console.log("Please Enter a Number.");
            continue;
        }

        const moved = makeMove(board, index, currentPlayer);
        if (!moved) continue;

        printBoard(board);

        const winner = checkWinner(board);
        if (winner) {
            console.log(`Player ${winner} wins!`);
            break;
        }

        if (isBoardFull(board)) {
            console.log("It's a Tie!");
            break;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

playGame();



function printBoard(board) {
  console.log(`
 ${board[0]} | ${board[1]} | ${board[2]}
-----------
 ${board[3]} | ${board[4]} | ${board[5]}
-----------
 ${board[6]} | ${board[7]} | ${board[8]}
`);
}

function makeMove(board, index, player) {
    if (index < 0 || index > 8) {
        console.log("Invalid Move: Out of Range");
        return false;
    }
    if (board[index] !== ' ') {
        console.log("Invalid Move: Cell already taken");
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
