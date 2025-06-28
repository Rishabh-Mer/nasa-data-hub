import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { fetchEpic } from '../api/Epic';

export default function EpicViewer() {
   const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false); // for help dialog

  useEffect(() => {
    fetchEpic()
      .then(data => setImages(data))
      .catch(err => console.error('Failed to fetch EPIC data:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleOpen = (img) => {
    const [date_, time] = img.date.split(' ');
    const datePath = date_.replaceAll('-', '/');
    const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${datePath}/png/${img.image}.png`;
    setSelectedImage({ ...img, url: imageUrl, date_, time });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const handleInfoOpen = () => setInfoOpen(true);
  const handleInfoClose = () => setInfoOpen(false);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#0D1B2A', minHeight: '100vh', py: 4 }}>
      <Container>
        {/* Title with Help Icon */}
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{ color: 'white', fontWeight: 'bold' }}
          >
            NASA EPIC Earth Image Gallery
          </Typography>
          <IconButton onClick={handleInfoOpen} sx={{ color: 'white' }}>
            <HelpOutlineIcon />
          </IconButton>
        </Stack>

        <Grid container spacing={4}>
          {images.map((img) => {
            const [date_] = img.date.split(' ');
            const datePath = date_.replaceAll('-', '/');
            const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${datePath}/png/${img.image}.png`;

            return (
              <Grid item xs={12} sm={6} md={4} key={img.identifier}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    backgroundColor: '#1B263B',
                    color: 'white',
                  }}
                  onClick={() => handleOpen(img)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={imageUrl}
                    alt="Earth image"
                  />
                  <CardContent>
                    <Typography variant="body2">Date: {date_}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Image Preview Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { backgroundColor: '#0D1B2A', color: 'white' },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          EPIC Earth Image
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedImage && (
            <>
              <img
                src={selectedImage.url}
                alt="Earth from DSCOVR"
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', marginBottom: '1rem' }}
              />
              <Typography>Date: {selectedImage.date_}</Typography>
              <Typography>Time: {selectedImage.time}</Typography>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog
        open={infoOpen}
        onClose={handleInfoClose}
        maxWidth="sm"
        PaperProps={{
          sx: { backgroundColor: '#0D1B2A', color: 'white' },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          About the EPIC API
          <IconButton onClick={handleInfoClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">
            The EPIC API provides information on the daily imagery collected by DSCOVR's Earth Polychromatic Imaging Camera (EPIC) instrument.
            Uniquely positioned at the Earth-Sun Lagrange point, EPIC provides full disc imagery of the Earth and captures unique perspectives of
            certain astronomical events such as lunar transits using a 2048x2048 pixel CCD (Charge Coupled Device) detector coupled to a 30-cm aperture
            Cassegrain telescope.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}