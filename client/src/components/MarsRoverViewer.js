import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import {
  Search as SearchIcon,
  Image as ImageIcon,
  Videocam as VideoIcon,
  Audiotrack as AudioIcon,
  Close as CloseIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';

function NasaMediaLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState(false);
  const [mediaTypes, setMediaTypes] = useState(['image', 'video', 'audio']);
  const [results, setResults] = useState({ image: [], video: [], audio: [] });
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchVideoData = async (item) => {
    try {
      const response = await axios.get(item.href);
      const mp4Links = response.data.filter(link => link.endsWith('.mp4'));
      const thumbnails = response.data.filter(link => link.endsWith('.jpg') || link.endsWith('.png'));
      return {
        ...item,
        videoUrl: mp4Links[0] || null,
        thumbnailUrl: thumbnails[0] || item.links?.[0]?.href
      };
    } catch (error) {
      return { ...item, videoUrl: null, thumbnailUrl: item.links?.[0]?.href };
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError(true);
      return;
    }

    setSearchError(false);
    setLoading(true);
    setHasSearched(true);

    try {
      const res = await axios.get('https://images-api.nasa.gov/search', {
        params: { q: searchQuery, media_type: mediaTypes.join(',') },
      });

      const grouped = { image: [], video: [], audio: [] };
      const videoItems = res.data.collection.items.filter(item => item.data[0].media_type === 'video');
      const processedVideos = await Promise.all(videoItems.map(fetchVideoData));
      grouped.video = processedVideos.filter(video => video.videoUrl !== null);

      res.data.collection.items.forEach(item => {
        const type = item.data[0].media_type;
        if (type !== 'video' && grouped[type]) grouped[type].push(item);
      });

      setResults(grouped);
    } catch (err) {
      setResults({ image: [], video: [], audio: [] });
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (item) => {
    const data = item.data[0];
    const isVideo = data.media_type === 'video';
    const thumbnail = isVideo ? item.thumbnailUrl : item.links?.[0]?.href;

    return (
      <Card sx={{ height: '100%' }}>
        <CardActionArea onClick={() => setSelectedItem(item)}>
          <Box sx={{ height: 180, overflow: 'hidden', position: 'relative' }}>
            <img
              src={thumbnail}
              alt={data.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {isVideo && <PlayIcon sx={{ position: 'absolute', top: '45%', left: '45%', fontSize: 40, color: '#fff' }} />}
          </Box>
          <CardContent>
            <Typography variant="subtitle1" noWrap>{data.title}</Typography>
            <Typography variant="body2" color="text.secondary" noWrap>{data.description || 'No description available'}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0D1B2A', color: '#fff', px: 3, py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>NASA Media Library</Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search NASA media"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          error={searchError}
          helperText={searchError && 'Search term is required'}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            sx: { backgroundColor: '#fff', borderRadius: 1 }
          }}
        />
        <ToggleButtonGroup value={mediaTypes} onChange={(e, val) => val.length && setMediaTypes(val)}>
          <ToggleButton value="image"><ImageIcon /></ToggleButton>
          <ToggleButton value="video"><VideoIcon /></ToggleButton>
          <ToggleButton value="audio"><AudioIcon /></ToggleButton>
        </ToggleButtonGroup>
        <IconButton onClick={handleSearch} sx={{ bgcolor: '#1976d2', color: '#fff', '&:hover': { bgcolor: '#1565c0' } }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
        </IconButton>
      </Box>

      {hasSearched && !loading && Object.values(results).every(arr => arr.length === 0) && (
        <Typography align="center">No results found for "{searchQuery}"</Typography>
      )}

      {['image', 'video', 'audio'].map(type => results[type].length > 0 && (
        <Box key={type} sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {type.charAt(0).toUpperCase() + type.slice(1)}s <Chip label={results[type].length} size="small" />
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3} justifyContent="center">
            {results[type].map(item => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.data[0].nasa_id}>
                {renderCard(item)}
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {selectedItem && (
        <Dialog open onClose={() => setSelectedItem(null)} fullWidth maxWidth="md">
          <DialogTitle>
            {selectedItem.data[0].title}
            <IconButton onClick={() => setSelectedItem(null)} sx={{ float: 'right' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedItem.data[0].media_type === 'video' ? (
              <video src={selectedItem.videoUrl} controls style={{ width: '100%' }} />
            ) : selectedItem.data[0].media_type === 'audio' ? (
              <audio src={selectedItem.links[0].href} controls style={{ width: '100%' }} />
            ) : (
              <img src={selectedItem.links[0].href} alt={selectedItem.data[0].title} style={{ width: '100%' }} />
            )}
            <Typography variant="body1" sx={{ mt: 2 }}>{selectedItem.data[0].description}</Typography>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}

export default NasaMediaLibrary;
