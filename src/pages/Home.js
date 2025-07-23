// src/pages/Home.js
import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, TextField, Typography, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { motion } from 'framer-motion'; // you may remove framer-motion import if not using animations elsewhere

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

  // On load: parse URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('board')) {
      const vals = params.get('board').split(',').map(s => s.trim());
      if (vals.length) setCellValues(vals);
    }
    if (params.has('grid')) setGridSize(Math.min(MAX_GRID, parseInt(params.get('grid'),10) || DEFAULT_GRID));
    if (params.has('cell')) setCellSize(Math.min(MAX_CELL, parseInt(params.get('cell'),10) || DEFAULT_CELL));
  }, []);

  // Reset arrays when grid changes
  useEffect(() => {
    setCellValues(Array(total).fill(''));
    setCrossed(Array(total).fill(false));
  }, [total]);

  // Toggle build/play, clearing crosses when leaving play
  const toggleMode = () => {
    if (!buildMode) setCrossed(Array(total).fill(false));
    setBuildMode(m => !m);
  };

  // Handle bulk paste
  const handleList = e => {
    const parts = e.target.value.split(',').map(s => s.trim());
    if (parts.length === total) setCellValues(parts);
  };

  // Drag & swap logic
  const onDragStart = (_, idx) => (dragSrc.current = idx);
  const onDragOver = e => e.preventDefault();
  const onDrop = (_, dest) => {
    if (dragSrc.current != null && dragSrc.current !== dest) {
      const swap = arr => {
        const a = [...arr];
        [a[dragSrc.current], a[dest]] = [a[dest], a[dragSrc.current]];
        return a;
      };
      setCellValues(swap);
      setCrossed(swap);
    }
    dragSrc.current = null;
  };

  // Toggle cross
  const toggleCross = idx => {
    setCrossed(a => {
      const c = [...a]; c[idx] = !c[idx]; return c;
    });
  };

  // Share URL
  

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
        {buildMode && null}
      </Box>

      {buildMode && (
        <Box mb={2} textAlign="center">
          <TextField
            label="Paste words"
            placeholder={`Enter ${total} words, comma-separated`}
            variant="outlined"
            size="small"
            fullWidth
            onChange={handleList}
          />
        </Box>
      )}

      <Box
        display="grid"
        gridTemplateColumns={`repeat(${gridSize}, ${isMobile ? '1fr' : cellSize + 'px'})`}
        gap={1}
        justifyContent="center"
      >
        {cellValues.map((val, idx) => (
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
        ))}
      </Box>
    </Box>
  );
}

export default Home;
