// src/features/MapView/LayerTogglePanel.jsx
import React, { useState } from 'react';
import { Box, IconButton, Paper, List, ListItem, ListItemText, Switch, Tooltip, ClickAwayListener } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import { wmsLayerDefinitions } from './useMapInit';
import { Padding } from '@mui/icons-material';

const LayerTogglePanel = ({ layerObjects = {} }) => {
  const [open, setOpen] = useState(false);
  const [visibility, setVisibility] = useState(() => {
    return Object.fromEntries(wmsLayerDefinitions.map(layer => [layer.name, true]));
  });

  const toggleVisibility = (layerName) => {
  const layer = layerObjects[layerName];
  if (layer) {
    const newVisible = !layer.getVisible();
    layer.setVisible(newVisible);
    setVisibility(prev => ({ ...prev, [layerName]: newVisible }));
  } else {
    console.warn(`Capa no encontrada: ${layerName}`);
  }
};

  return (
    <Box style={controlStyle(70)}>
      <Tooltip title="Capas">
        <IconButton color="primary" onClick={() => setOpen(o => !o)} style={{ backgroundColor: 'white' }}>
          <LayersIcon />
        </IconButton>
      </Tooltip>

      {open && (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper elevation={4} style={popupStyle}>
            <List dense>
              {wmsLayerDefinitions.map(layer => (
                <ListItem key={layer.name} disableGutters>
                  <ListItemText primary={layer.name.split(':')[1]}
                    primaryTypographyProps={{ fontSize: 12 }}
                    />
                  <Switch
                    size="small"
                    edge="end"
                    checked={visibility[layer.name]}
                    onChange={() => toggleVisibility(layer.name)}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </ClickAwayListener>
      )}
    </Box>
  );
};

const controlStyle = (top) => ({
  position: 'absolute',
  left: 10,
  top,
  zIndex: 1000,
});

const popupStyle = {
  position: 'absolute',
  top: 15,
  left: 50,
  backgroundColor: 'white',
  borderRadius: 6,
  width: 200,
  paddingLeft: '10px',
  paddingRight: '10px',
};

export default LayerTogglePanel;
