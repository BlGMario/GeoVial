import { useEffect } from 'react';
import { Tile as TileLayer } from 'ol/layer';
import TileWMS from 'ol/source/TileWMS';

const GeoServerApi = import.meta.env.VITE_GEOSERVER_API;

const wmsLayers = [
  { name: 'Jerarquizacion:LIM_PROVINCIAL', minZoom: 8 },
  { name: 'Jerarquizacion:DS011_2016_RVV_EJES', minZoom: 10 },
  { name: 'Jerarquizacion:RVD_ACTUAL_EJES' },
  { name: 'Jerarquizacion:RVN_ACTUAL_EJES' },
  { name: 'Jerarquizacion:RVD_ACTUAL_PUNTOS', minZoom: 11 },
  { name: 'Jerarquizacion:RVN_ACTUAL_PUNTOS', minZoom: 11 },
];

export default function useMapInit(map, setFeatureInfo) {
  useEffect(() => {
    if (!map) return;

    wmsLayers.forEach(({ name }) => {
      const layer = new TileLayer({
        source: new TileWMS({
          url: `${GeoServerApi}/Jerarquizacion/wms`,
          params: {
            LAYERS: name,
            TILED: true,
            FORMAT: 'image/png',
            TRANSPARENT: true,
          },
          serverType: 'geoserver',
          crossOrigin: 'anonymous',
        }),
      });
      map.addLayer(layer);
    });

    map.on('singleclick', async (evt) => {
      const url = `${GeoServerApi}/Jerarquizacion/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=Jerarquizacion:RVD_ACTUAL_EJES,Jerarquizacion:RVN_ACTUAL_EJES&QUERY_LAYERS=Jerarquizacion:RVD_ACTUAL_EJES,Jerarquizacion:RVN_ACTUAL_EJES&STYLES=&SRS=EPSG:4326&INFO_FORMAT=application/json&FEATURE_COUNT=10&WIDTH=101&HEIGHT=101&BBOX=${evt.coordinate[0] - 0.05},${evt.coordinate[1] - 0.05},${evt.coordinate[0] + 0.05},${evt.coordinate[1] + 0.05}&X=50&Y=50`;

      try {
        const res = await fetch(url);
        const json = await res.json();
        setFeatureInfo(json.features || []);
      } catch (err) {
        console.error('Error al obtener feature info', err);
      }
    });
  }, [map]);
}
