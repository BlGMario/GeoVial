import React, { useEffect, useState } from 'react';
import { Overlay } from 'ol';
import { toStringHDMS } from 'ol/coordinate';

const PopupInfo = ({ map, featureInfo }) => {
  const [popup, setPopup] = useState(null);
  const popupContainer = React.useRef(null);

  useEffect(() => {
    if (!map || !popupContainer.current) return;

    const overlay = new Overlay({
      element: popupContainer.current,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });

    map.addOverlay(overlay);
    setPopup(overlay);

    return () => map.removeOverlay(overlay);
  }, [map]);

  useEffect(() => {
    if (popup && featureInfo && featureInfo.length > 0) {
      const coords = featureInfo[0].geometry.coordinates[0][0];
      popup.setPosition(coords);
    }
  }, [popup, featureInfo]);

  return (
    <div ref={popupContainer} className="ol-popup" style={{
      position: 'absolute',
      backgroundColor: 'white',
      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      padding: '15px',
      borderRadius: '10px',
      minWidth: '200px'
    }}>
      {featureInfo?.length > 0 ? (
        <div>
          <strong>Información:</strong>
          <ul>
            {Object.entries(featureInfo[0].properties).map(([key, val]) => (
              <li key={key}><strong>{key}:</strong> {val}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default PopupInfo;
