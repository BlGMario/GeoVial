const GeoServerApi = import.meta.env.VITE_GEOSERVER_API;

// Función interna para obtener información del feature basado en cod_ruta
async function fetchFeatureInfo(cod_ruta) {
    const layerNames = [
        'Jerarquizacion:DS011_2016_RVN_EJES',
        'Jerarquizacion:DS011_2016_RVD_EJES',
        'Jerarquizacion:DS011_2016_RVV_EJES'
    ];

    const responses = await Promise.all(layerNames.map(layerName =>
        fetch(`${GeoServerApi}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=${layerName}&outputFormat=application/json&cql_filter=COD_RUTA='${encodeURIComponent(cod_ruta)}'`)
            .then(response => response.json())
            .then(data => data.features.length > 0 ? { layerName, feature: data.features[0] } : null)
    ));

    return responses.filter(response => response !== null)[0]; // Devuelve la primera respuesta válida
}

// Función interna para calcular el BoundingBox
function calculateBoundingBox(coordinates) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  coordinates.forEach(line => {
      line.forEach(([x, y]) => {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
      });
  });
  
  // Calcula el centro y la extensión del BoundingBox original
  const width = maxX - minX;
  const height = maxY - minY;
  const centerX = minX + width / 2;
  const centerY = minY + height / 2;
  
  // Determina las nuevas dimensiones ajustadas a la relación 4:3
  let adjustedWidth, adjustedHeight;
  if (width / height > 4 / 3) {
      // Mantén el ancho y ajusta la altura
      adjustedWidth = width;
      adjustedHeight = width * (3 / 4);
  } else {
      // Mantén la altura y ajusta el ancho
      adjustedHeight = height;
      adjustedWidth = height * (4 / 3);
  }

  // Agregar margen adicional
  const margin = 0.2; // Unidad adicional de margen en cada lado
  adjustedWidth += 0.2* margin; // Añade margen a cada lado del ancho
  adjustedHeight += 0.2 * margin; // Añade margen a cada lado de la altura

  // Calcula el nuevo BoundingBox ajustado
  minX = centerX - adjustedWidth / 2;
  maxX = centerX + adjustedWidth / 2;
  minY = centerY - adjustedHeight / 2;
  maxY = centerY + adjustedHeight / 2;

  return [minX, minY, maxX, maxY].join(',');
}



// Función principal que exportaremos y que maneja todo el proceso
export async function getExportUrlMap(cod_ruta, format = 'image/svg+xml') {
  const featureInfo = await fetchFeatureInfo(cod_ruta);
  if (featureInfo && featureInfo.feature.geometry) {
      const bbox = calculateBoundingBox(featureInfo.feature.geometry.coordinates);
      const layerData = getLayersForPrinting(featureInfo.layerName, featureInfo.feature.properties.tipo, cod_ruta);
      const { layers, styles, filters } = layerData;
      
      // Ajusta estas dimensiones según la resolución deseada y el tamaño de papel
      const width = 1122;  // Ancho en pixeles para un output de 300 dpi en tamaño estándar
      const height = 794;  // Altura en pixeles para un output de 300 dpi en tamaño estándar

      const url = `${GeoServerApi}/wms?service=WMS&version=1.1.0&request=GetMap&layers=${layers}&bbox=${bbox}&width=${width}&height=${height}&srs=EPSG:4326&styles=${styles}&CQL_FILTER=${filters}&format=${format}`;
      console.log(cod_ruta + ` = ${url}`);
      return url;
  } else {
      throw new Error("Feature not found for the provided cod_ruta.");
  }
}


// Utilidad para decidir qué capas incluir en la impresión
function getLayersForPrinting(selectedLayerName, tipo_eje, COD_RUTA) {
  // Capa base siempre presente
  const layersToInclude = ['Jerarquizacion:LIM_DEPARTAMENTAL'];
  const styles = [''];
  const filters = ['INCLUDE'];

  // Capa principal con estilo RESALTAR_EJE y filtro
  layersToInclude.push(selectedLayerName);
  styles.push('RESALTAR_EJE');
  filters.push(`COD_RUTA='${COD_RUTA}'`);

  // Capa principal sin estilo ni filtro (para contexto)
  layersToInclude.push(selectedLayerName);
  styles.push('');
  filters.push('INCLUDE');

  // Capas de contexto según la capa principal
  switch (selectedLayerName) {
    case 'Jerarquizacion:DS011_2016_RVN_EJES':
      layersToInclude.push('Jerarquizacion:DS011_2016_RVD_EJES');
      styles.push('');
      filters.push('INCLUDE');
      break;
    case 'Jerarquizacion:DS011_2016_RVD_EJES':
      layersToInclude.push(
        'Jerarquizacion:LIM_DEPARTAMENTAL_SINCOLOR',
        'Jerarquizacion:LIM_PROVINCIAL',
        'Jerarquizacion:DS011_2016_RVV_EJES',
        'Jerarquizacion:DS011_2016_RVN_EJES'
      );
      styles.push('', '', '', '');
      filters.push('INCLUDE', 'INCLUDE', 'INCLUDE', 'INCLUDE');
      break;
    case 'Jerarquizacion:DS011_2016_RVV_EJES':
      layersToInclude.push(
        'Jerarquizacion:LIM_DEPARTAMENTAL_SINCOLOR',
        'Jerarquizacion:LIM_DISTRITAL',
        'Jerarquizacion:DS011_2016_RVN_EJES',
        'Jerarquizacion:DS011_2016_RVD_EJES'
      );
      styles.push('', '', '', '');
      filters.push('INCLUDE', 'INCLUDE', 'INCLUDE', 'INCLUDE');
      break;
    default:
      // Si no es ninguna de las principales, solo imprime la base y la principal
      break;
  }

  return {
    layers: layersToInclude.join(','),
    styles: styles.join(','),
    filters: filters.join(';'),
  };
}

