// src/pages/Home.js
import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, TextField, Typography, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { motion } from 'framer-motion';

// Defaults & constraints
const DEFAULT_GRID = 4;
const DEFAULT_CELL = 160;
const MAX_GRID = 7;
const MAX_CELL = 400;

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Modes & sizes
  const [buildMode, setBuildMode] = useState(true);
  const [gridSize, setGridSize] = useState(DEFAULT_GRID);
  const [cellSize, setCellSize] = useState(DEFAULT_CELL);

  // State arrays
  const total = gridSize * gridSize;
  const [cellValues, setCellValues] = useState(Array(total).fill(''));
  const [crossed, setCrossed] = useState(Array(total).fill(false));

  // Drag index
  const dragSrc = useRef(null);

  // Reset when grid changes
  useEffect(() => {
    setCellValues(Array(total).fill(''));
    setCrossed(Array(total).fill(false));
  }, [total]);

  // Toggle build/play, clear crosses when leaving play
  const toggleMode = () => {
    if (!buildMode) setCrossed(Array(total).fill(false));
    setBuildMode(m => !m);
  };

  // Bulk paste handler
  const handleList = e => {
    const parts = e.target.value.split(',').map(s => s.trim());
    if (parts.length === total) setCellValues(parts);
  };

  // Swap two cells
  const swapCells = (src, dest) => {
    setCellValues(vals => {
      const a = [...vals];
      [a[src], a[dest]] = [a[dest], a[src]];
      return a;
    });
    setCrossed(vals => {
      const a = [...vals];
      [a[src], a[dest]] = [a[dest], a[src]];
      return a;
    });
  };

  // Drag & drop handlers
  const onDragStart = (_, idx) => (dragSrc.current = idx);
  const onDragOver = e => e.preventDefault();
  const onDrop = (e, dest) => {
    e.preventDefault();
    const src = dragSrc.current;
    if (src !== null && src !== dest) swapCells(src, dest);
    dragSrc.current = null;
  };

  // Toggle cross state
  const toggleCross = idx => {
    setCrossed(arr => {
      const a = [...arr];
      a[idx] = !a[idx];
      return a;
    });
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" mb={2}>
        {buildMode ? 'Bingo Editor' : 'Play Your Bingo!'}
      </Typography>

      <Box textAlign="center" mb={2}>
        <Tooltip title={buildMode ? 'Switch to Play Mode' : 'Switch to Build Mode'}>
          <IconButton onClick={toggleMode} color={buildMode ? 'default' : 'primary'}>
            {buildMode ? <PlayArrowIcon /> : <BuildIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {buildMode && (
        <>
          {/* Controls for grid and cell size */}
          <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
            <Tooltip title="Decrease grid size">
              <IconButton size="small" onClick={() => setGridSize(s => Math.max(1, s - 1))}>
                –
              </IconButton>
            </Tooltip>
            <TextField
              label="Grid Size"
              type="number"
              size="small"
              inputProps={{ min: 1, max: MAX_GRID, readOnly: true }}
              value={gridSize}
              sx={{ width: 80, textAlign: 'center' }}
            />
            <Tooltip title="Increase grid size">
              <IconButton size="small" onClick={() => setGridSize(s => Math.min(MAX_GRID, s + 1))}>
                +
              </IconButton>
            </Tooltip>

            <Tooltip title="Decrease cell size">
              <IconButton size="small" onClick={() => setCellSize(s => Math.max(1, s - 10))}>
                –
              </IconButton>
            </Tooltip>
            <TextField
              label="Cell Size"
              type="number"
              size="small"
              inputProps={{ min: 1, max: MAX_CELL, readOnly: true }}
              value={cellSize}
              sx={{ width: 80, textAlign: 'center' }}
            />
            <Tooltip title="Increase cell size">
              <IconButton size="small" onClick={() => setCellSize(s => Math.min(MAX_CELL, s + 10))}>
                +
              </IconButton>
            </Tooltip>
          </Box>

          {/* Bulk input of words */}
          <Box mb={2} textAlign="center">
            <TextField
              label={`Paste ${total} comma-separated words`}
              placeholder={`Enter ${total} words, comma-separated`}
              variant="outlined"
              size="small"
              fullWidth
              onChange={handleList}
            />
          </Box>
        </>
      )}

      {/* Dynamic grid */}
      <Box
        display="grid"
        gridTemplateColumns={`repeat(${gridSize}, ${isMobile ? '1fr' : cellSize + 'px'})`}
        gap={1}
        justifyContent="center"
      >
        {cellValues.map((val, idx) => {
          return (
            <Box
              component={motion.div}
              layout
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              key={idx}
              width={isMobile ? '100%' : cellSize}
              height={cellSize}
              display="flex"
              alignItems="center"
              justifyContent="center"
              border={1}
              borderColor={crossed[idx] ? 'primary.main' : 'grey.400'}
              bgcolor={crossed[idx] ? 'rgba(0,0,255,0.1)' : 'transparent'}
              p={1}
              draggable={buildMode}
              onDragStart={buildMode ? e => onDragStart(e, idx) : undefined}
              onDragOver={buildMode ? onDragOver : undefined}
              onDrop={buildMode ? e => onDrop(e, idx) : undefined}
              onClick={!buildMode ? () => toggleCross(idx) : undefined}
              sx={{
                cursor: buildMode ? 'move' : 'pointer',
                userSelect: buildMode ? 'text' : 'none',
                '&:hover': { boxShadow: 3 },
                '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' }
              }}
            >
              {buildMode ? (
                <TextField
                  value={val}
                  onChange={e => {
                    const c = [...cellValues]; c[idx] = e.target.value; setCellValues(c);
                  }}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              ) : (
                <Typography
                  align="center"
                  sx={{ textDecoration: crossed[idx] ? 'line-through' : 'none', fontSize: cellSize * 0.2 }}
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
