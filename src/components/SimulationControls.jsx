import React from 'react';
import { Box, Slider, Button, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

function SimulationControls({ 
  isPlaying, 
  progress, 
  onPlayPause, 
  onReset, 
  onProgressChange 
}) {
  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, mt: 2 }}>
      <Typography gutterBottom>
        Simulation Controls
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={onPlayPause}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={onReset}
        >
          Reset
        </Button>
      </Box>
      <Slider
        value={progress}
        onChange={(_, newValue) => onProgressChange(newValue)}
        min={0}
        max={100}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value}%`}
      />
    </Box>
  );
}

export default SimulationControls;