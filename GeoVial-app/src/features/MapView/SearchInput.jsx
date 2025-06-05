import React, { useState } from 'react';
import { TextField, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchInput = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      onSearch(searchTerm);
    }
  };

  return (
    <Paper elevation={3} style={{
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1000,
      padding: '4px 8px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="standard"
          placeholder="Buscar COD_RUTA"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton type="submit">
                <SearchIcon />
              </IconButton>
            )
          }}
        />
      </form>
    </Paper>
  );
};

export default SearchInput;
