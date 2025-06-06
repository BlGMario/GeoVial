// src/features/MapView/LayerControls.jsx

import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Fullscreen, FullscreenExit, Map, Layers, PictureAsPdf } from '@mui/icons-material';
import { generatePdfUrl, getLayersForPrinting, calculateBoundingBox } from './PdfExport';
import BaseMapSwitcher from './BaseMapSwitcher'; 
import LayerTogglePanel from './LayerTogglePanel';

const LayerControls = ({ map, baseLayer,layerObjects }) => {
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

  const handlePdfExport = () => {
    if (!map) return;

    const features = map.getLayers()
      .getArray()
      .filter(l => l.getSource && l.getSource().getFeatures)
      .flatMap(l => l.getSource().getFeatures())
      .filter(f => f.getGeometry && f.getGeometry().getType() === 'MultiLineString');

    if (features.length === 0) {
      alert("No hay una geometría válida seleccionada.");
      return;
    }

    const feature = features[0];
    const geometry = feature.getGeometry().getCoordinates();
    const codRuta = feature.get('COD_RUTA') || 'N/A';
    const tipo = feature.get('tipo') || 'N/A';
    const capa = feature.getId()?.split('.')[0] || 'DS011_2016_RVN_EJES';

    const bbox = calculateBoundingBox(geometry);
    const layerData = getLayersForPrinting(`Jerarquizacion:${capa}`, tipo, codRuta);
    const pdfUrl = generatePdfUrl(bbox, layerData);

    window.open(pdfUrl, '_blank');
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
