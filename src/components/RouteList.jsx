import React from 'react';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { format } from 'date-fns';

function RouteList({ routes, onRouteSelect, selectedRoute }) {
  return (
    <Paper elevation={3} sx={{ p: 2, maxHeight: '500px', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Previous Trips
      </Typography>
      <List>
        {routes.map((route) => (
          <ListItem
            button
            key={route.id}
            onClick={() => onRouteSelect(route)}
            selected={selectedRoute?.id === route.id}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
              },
            }}
          >
            <ListItemText
              primary={route.name}
              secondary={format(new Date(route.date), 'PPP')}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default RouteList;