// src/pages/Home.js
import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// Default values
const DEFAULT_GRID = 4;
const DEFAULT_CELL = 160;

// Maximum constraints
const MAX_GRID = 7;
const MAX_CELL = 400;

function Home() {
  // Dynamic grid and cell size
  const [buildMode, setBuildMode] = useState(true);
  const [gridSize, setGridSize] = useState(DEFAULT_GRID);
  const [cellSize, setCellSize] = useState(DEFAULT_CELL);

  // Derived total cells
  const totalCells = gridSize * gridSize;

  // Cell values and crossed state
  const [cellValues, setCellValues] = useState(Array(totalCells).fill(''));
  const [crossed, setCrossed] = useState(Array(totalCells).fill(false));

  // Reset when grid size changes
  useEffect(() => {
    setCellValues(Array(totalCells).fill(''));
    setCrossed(Array(totalCells).fill(false));
  }, [totalCells]);

  const dragSrcIndex = useRef(null);

  const handleBuildMode = () => {
    if (!buildMode) {
      setCrossed(Array(totalCells).fill(false));
    }
    setBuildMode(prev => !prev);
  };

  const handleListInput = e => {
    const parts = e.target.value.split(',').map(s => s.trim());
    if (parts.length === totalCells) setCellValues(parts);
  };

  const swapCells = (src, dest) => {
    setCellValues(vals => {
      const arr = [...vals];
      [arr[src], arr[dest]] = [arr[dest], arr[src]];
      return arr;
    });
    setCrossed(vals => {
      const arr = [...vals];
      [arr[src], arr[dest]] = [arr[dest], arr[src]];
      return arr;
    });
  };

  const onDragStart = (e, idx) => { dragSrcIndex.current = idx; };
  const onDragOver = e => e.preventDefault();
  const onDrop = (e, destIdx) => {
    e.preventDefault();
    if (dragSrcIndex.current !== null && dragSrcIndex.current !== destIdx) {
      swapCells(dragSrcIndex.current, destIdx);
    }
    dragSrcIndex.current = null;
  };

  const toggleCross = idx => {
    setCrossed(arr => {
      const copy = [...arr];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  return (
    <Box p={4}>
      <Typography variant="h4" align="center" mb={2}>
        {buildMode ? "Bingo Editor" : "Play your Bingo!"}
      </Typography>

      <Box textAlign="center" mb={3}>
        <IconButton onClick={handleBuildMode} color={buildMode ? 'default' : 'primary'}>
          {buildMode ? <PlayArrowIcon /> : <BuildIcon />}
        </IconButton>
      </Box>

      {buildMode && (
        <>
          {/* Controls for grid and cell size with stepper buttons */}
          <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton size="small" onClick={() => setGridSize(s => Math.max(1, s - 1))}>
                –
              </IconButton>
              <TextField
                label="Grid Size"
                type="number"
                size="small"
                inputProps={{ min: 1, max: MAX_GRID, readOnly: true }}
                value={gridSize}
                sx={{ width: 80, textAlign: 'center' }}
              />
              <IconButton size="small" onClick={() => setGridSize(s => Math.min(MAX_GRID, s + 1))}>
                +
              </IconButton>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton size="small" onClick={() => setCellSize(s => Math.max(1, s - 10))}>
                –
              </IconButton>
              <TextField
                label="Cell Size"
                type="number"
                size="small"
                inputProps={{ min: 1, max: MAX_CELL, readOnly: true }}
                value={cellSize}
                sx={{ width: 80, textAlign: 'center' }}
              />
              <IconButton size="small" onClick={() => setCellSize(s => Math.min(MAX_CELL, s + 10))}>
                +
              </IconButton>
            </Box>
          </Box>

          {/* Bulk input of words */}
          <Box mb={2} textAlign="center">
            <TextField
              label={`Paste ${totalCells} comma-separated words`}
              variant="outlined"
              size="small"
              fullWidth
              onChange={handleListInput}
              placeholder="one,two,three,..."
            />
          </Box>
        </>
      )}

      {/* Dynamic grid */}
      <Box
        display="grid"
        gridTemplateColumns={`repeat(${gridSize}, ${cellSize}px)`}
        gap={2}
        justifyContent="center"
      >
        {cellValues.map((val, idx) => {
          // Default font size 20% of cell
          const defaultFont = cellSize * 0.2;
          const threshold = Math.floor(cellSize / (defaultFont * 0.6));
          const fontSize = !buildMode && val.length > threshold
            ? cellSize / (val.length * 0.6)
            : defaultFont;

          return (
            <Box
              key={idx}
              width={cellSize}
              height={cellSize}
              display="flex"
              alignItems="center"
              justifyContent="center"
              border={1}
              borderColor={crossed[idx] ? 'primary.main' : 'grey.400'}
              bgcolor={crossed[idx] ? 'rgba(0, 0, 255, 0.1)' : 'transparent'}
              p={1}
              draggable={buildMode}
              onDragStart={buildMode ? e => onDragStart(e, idx) : undefined}
              onDragOver={buildMode ? onDragOver : undefined}
              onDrop={buildMode ? e => onDrop(e, idx) : undefined}
              onClick={!buildMode ? () => toggleCross(idx) : undefined}
              sx={{ cursor: buildMode ? 'move' : 'pointer', userSelect: buildMode ? 'auto' : 'none' }}
            >
              {buildMode ? (
                <TextField
                  value={val}
                  onChange={e => {
                    const copy = [...cellValues];
                    copy[idx] = e.target.value;
                    setCellValues(copy);
                  }}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              ) : (
                <Typography
                  align="center"
                  sx={{
                    textDecoration: crossed[idx] ? 'line-through' : 'none',
                    color: crossed[idx] ? 'grey.600' : 'inherit',
                    fontSize
                  }}
                >
                  {val}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default Home;
