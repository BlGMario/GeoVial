import React, { useRef, useState, useEffect } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';

import LayerControls from './LayerControls';
import useMapInit from './useMapInit';
import PopupInfo from './PopupInfo';

const MapContainer = () => {
  const mapRef = useRef();
  const [mapInstance, setMapInstance] = useState(null);
  const [featureInfo, setFeatureInfo] = useState(null);

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-74.0238, -8.5890]),
        zoom: 6,
      }),
    });

    setMapInstance(map);
    return () => map.setTarget(undefined);
  }, []);

  useMapInit(mapInstance, setFeatureInfo);

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <div ref={mapRef} className="map" style={{ height: '100%' }}></div>
      <LayerControls map={mapInstance} />
      <PopupInfo map={mapInstance} featureInfo={featureInfo} />
    </div>
  );
};

export default MapContainer;
