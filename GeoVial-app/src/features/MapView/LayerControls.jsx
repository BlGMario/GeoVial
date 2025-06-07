// src/features/MapView/LayerControls.jsx

import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Fullscreen, FullscreenExit, Map, Layers, PictureAsPdf } from '@mui/icons-material';
import { getExportUrlMap } from './GeoFetchDataUtil';
import BaseMapSwitcher from './BaseMapSwitcher'; 
import LayerTogglePanel from './LayerTogglePanel';

const LayerControls = ({ map, baseLayer, layerObjects, codRutaBuscado }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error(`Error al entrar a pantalla completa: ${err.message}`));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error(`Error al salir de pantalla completa: ${err.message}`));
    }
  };

  const handlePdfExport = async () => {
    if (!codRutaBuscado) {
      alert("Primero realiza una búsqueda de COD_RUTA.");
      return;
    }
    try {
      // Usa la utilidad centralizada
      const pdfUrl = await getExportUrlMap(codRutaBuscado, 'application/pdf');
      window.open(pdfUrl, '_blank');
    } catch (e) {
      alert("No se pudo generar el PDF para el COD_RUTA buscado.");
    }
  };

  return (
    <>
      {/* Usa el componente de cambio de mapa base */}
      <BaseMapSwitcher baseLayer={baseLayer} />

      <div
        id="zoom-control"
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '10px',
          zIndex: 1000,
        }}
      />

      <LayerTogglePanel layerObjects={layerObjects} />

      <Tooltip title="Exportar a PDF">
        <IconButton style={controlStyle(130)} color="primary" onClick={handlePdfExport}>
          <PictureAsPdf />
        </IconButton>
      </Tooltip>

      <Tooltip title="Pantalla completa">
        <IconButton style={controlStyle(190)} color="primary" onClick={toggleFullscreen}>
          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>
      </Tooltip>
    </>
  );
};

const controlStyle = (top) => ({
  position: 'absolute',
  left: 10,
  top,
  zIndex: 1000,
  backgroundColor: 'white',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  borderRadius: '50%',  
});

export default LayerControls;
