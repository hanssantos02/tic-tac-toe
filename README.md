# State-Driven Tic-Tac-Toe


A modern, accessible, and architecturally decoupled implementation of Tic-Tac-Toe built with vanilla JavaScript, semantic HTML5, and CSS Grid. 


Rather than relying on ad-hoc DOM manipulation, this project demonstrates **strategic software engineering principles**: Model-View-Controller (MVC) separation, unidirectional data flow, idempotent rendering, event delegation, and layout stability.


---


## Features


- **Custom Player Names:** Dynamic player name configuration with defensive input fallback.
- **Three-Phase Lifecycle:** Clean transition across **Lobby/Setup**, **Active Play**, and **Game Over** states.
- **Unidirectional Rendering:** The UI is a pure reflection of the underlying state machine.
- **Event Delegation:** High-performance single-listener architecture on the parent grid.
- **Zero Cumulative Layout Shift (CLS):** Fully stabilized CSS Grid and aspect-ratio locks to prevent jitter during gameplay.
- **Accessible & Responsive:** Semantic button elements, explicit ARIA roles, and `aria-live` announcements for screen readers.
- **Custom Result Modal:** Semi-transparent backdrop blur overlay displaying winners and tie states.


---


## Architectural Highlights


### 1. Pure Domain Logic (Agnostic Rules Engine)
The core game engine (`makeMove`, `checkWinner`, `isBoardFull`) consists entirely of **pure functions**. They possess zero dependencies on the DOM, terminal, or external variables:
- **Testable:** Can be unit tested in isolation without a browser environment.
- **Portable:** Can be reused in a Node.js CLI, a WebSocket backend, or a mobile wrapper without modifying a single line of code.


### 2. Stored State vs. Derived State
To eliminate state synchronization bugs, the application state stores only the minimal set of facts needed to reconstruct the universe:
```javascript
const gameState = {
  board: ['', '', '', '', '', '', '', '', ''],
  currentPlayer: 'X',
  isGameActive: false,
  hasStarted: false,
  players: { X: 'Player X', O: 'Player O' }
};
```
Game outcomes (winner determination, tie detection, and active turn messaging) are **derived dynamically** during the render cycle rather than stored redundantly in memory.


### 3. Idempotent View Layer (`render()`)
The application enforces a strict **Unidirectional Data Flow**:


```
[ User Interaction ] ──> [ Mutate State ] ──> [ render() ] ──> [ Synchronize DOM ]
```


Event listeners never touch inner text, styles, or classes directly. Instead, `render()` idempotently reconciles the DOM against `gameState`, ensuring that resetting the game, updating a turn, or displaying a win condition follows the exact same predictable code path.


### 4. Event Delegation & Semantic Contracts
Instead of attaching individual click listeners to all nine board buttons, a single click listener is bound to the parent container (`.board`). Move indices are resolved via explicit HTML5 data attributes (`data-cell-index`), establishing a resilient contract between the markup and JavaScript.


### 5. Layout Stability & Performance
Using explicit CSS Grid tracks with `minmax(0, 1fr)` and `aspect-ratio: 1 / 1`, cells hold rigid dimensions regardless of font metrics or state changes, eliminating **Cumulative Layout Shift (CLS)** when markers are placed.


---


## 📂 Project Structure


```text
├── index.html       # Semantic markup, ARIA roles, and layout contracts
├── style.css        # Responsive CSS Grid, custom properties, and modal styling
├── javascript.js        # Pure domain rules, state container, render engine, and controllers
└── README.md        # Architecture documentation and project specifications
```


---


## 🚀 Getting Started


### Prerequisites
No dependencies or package managers required. Runs natively in any modern web browser.


### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tic-tac-toe.git
   ```
2. Navigate to the project directory:
   ```bash
   cd tic-tac-toe
   ```
3. Open `index.html` in your browser:
   - On macOS:
     ```bash
     open index.html
     ```
   - On Linux:
     ```bash
     xdg-open index.html
     ```
   - On Windows:
     ```bash
     start index.html
     ```
   *(Or right-click `index.html` and select "Open with Live Server" in VS Code).*


---


## 🕹️ How to Play


1. Enter custom names for **Player X** and **Player O** in the setup inputs (defaults to "Player X" and "Player O" if left blank).
2. Click **Start Game** to unlock the board.
3. Players alternate turns selecting empty tiles.
4. The first player to align 3 consecutive marks horizontally, vertically, or diagonally wins.
5. If all 9 tiles are filled without a three-in-a-row alignment, a tie is declared.
6. Click **Play Again** in the result modal or **Restart Game** to reset the board.


---


## 🔮 Strategic Roadmap


- [ ] **Move History & Time Travel:** Introduce an undo/redo stack leveraging the idempotent render pipeline.
- [ ] **Asynchronous AI Opponent:** Implement an unbeatable single-player mode using the Minimax algorithm with simulated latency.
- [ ] **State Persistence:** Hydrate and persist session scores using `localStorage`.


---
