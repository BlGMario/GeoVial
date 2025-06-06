// src/features/MapView/PdfExport.jsx
const GeoServerApi = import.meta.env.VITE_GEOSERVER_API;

// Calcula el BBOX de una MultiLineString
export function calculateBoundingBox(coordinates) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  coordinates.forEach(line => {
    line.forEach(([x, y]) => {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });
  });

  const margin = (maxX - minX) * 0.1;
  return [minX - margin, minY - margin, maxX + margin, maxY + margin];
}

export function getLayersForPrinting(layerName, tipo, codRuta) {
  const layers = ['Jerarquizacion:LIM_DEPARTAMENTAL'];
  const styles = [''];
  const filters = ['INCLUDE'];

  layers.push(layerName);
  styles.push('RESALTAR_EJE');
  filters.push(`COD_RUTA='${codRuta}'`);

  layers.push(layerName);
  styles.push('');
  filters.push('INCLUDE');

  if (layerName === 'Jerarquizacion:DS011_2016_RVN_EJES') {
    layers.push('Jerarquizacion:DS011_2016_RVD_EJES', 'Jerarquizacion:RVN_ACTUAL_PUNTOS');
    styles.push('', '');
    filters.push('INCLUDE', `cod_ruta='${codRuta}'`);
  }

  return {
    layers: layers.join(','),
    styles: styles.join(','),
    filters: filters.join(';'),
  };
}

export function generatePdfUrl(bboxArray, layersData) {
  const [minX, minY, maxX, maxY] = bboxArray;
  const bbox = [minX, minY, maxX, maxY].join(',');

  const { layers, styles, filters } = layersData;
  const outputWidth = 1122;
  const outputHeight = 794;

  return `${GeoServerApi}/Jerarquizacion/wms?service=WMS&version=1.1.0&request=GetMap&layers=${layers}&bbox=${bbox}&width=${outputWidth}&height=${outputHeight}&srs=EPSG:4326&styles=${styles}&CQL_FILTER=${filters}&format=application/pdf`;
}
