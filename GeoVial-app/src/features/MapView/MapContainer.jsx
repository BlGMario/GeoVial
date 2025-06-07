// src/features/MapView/MapContainer.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import { transformExtent } from 'ol/proj';

import LayerControls from './LayerControls';
import useMapInit from './useMapInit';
import PopupInfo from './PopupInfo';
import Zoom from 'ol/control/Zoom';
import SearchInput from './SearchInput';


const MapContainer = () => {
  const mapRef = useRef();
  const [mapInstance, setMapInstance] = useState(null);
  const [featureInfo, setFeatureInfo] = useState(null);
  const [layerObjects, setLayerObjects] = useState({});
  const [codRutaBuscado, setCodRutaBuscado] = useState(null); // <-- nuevo estado


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

  // Nueva función para búsqueda
  const handleSearch = async (codRuta) => {
    setCodRutaBuscado(codRuta); // Guarda el valor buscado
    if (!mapInstance) return;

    const layers = [
      'Jerarquizacion:DS011_2016_RVV_EJES',
      'Jerarquizacion:DS011_2016_RVD_EJES',
      'Jerarquizacion:DS011_2016_RVN_EJES'
    ];

    for (const layer of layers) {
      const url = `${import.meta.env.VITE_GEOSERVER_API}/Jerarquizacion/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=${layer}&outputFormat=application/json&CQL_FILTER=COD_RUTA='${codRuta}'`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        if (json.features && json.features.length > 0) {
          const feature = json.features[0];
          const coords = feature.geometry.coordinates;
          let extent;
          if (feature.geometry.type === 'LineString') {
            extent = coords.reduce(
              (acc, [x, y]) => [
                Math.min(acc[0], x),
                Math.min(acc[1], y),
                Math.max(acc[2], x),
                Math.max(acc[3], y)
              ],
              [coords[0][0], coords[0][1], coords[0][0], coords[0][1]]
            );
          } else if (feature.geometry.type === 'MultiLineString') {
            extent = coords.flat().reduce(
              (acc, [x, y]) => [
                Math.min(acc[0], x),
                Math.min(acc[1], y),
                Math.max(acc[2], x),
                Math.max(acc[3], y)
              ],
              [coords[0][0][0], coords[0][0][1], coords[0][0][0], coords[0][0][1]]
            );
          }
          if (extent) {
            // TRANSFORMAR EL EXTENT DE 4326 A 3857
            const extent3857 = transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
            mapInstance.getView().fit(extent3857, { duration: 1000, maxZoom: 15 });
          }
          return; // Detener búsqueda si ya encontró
        }
      } catch (e) {
        // Silenciar error, continuar con la siguiente capa
      }
    }
    alert('No se encontró el COD_RUTA en las capas.');
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <SearchInput onSearch={handleSearch} />
      <div ref={mapRef} className="map" style={{ height: '100%' }}></div>
      <LayerControls
        map={mapInstance}
        baseLayer={baseLayer}
        layerObjects={layerObjects}
        codRutaBuscado={codRutaBuscado} // <-- pásalo aquí
      />
      <PopupInfo map={mapInstance} featureInfo={featureInfo} />
    </div>
  );
};

export default MapContainer;
