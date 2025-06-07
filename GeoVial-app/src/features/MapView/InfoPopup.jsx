import React from 'react';
import { Paper, Table, TableBody, TableCell, TableRow, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const InfoPopup = ({ open, coord, data, onClose }) => {
  if (!open || !data) return null;

  return (
    <Paper style={{
      position: 'absolute',
      left: 40,
      top: 40,
      zIndex: 2000,
      minWidth: 320,
      padding: 16
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Detalle COD_RUTA</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </div>
      {data.error ? (
        <Typography color="error">{data.error}</Typography>
      ) : (
        <Table size="small">
          <TableBody>
            {Object.entries(data).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell style={{ fontWeight: 'bold' }}>{key}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};

export default InfoPopup;