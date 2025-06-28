import React, { useState, useEffect } from "react";
import { fetchMarsRover } from "../api/MarRover";
import { 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardActionArea,
  Container,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import MarsRoverImagesDialog from "./MarsRoverImagesDialog";

const MarsRoverViewer = () => {
  const [marsImages, setMarsImages] = useState([]);
  const [rover, setRover] = useState("curiosity");
  const [earthDate, setEarthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [rovers] = useState([
    { name: "Curiosity", value: "curiosity" },
    { name: "Perseverance", value: "perseverance" },
    { name: "Opportunity", value: "opportunity" },
    { name: "Spirit", value: "spirit" }
  ]);

  const handleSearch = async () => {
    if (!rover || !earthDate) return;
    
    setLoading(true);
    setError("");
    try {
      const data = await fetchMarsRover(rover, earthDate);
      setMarsImages(data.photos || []);
      if (!data.photos || data.photos.length === 0) {
        setError("No images found for the selected date");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch images");
      setMarsImages([]);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (img) => setSelectedImage(img);
  const closeDialog = () => setSelectedImage(null);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B3D91 0%, #1A237E 100%)',
      color: 'white',
      pt: 8,
      pb: 4
    }}>
      <Container maxWidth="lg">
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
          Mars Rover Images
        </Typography>

        <Card sx={{ 
          p: 4, 
          mb: 6,
          background: 'rgba(11, 61, 145, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(79, 172, 254, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Rover</InputLabel>
                <Select
                  value={rover}
                  onChange={(e) => setRover(e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  {rovers.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      {r.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type="date"
                label="Earth Date"
                InputLabelProps={{ shrink: true }}
                value={earthDate}
                onChange={(e) => setEarthDate(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    color: 'white',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSearch}
                disabled={!rover || !earthDate || loading}
                sx={{
                  height: '56px',
                  background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
                  boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)'
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.12)'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </Card>

        {loading && (
          <Box display="flex" justifyContent="center" my={8}>
            <CircularProgress sx={{ color: '#4facfe' }} />
          </Box>
        )}

        {error && (
          <Typography align="center" sx={{ my: 4, color: '#ff6b6b' }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={4} justifyContent="center">
          {marsImages.map((img) => (
            <Grid item xs={12} sm={6} md={4} key={img.id}>
              <Card sx={{ 
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)'
                }
              }}>
                <CardActionArea onClick={() => openDialog(img)}>
                  <Box sx={{ 
                    position: 'relative',
                    paddingTop: '75%', // 4:3 aspect ratio
                    overflow: 'hidden'
                  }}>
                    <img
                      src={img.img_src}
                      alt={img.camera.full_name}
                      loading="lazy"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                  <CardContent sx={{ 
                    background: 'rgba(11, 61, 145, 0.6)',
                    borderTop: '1px solid rgba(79, 172, 254, 0.3)'
                  }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#4facfe' }}>
                      {img.camera.full_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {img.rover.name} Rover • {img.earth_date}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {selectedImage && (
          <MarsRoverImagesDialog 
            image={selectedImage} 
            onClose={closeDialog} 
          />
        )}
      </Container>
    </Box>
  );
};

export default MarsRoverViewer;