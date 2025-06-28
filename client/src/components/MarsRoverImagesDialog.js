import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Divider,
  Chip,
  styled
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: 'rgba(11, 61, 145, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(79, 172, 254, 0.5)',
    borderRadius: '16px',
    color: 'white',
    maxWidth: '800px',
    width: '90%'
  },
}));

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', mb: 1 }}>
    <Typography variant="subtitle2" sx={{ 
      minWidth: 120, 
      color: '#4facfe',
      fontWeight: 'bold'
    }}>
      {label}:
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

function MarsRoverImagesDialog({ image, onClose }) {
  return (
    <StyledDialog open onClose={onClose}>
      <DialogTitle sx={{ 
        background: 'linear-gradient(90deg, rgba(79,172,254,0.3) 0%, rgba(0,242,254,0.3) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pr: 8,
        position: 'relative'
      }}>
        <Box>
          <Typography variant="h6">{image.camera.full_name}</Typography>
          <Typography variant="subtitle2" sx={{ color: '#00f2fe' }}>
            {image.earth_date}
          </Typography>
        </Box>
        <Chip 
          label={image.rover.name} 
          color="primary" 
          size="small"
          sx={{ 
            background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      </DialogTitle>
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          color: "#4facfe",
          right: 16,
          top: 16,
          '&:hover': {
            color: '#00f2fe',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <CloseIcon fontSize="large" />
      </IconButton>
      <DialogContent dividers sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <img
            src={image.img_src}
            alt={image.camera.full_name}
            style={{
              width: '100%',
              borderRadius: '12px',
              maxHeight: '400px',
              objectFit: 'contain'
            }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#4facfe' }}>
            Camera Details
          </Typography>
          <InfoRow label="Name" value={image.camera.full_name} />
          <InfoRow label="Code" value={image.camera.name} />
          <InfoRow label="Rover" value={image.rover.name} />
          <InfoRow label="Launch Date" value={image.rover.launch_date} />
          <InfoRow label="Landing Date" value={image.rover.landing_date} />
          <InfoRow label="Status" value={image.rover.status} />
        </Box>
        
        <Divider sx={{ my: 2, borderColor: 'rgba(79, 172, 254, 0.3)' }} />
        
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: '#4facfe' }}>
            Mission Information
          </Typography>
          <Typography variant="body2" paragraph>
            The {image.rover.name} rover was launched on {image.rover.launch_date} and landed on Mars on {image.rover.landing_date}. 
            It is currently {image.rover.status === 'active' ? 'actively exploring' : 'no longer operational'}.
          </Typography>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
}

export default MarsRoverImagesDialog;