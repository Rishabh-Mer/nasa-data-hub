import React, { useState, useEffect } from "react";
import { fetchApod } from "../api/APOD";
import ApodDetailDialog from "./ApodDetailDialog";
import { 
  Typography, 
  ImageList, 
  ImageListItem, 
  ImageListItemBar, 
  IconButton, 
  Box,
  CircularProgress,
  Paper,
  Container
} from '@mui/material';
import InfoIcon from "@mui/icons-material/Info";
import { styled } from '@mui/material/styles';

const StyledImageListItem = styled(ImageListItem)(({ theme }) => ({
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[4]
  },
}));

const ApodViewer = () => {
  const [apod, setApod] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const openDialog = (img) => setSelectedImage(img);
  const closeDialog = () => setSelectedImage(null);

  useEffect(() => {
    const getApod = async () => {
      try {
        const data = await fetchApod();
        setApod(data);
      } catch (err) {
        setError(err.message || 'Failed to load APOD');
      } finally {
        setLoading(false);
      }
    };
    getApod();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography align="center" color="error" mt={4}>
        Error: {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B3D91 0%, #1A237E 100%)',
      color: 'white',
      pt: 8,
      pb: 4
    }}>
      <Container maxWidth="md">
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{
            mb: 6,
            fontWeight: 700,
            background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(79, 172, 254, 0.5)'
          }}
        >
          Astronomy Pictures of the Day
        </Typography>

        <Paper elevation={6} sx={{ 
          p: 2, 
          mb: 4,
          background: 'rgba(11, 61, 145, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(79, 172, 254, 0.2)'
        }}>
          <ImageList sx={{ width: '100%', height: 500 }}>
            {apod.map((img) => (
              <StyledImageListItem key={img.url || img.thumbnail_url}>
                <img
                  src={img.url || img.thumbnail_url}
                  alt={img.title}
                  loading="lazy"
                  style={{
                    borderRadius: '12px',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                  onClick={() => openDialog(img)}
                />
                <ImageListItemBar
                  sx={{
                    borderBottomLeftRadius: '12px',
                    borderBottomRightRadius: '12px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                  }}
                  title={img.title}
                  subtitle={img.copyright ? `© ${img.copyright}` : ''}
                  actionIcon={
                    <IconButton
                      sx={{ color: '#4facfe' }}
                      onClick={() => openDialog(img)}
                      aria-label={`info about ${img.title}`}
                    >
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </StyledImageListItem>
            ))}
          </ImageList>
        </Paper>

        {selectedImage && (
          <ApodDetailDialog
            image={selectedImage}
            onClose={closeDialog}
          />
        )}
      </Container>
    </Box>
  );
};

export default ApodViewer;