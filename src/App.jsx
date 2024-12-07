import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Alert, Snackbar } from '@mui/material';
import Map from './components/Map';
import RouteList from './components/RouteList';
import SimulationControls from './components/SimulationControls';
import RouteSelector from './components/RouteSelector';
import { useVehicleSimulation } from './hooks/useVehicleSimulation';
import { calculateRoute } from './services/routingService';


function App() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    currentPosition,
    isPlaying,
    progress,
    handlePlayPause,
    handleReset,
    handleProgressChange,
    setCurrentPosition,
    setProgress,
    setIsPlaying
  } = useVehicleSimulation(selectedRoute);

  const handleRouteCalculation = async (origin, destination) => {
    try {
      setIsLoading(true);
      setError(null);
      const newRoute = await calculateRoute(origin, destination);
      setRoutes(prevRoutes => [...prevRoutes, newRoute]);
      setSelectedRoute(newRoute);
      setCurrentPosition(newRoute.coordinates[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setIsPlaying(false);
    setProgress(0);
    setCurrentPosition(route.coordinates[0]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Vehicle Tracking System
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <RouteSelector 
            onRouteCalculated={handleRouteCalculation}
            isLoading={isLoading}
          />
          <Paper elevation={3} sx={{ p: 2 }}>
            <Map route={selectedRoute} currentPosition={currentPosition} />
            {selectedRoute && (
              <SimulationControls
                isPlaying={isPlaying}
                progress={progress}
                onPlayPause={handlePlayPause}
                onReset={handleReset}
                onProgressChange={handleProgressChange}
              />
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <RouteList
            routes={routes}
            onRouteSelect={handleRouteSelect}
            selectedRoute={selectedRoute}
          />
        </Grid>
      </Grid>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;