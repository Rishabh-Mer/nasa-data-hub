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

function NasaImagesVideoDialog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState(false);
  const [mediaTypes, setMediaTypes] = useState(['image', 'video', 'audio']);
  const [results, setResults] = useState({
    image: [],
    video: [],
    audio: [],
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchVideoData = async (item) => {
    try {
      const response = await axios.get(item.href);
      const mp4Links = response.data.filter(link => 
        link.endsWith('.mp4') && !link.includes('~thumb')
      );
      const thumbnails = response.data.filter(link => 
        link.endsWith('.jpg') || link.endsWith('.png')
      );
      
      return {
        ...item,
        videoUrl: mp4Links[0] || null,
        thumbnailUrl: thumbnails[0] || item.links?.[0]?.href
      };
    } catch (error) {
      console.error('Error fetching video data:', error);
      return {
        ...item,
        videoUrl: null,
        thumbnailUrl: item.links?.[0]?.href
      };
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
      const res = await axios.get(`https://images-api.nasa.gov/search`, {
        params: {
          q: searchQuery,
          media_type: mediaTypes.join(','),
        },
      });

      const grouped = { image: [], video: [], audio: [] };
      
      // Process videos separately to get MP4 links
      const videoItems = res.data.collection.items.filter(
        item => item.data[0].media_type === 'video'
      );
      const processedVideos = await Promise.all(
        videoItems.map(item => fetchVideoData(item))
      );
      grouped.video = processedVideos.filter(video => video.videoUrl !== null);

      // Process other media types
      res.data.collection.items.forEach((item) => {
        const type = item.data[0].media_type;
        if (type !== 'video' && grouped[type]) {
          grouped[type].push(item);
        }
      });

      setResults(grouped);
    } catch (err) {
      console.error('Error fetching NASA data:', err);
      setResults({ image: [], video: [], audio: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleMediaTypeChange = (event, newTypes) => {
    if (newTypes.length) {
      setMediaTypes(newTypes);
    }
  };

  const handleOpen = (item) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  const renderMediaThumbnail = (item) => {
    const data = item.data[0];
    const isVideo = data.media_type === 'video';
    const imgSrc = isVideo ? item.thumbnailUrl : item.links?.[0]?.href;

    if (isVideo) {
      return (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            backgroundColor: '#000',
          }}
        >
          <img
            src={imgSrc}
            alt={data.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.8
            }}
          />
          <PlayIcon
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 60,
              color: 'rgba(255,255,255,0.9)',
            }}
          />
        </Box>
      );
    }

    return (
      <img
        src={imgSrc}
        alt={data.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    );
  };

  const renderMediaSection = (type, items) => {
    if (items.length === 0) return null;

    return (
      <Box sx={{ mt: 4, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {type === 'image' && <ImageIcon color="primary" sx={{ mr: 1 }} />}
          {type === 'video' && <VideoIcon color="primary" sx={{ mr: 1 }} />}
          {type === 'audio' && <AudioIcon color="primary" sx={{ mr: 1 }} />}
          <Typography variant="h6" component="h2">
            {type.charAt(0).toUpperCase() + type.slice(1)}s
            <Chip label={items.length} size="small" sx={{ ml: 1 }} />
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {items.map((item) => {
            const data = item.data[0];
            return (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={data.nasa_id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleOpen(item)}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: 180,
                        backgroundColor: '#000',
                        overflow: 'hidden',
                      }}
                    >
                      {renderMediaThumbnail(item)}
                    </Box>
                    <CardContent sx={{ height: 100 }}>
                      <Typography gutterBottom variant="subtitle1" noWrap>
                        {data.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {data.description || 'No description available'}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      }}
    >
      <Box
        sx={{
          maxWidth: '100%',
          margin: '0 auto',
          px: { xs: 0, md: 4 },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 3,
            color: 'primary.main',
            textAlign: 'center',
          }}
        >
          NASA Media Library
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3,
            alignItems: { xs: 'stretch', sm: 'flex-end' },
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search NASA's collection of images, videos, and audio"
            value={searchQuery}
            error={searchError}
            helperText={searchError && 'Please enter a search term'}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (searchError) setSearchError(false);
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: '#fff',
                borderRadius: 2,
              },
            }}
            sx={{
              flexGrow: 1,
            }}
          />

          <ToggleButtonGroup
            value={mediaTypes}
            onChange={handleMediaTypeChange}
            aria-label="media types"
            sx={{
              height: 56,
              '& .MuiToggleButton-root': {
                px: 2,
                border: 'none',
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              },
            }}
          >
            <ToggleButton value="image" aria-label="images">
              <ImageIcon sx={{ mr: 1 }} />
              Images
            </ToggleButton>
            <ToggleButton value="video" aria-label="videos">
              <VideoIcon sx={{ mr: 1 }} />
              Videos
            </ToggleButton>
            <ToggleButton value="audio" aria-label="audio">
              <AudioIcon sx={{ mr: 1 }} />
              Audio
            </ToggleButton>
          </ToggleButtonGroup>

          <IconButton
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            sx={{
              height: 56,
              width: 56,
              backgroundColor: 'primary.main',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '&:disabled': {
                backgroundColor: 'action.disabledBackground',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <SearchIcon />
            )}
          </IconButton>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && hasSearched && (
          <>
            {Object.values(results).every((arr) => arr.length === 0) ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 300,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No results found for "{searchQuery}"
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try different search terms or media types
                </Typography>
              </Box>
            ) : (
              <>
                {renderMediaSection('image', results.image)}
                {renderMediaSection('video', results.video)}
                {renderMediaSection('audio', results.audio)}
              </>
            )}
          </>
        )}

        {selectedItem && (
          <Dialog
            open
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                maxHeight: '90vh',
              },
            }}
          >
            <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'primary.main',
                color: '#fff',
              }}
            >
              {selectedItem.data[0].title}
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
              {selectedItem.data[0].media_type === 'image' && (
                <Box
                  component="img"
                  src={selectedItem.links[0].href}
                  alt={selectedItem.data[0].title}
                  sx={{
                    width: '100%',
                    maxHeight: '60vh',
                    objectFit: 'contain',
                    flexGrow: 1,
                  }}
                />
              )}
              {selectedItem.data[0].media_type === 'video' && (
                <Box
                  sx={{
                    width: '100%',
                    height: '60vh',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {selectedItem.videoUrl ? (
                    <video
                      controls
                      autoPlay
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    >
                      <source src={selectedItem.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        Video Not Available
                      </Typography>
                      <Typography>
                        Could not load video. Please try again later.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
              {selectedItem.data[0].media_type === 'audio' && (
                <Box
                  component="audio"
                  src={selectedItem.links[0].href}
                  controls
                  sx={{
                    width: '100%',
                    p: 3,
                  }}
                />
              )}
              <Box sx={{ p: 3, overflow: 'auto' }}>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedItem.data[0].date_created &&
                    new Date(selectedItem.data[0].date_created).toLocaleDateString()}
                </Typography>
                <Typography paragraph>
                  {selectedItem.data[0].description ||
                    'No description available.'}
                </Typography>
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </Box>
  );
}

export default NasaImagesVideoDialog;