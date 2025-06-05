// src/features/MapView/BaseMapSwitcher.jsx
import React, { useState } from 'react';
import { Box, IconButton, Paper, List, ListItemButton, ListItemText, Tooltip, ClickAwayListener } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import XYZ from 'ol/source/XYZ';

const BASEMAPS = {
  OSM: {
    label: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  CARTO: {
    label: 'CartoDB Positron',
    url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  },
  ESRI_SAT: {
    label: 'Esri Satélite',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
};


const BaseMapSwitcher = ({ baseLayer }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('OSM');

  const toggleMenu = () => setOpen(prev => !prev);
  const closeMenu = () => setOpen(false);

  const handleBasemapChange = (key) => {
    setSelected(key);
    setOpen(false);
    baseLayer.setSource(new XYZ({ url: BASEMAPS[key].url, crossOrigin: 'anonymous' }));
  };

  return (
    <Box style={controlStyle(10)}>
      <Tooltip title="Mapa base">
        <IconButton color="primary" onClick={toggleMenu} style={{ backgroundColor: 'white' }}>
          <MapIcon />
        </IconButton>
      </Tooltip>

      {open && (
        <ClickAwayListener onClickAway={closeMenu}>
          <Paper elevation={4} style={popupStyle}>
            <List dense>
              {Object.entries(BASEMAPS).map(([key, { label }]) => (
                <ListItemButton
                  key={key}
                  selected={key === selected}
                  onClick={() => handleBasemapChange(key)}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
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
  top:15,
  left: 50,
  backgroundColor: 'white',
  borderRadius: 6,
  width: 180,
};

export default BaseMapSwitcher;
