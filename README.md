# Bingo Editor

A lightweight, zero-dependency React app for building and playing custom Bingo cards.  
Built with Create React App and Material-UI.

---

## 🚀 Features

- **Build Mode**  
  - Define grid dimensions (1–7×1–7).  
  - Adjust cell size (1–400 px).  
  - Paste comma-separated words to auto-populate the board.  
  - Drag-and-swap cells to rearrange entries.  

- **Play Mode**  
  - Click a cell to “cross” it out (line-through + highlight).  
  - Crossings reset automatically when you return to Build Mode.  
  - Dynamic font sizing: text always fits its cell, shrinking only if necessary.  

- **Responsive Controls**  
  - Easy “+”/“–” steppers for grid & cell size.  
  - Inputs cap out at sensible defaults (max grid size = 7, max cell = 400 px).
---

### Installation
To run your project locally

1. **Clone the repo**  
   ```bash
   git clone https://github.com/davidsasc/bingo-editor.git
   cd bingo-editor

2. **Clone the repo**  
   ```bash
   yarn install
   yarn start
