import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


function NasaImagesVideoDialog() {
const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState(false);
  const [mediaFilters, setMediaFilters] = useState({
    image: false,
    video: false,
    audio: false,
  });
  const [results, setResults] = useState({
    image: [],
    video: [],
    audio: [],
  });
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError(true);
      return;
    }

    setSearchError(false);

    let types = Object.keys(mediaFilters).filter((type) => mediaFilters[type]);

    if (types.length === 0) {
      types = ['image', 'video', 'audio'];
      setMediaFilters({
        image: true,
        video: true,
        audio: true,
      });
    }

    try {
      const res = await axios.get(`https://images-api.nasa.gov/search`, {
        params: {
          q: searchQuery,
          media_type: types.join(','),
        },
      });

      const grouped = { image: [], video: [], audio: [] };
      res.data.collection.items.forEach((item) => {
        const type = item.data[0].media_type;
        if (grouped[type]) {
          grouped[type].push(item);
        }
      });

      setResults(grouped);
    } catch (err) {
      console.error('Error fetching NASA data:', err);
    }
  };

  const handleCheckboxChange = (type) => {
    setMediaFilters((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleOpen = (item) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  const renderGrid = (items) => {
    if (items.length === 0) {
      return (
        <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
          Not Data Found
        </Typography>
      );
    }

    return (
      <Grid container spacing={2} justifyContent="center">
        {items.map((item) => {
          const data = item.data[0];
          const link = item.links ? item.links[0].href : '';
          return (
            <Grid item xs={12} sm={6} md={2.4} key={data.nasa_id}>
              <Box
                onClick={() => handleOpen(item)}
                sx={{
                  width: '100%',
                  height: 180,
                  borderRadius: 2,
                  boxShadow: 3,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {link && (
                  <Box
                    component="img"
                    src={link}
                    alt={data.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        NASA Image, Video & Audio Library
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, width: '60%' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search NASA Library"
          value={searchQuery}
          error={searchError}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (searchError) setSearchError(false);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <FormGroup row sx={{ mb: 4 }}>
        {['image', 'video', 'audio'].map((type) => (
          <FormControlLabel
            key={type}
            control={
              <Checkbox
                checked={mediaFilters[type]}
                disabled={!searchQuery.trim()}
                onChange={() => handleCheckboxChange(type)}
              />
            }
            label={type.charAt(0).toUpperCase() + type.slice(1)}
          />
        ))}
      </FormGroup>

      {mediaFilters.image && (
        <>
          <Typography variant="h5" mt={4} mb={1}>
            Images
          </Typography>
          <Divider sx={{ mb: 2, width: '100%' }} />
          {renderGrid(results.image)}
        </>
      )}

      {mediaFilters.video && (
        <>
          <Typography variant="h5" mt={4} mb={1}>
            Videos
          </Typography>
          <Divider sx={{ mb: 2, width: '100%' }} />
          {renderGrid(results.video)}
        </>
      )}

      {mediaFilters.audio && (
        <>
          <Typography variant="h5" mt={4} mb={1}>
            Audio
          </Typography>
          <Divider sx={{ mb: 2, width: '100%' }} />
          {renderGrid(results.audio)}
        </>
      )}

      {selectedItem && (
        <Dialog open onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>{selectedItem.data[0].title}</DialogTitle>
          <DialogContent>
            {selectedItem.data[0].media_type === 'image' && (
              <Box
                component="img"
                src={selectedItem.links[0].href}
                alt={selectedItem.data[0].title}
                sx={{ width: '100%', borderRadius: 2 }}
              />
            )}
            {selectedItem.data[0].media_type === 'video' && (
              <Box
                component="video"
                src={selectedItem.links[0].href}
                controls
                sx={{ width: '100%', borderRadius: 2 }}
              />
            )}
            {selectedItem.data[0].media_type === 'audio' && (
              <Box
                component="audio"
                src={selectedItem.links[0].href}
                controls
                sx={{ width: '100%' }}
              />
            )}
            <Typography mt={2}>
              {selectedItem.data[0].description}
            </Typography>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}

export default NasaImagesVideoDialog;