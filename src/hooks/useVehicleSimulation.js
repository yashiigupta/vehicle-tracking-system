import { useState, useEffect, useCallback } from 'react';

export function useVehicleSimulation(selectedRoute) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Initialize or update currentPosition when selectedRoute changes
  useEffect(() => {
    if (selectedRoute?.coordinates?.length > 0) {
      setCurrentPosition(selectedRoute.coordinates[0]);
    } else {
      setCurrentPosition(null);
    }
  }, [selectedRoute]);

  const updatePosition = useCallback(() => {
    if (!selectedRoute?.coordinates || !isPlaying) return;

    const coordinates = selectedRoute.coordinates;
    const index = Math.floor((progress / 100) * (coordinates.length - 1));
    setCurrentPosition(coordinates[index]);
  }, [selectedRoute, isPlaying, progress]);

  useEffect(() => {
    let intervalId;
    if (isPlaying && selectedRoute?.coordinates) {
      intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, selectedRoute]);

  useEffect(() => {
    updatePosition();
  }, [progress, updatePosition]);

  const handlePlayPause = () => {
    if (!selectedRoute?.coordinates) return;
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    if (!selectedRoute?.coordinates) return;
    setIsPlaying(false);
    setProgress(0);
    setCurrentPosition(selectedRoute.coordinates[0]);
  };

  const handleProgressChange = (newValue) => {
    if (!selectedRoute?.coordinates) return;
    setProgress(newValue);
  };

  return {
    currentPosition,
    isPlaying,
    progress,
    handlePlayPause,
    handleReset,
    handleProgressChange,
    setCurrentPosition,
    setProgress,
    setIsPlaying
  };
}