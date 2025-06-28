import React, { useState, useEffect } from "react";
import { fetchApod } from "../api/APOD";
import ApodDetailDialog from "./ApodDetailDialog";
import {
  Typography,
  Box,
  Paper,
  IconButton,
  ImageListItemBar,
  CircularProgress,
  Container
} from '@mui/material';
import InfoIcon from "@mui/icons-material/Info";
import { styled } from '@mui/material/styles';

const StyledCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '600px',
  overflow: 'hidden',
  borderRadius: theme.spacing(2),
  backgroundColor: '#FC3D21', // NASA red background
  border: '4px solid #FF0000', // Red border highlight
  boxShadow: theme.shadows[6],
}));

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  cursor: 'pointer'
});

const ApodViewer = () => {
  const [apod, setApod] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const openDialog = (img) => setSelectedImage(img);
  const closeDialog = () => setSelectedImage(null);

  useEffect(() => {
    const getApod = async () => {
      try {
        const data = await fetchApod();
        const oneImage = Array.isArray(data) ? data[0] : data;
        setApod(oneImage);
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

  if (error || !apod) {
    return (
      <Typography align="center" color="error" mt={4}>
        Error: {error || "Image not available"}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0D1B2A', // deep navy background
        color: 'white',
        pt: 8,
        pb: 4
      }}
    >
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
          Astronomy Picture of the Day
        </Typography>

        <StyledCard elevation={8}>
          <StyledImage
            src={apod.url || apod.thumbnail_url}
            alt={apod.title}
            onClick={() => openDialog(apod)}
          />

          <ImageListItemBar
            sx={{
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              background:
                'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)'
            }}
            title={apod.title}
            subtitle={apod.copyright ? `© ${apod.copyright}` : ''}
            actionIcon={
              <IconButton
                sx={{ color: '#fff' }}
                onClick={() => openDialog(apod)}
                aria-label={`info about ${apod.title}`}
              >
                <InfoIcon />
              </IconButton>
            }
          />
        </StyledCard>

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
