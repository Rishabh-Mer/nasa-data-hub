import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  styled
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'rgba(11, 61, 145, 0.85)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(79, 172, 254, 0.5)',
    borderRadius: '16px',
    color: 'white',
    maxWidth: '800px',
    width: '90%'
  },
}));

const StyledImage = styled('img')({
  width: '100%',
  borderRadius: '12px',
  marginBottom: '16px',
  maxHeight: '400px',
  objectFit: 'contain'
});

function ApodDetailDialog({ image, onClose }) {
  return (
    <StyledDialog open onClose={onClose}>
      <DialogTitle sx={{ 
        textAlign: "center",
        background: 'linear-gradient(90deg, rgba(79,172,254,0.3) 0%, rgba(0,242,254,0.3) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {image.title}
      </DialogTitle>
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          color: "#4facfe",
          right: 16,
          top: 16,
          '&:hover': {
            color: '#00f2fe'
          }
        }}
      >
        <CloseIcon fontSize="large" />
      </IconButton>
      <DialogContent dividers sx={{ pt: 3 }}>
        <Box display="flex" justifyContent="center">
          {image.media_type === 'image' ? (
            <StyledImage 
              src={image.hdurl || image.url} 
              alt={image.title} 
            />
          ) : (
            <iframe
              width="100%"
              height="400"
              src={image.url}
              title={image.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '12px' }}
            />
          )}
        </Box>
        <Typography variant="body1" paragraph>
          {image.explanation}
        </Typography>
        {image.copyright && (
          <Typography variant="caption" sx={{ 
            display: 'block',
            textAlign: 'right',
            color: '#4facfe',
            mt: 2
          }}>
            Credit: {image.copyright}
          </Typography>
        )}
        <Typography variant="caption" sx={{ 
          display: 'block',
          textAlign: 'right',
          color: '#00f2fe',
          mt: 1
        }}>
          {new Date(image.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Typography>
      </DialogContent>
    </StyledDialog>
  );
}

export default ApodDetailDialog;