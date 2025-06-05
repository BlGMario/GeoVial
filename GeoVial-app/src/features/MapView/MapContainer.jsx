// src/features/MapView/MapContainer.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';

import LayerControls from './LayerControls';
import useMapInit from './useMapInit';
import PopupInfo from './PopupInfo';
import Zoom from 'ol/control/Zoom';


const MapContainer = () => {
  const mapRef = useRef();
  const [mapInstance, setMapInstance] = useState(null);
  const [featureInfo, setFeatureInfo] = useState(null);
  const [layerObjects, setLayerObjects] = useState({});


  // Crear capa base controlada para cambiarla desde LayerControls
  const [baseLayer] = useState(() => new TileLayer({
    source: new OSM(),
  }));

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer],
      view: new View({
        center: fromLonLat([-74.0238, -8.5890]),
        zoom: 6,
      }),
      controls: [], // desactiva controles por defecto
    });

    //  control de zoom personalizado
    map.addControl(
      new Zoom({
        className: 'custom-zoom',
        zoomInLabel: '+',
        zoomOutLabel: '–',
        target: document.getElementById('zoom-control'),
      })
    );
    
    setMapInstance(map);
    return () => map.setTarget(undefined);
  }, [baseLayer]);


  useMapInit(mapInstance, setFeatureInfo, setLayerObjects);

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <div ref={mapRef} className="map" style={{ height: '100%' }}></div>
      <LayerControls map={mapInstance} baseLayer={baseLayer} layerObjects={layerObjects} />
      <PopupInfo map={mapInstance} featureInfo={featureInfo} />
    </div>
  );
};

export default MapContainer;
