import React, { useState } from 'react';
import { 
  Paper, 
  TextField, 
  Box, 
  Autocomplete, 
  CircularProgress 
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SearchIcon from '@mui/icons-material/Search';
import { useLocationSearch } from '../hooks/useLocationSearch';

function RouteSelector({ onRouteCalculated, isLoading }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const { 
    suggestions: originSuggestions, 
    loading: originLoading 
  } = useLocationSearch(origin);
  
  const { 
    suggestions: destinationSuggestions, 
    loading: destinationLoading 
  } = useLocationSearch(destination);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOrigin && selectedDestination) {
      onRouteCalculated(selectedOrigin.display_name, selectedDestination.display_name);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Autocomplete
            value={selectedOrigin}
            onChange={(event, newValue) => {
              setSelectedOrigin(newValue);
            }}
            inputValue={origin}
            onInputChange={(event, newInputValue) => {
              setOrigin(newInputValue);
            }}
            options={originSuggestions}
            getOptionLabel={(option) => option.display_name}
            isOptionEqualToValue={(option, value) => option.place_id === value.place_id}
            loading={originLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Origin"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {originLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          
          <Autocomplete
            value={selectedDestination}
            onChange={(event, newValue) => {
              setSelectedDestination(newValue);
            }}
            inputValue={destination}
            onInputChange={(event, newInputValue) => {
              setDestination(newInputValue);
            }}
            options={destinationSuggestions}
            getOptionLabel={(option) => option.display_name}
            isOptionEqualToValue={(option, value) => option.place_id === value.place_id}
            loading={destinationLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Destination"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {destinationLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <LoadingButton
            loading={isLoading}
            loadingPosition="start"
            startIcon={<SearchIcon />}
            variant="contained"
            type="submit"
            fullWidth
            disabled={!selectedOrigin || !selectedDestination}
          >
            Calculate Route
          </LoadingButton>
        </Box>
      </form>
    </Paper>
  );
}

export default RouteSelector;