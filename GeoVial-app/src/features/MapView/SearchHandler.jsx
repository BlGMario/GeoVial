// src/features/MapView/SearchHandler.jsx
import { fromLonLat } from 'ol/proj';
import { GeoJSON } from 'ol/format';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';

const GeoServerApi = import.meta.env.VITE_GEOSERVER_API;

export const searchByCodRuta = async (map, codRuta) => {
  const layerNames = [
    'Jerarquizacion:DS011_2016_RVN_EJES',
    'Jerarquizacion:DS011_2016_RVD_EJES',
    'Jerarquizacion:DS011_2016_RVV_EJES',
  ];

  try {
    for (const layerName of layerNames) {
      const url = `${GeoServerApi}/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=${layerName}&outputFormat=application/json&cql_filter=COD_RUTA='${codRuta}'`;
      const response = await fetch(url);
      const geojson = await response.json();

      if (geojson.features && geojson.features.length > 0) {
        const format = new GeoJSON();
        const features = format.readFeatures(geojson, {
          featureProjection: 'EPSG:3857',
        });

        const vectorSource = new VectorSource({ features });
        const vectorLayer = new VectorLayer({ source: vectorSource });

        map.addLayer(vectorLayer);

        const extent = vectorSource.getExtent();
        map.getView().fit(extent, { duration: 1000, padding: [50, 50, 50, 50] });

        return; // Solo usa la primera coincidencia encontrada
      }
    }

    alert("No se encontraron resultados para el código ingresado.");
  } catch (error) {
    console.error("Error al buscar COD_RUTA:", error);
    alert("Error al buscar. Consulta la consola para más información.");
  }
};
