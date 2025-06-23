import React, { useEffect } from "react";
import { 
  Typography, 
  Card, 
  CardActionArea, 
  CardContent, 
  Grid, 
  useTheme, 
  useMediaQuery, 
  Box, 
  Fade,
  Grow,
  Slide,
  Zoom,
  Container,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Facebook, Twitter, Instagram, GitHub } from "@mui/icons-material";
import { Star, Public, SatelliteAlt, Rocket, Science } from "@mui/icons-material";

import Carina from "../images/Carina.jpg";

function IndexPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const cards = [
    { 
      title: 'Astronomy Picture of the Day', 
      path: '/apod',
      description: 'Discover the cosmos! Each day a different image of our universe',
      color: '#0B3D91',
      icon: <Star fontSize="large" />
    },
    { 
      title: 'Mars Rover Photos', 
      path: '/mars',
      description: 'Explore the Martian surface through the eyes of NASA rovers',
      color: '#C1440E',
      icon: <Public fontSize="large" />
    },
    { 
      title: 'NASA Media Library', 
      path: '/media_library',
      description: 'Access NASA\'s vast collection of images, videos and audio',
      color: '#4A6F28',
      icon: <SatelliteAlt fontSize="large" />
    },
    { 
      title: 'Near Earth Objects', 
      path: '/neo',
      description: 'Track asteroids and comets that come close to Earth',
      color: '#8E44AD',
      icon: <Rocket fontSize="large" />
    },
    { 
      title: 'Space Weather (DONKI)', 
      path: '/donki',
      description: 'Monitor space weather events and solar activities',
      color: '#2980B9',
      icon: <Science fontSize="large" />
    },
  ];

  const stats = [
    { value: '50+', label: 'NASA Missions' },
    { value: 'Millions', label: 'Cosmic Images' },
    { value: '24/7', label: 'Live Data' },
    { value: 'Open', label: 'API Access' }
  ];

  const nasaSections = [
    { title: 'Humans In Space', items: ['Artemis Program', 'International Space Station', 'Commercial Crew'] },
    { title: 'Earth', items: ['Climate Change', 'Earth Science', 'Natural Disasters'] },
    { title: 'Our Solar System', items: ['Planets', 'Moons', 'Asteroids & Comets'] },
    { title: 'Universe', items: ['Galaxies', 'Black Holes', 'Dark Matter'] },
    { title: 'Science', items: ['Astrophysics', 'Heliophysics', 'Planetary Science'] },
    { title: 'Missions', items: ['Current Missions', 'Future Missions', 'Past Missions'] },
    { title: 'Aeronautics', items: ['Aviation Safety', 'Supersonic Flight', 'UAS Integration'] },
    { title: 'Technology', items: ['Space Tech', 'Robotics', '3D Printing'] }
  ];

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${Carina})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        pt: 4,
        pb: 6
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          py: 10,
          mb: 6
        }}>
          <Slide in={isVisible} direction="down" timeout={800}>
            <Typography 
              variant="h2" 
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: isMobile ? '2.5rem' : '4rem',
                mb: 2,
                background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(79, 172, 254, 0.5)'
              }}
            >
              NASA API Explorer
            </Typography>
          </Slide>
          
          <Fade in={isVisible} timeout={1200}>
            <Typography 
              variant="h6" 
              component="p"
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto', 
                mb: 4,
                fontSize: isMobile ? '1rem' : '1.25rem'
              }}
            >
              Explore the cosmos through NASA's open APIs. Discover stunning astronomical images, 
              track space weather, follow Mars rovers, and monitor near-Earth objects.
            </Typography>
          </Fade>
          
          <Fade in={isVisible} timeout={1600}>
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                size="large" 
                sx={{
                  bgcolor: '#0B3D91',
                  '&:hover': { bgcolor: '#1A4DA8' },
                  mr: 2,
                  mb: isMobile ? 2 : 0
                }}
                onClick={() => navigate('/apod')}
              >
                Start Exploring
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': { borderColor: '#4facfe' }
                }}
                onClick={() => window.open('https://api.nasa.gov/', '_blank')}
              >
                NASA APIs
              </Button>
            </Box>
          </Fade>
        </Box>

        {/* Stats Section */}
        <Zoom in={isVisible} timeout={1000}>
          <Box sx={{ 
            bgcolor: 'rgba(11, 61, 145, 0.3)',
            borderRadius: 3,
            p: 4,
            mb: 8,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(79, 172, 254, 0.2)'
          }}>
            <Grid container spacing={3} justifyContent="center">
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ 
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #00f2fe 0%, #4facfe 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Zoom>

        {/* NASA Sections */}
        <Fade in={isVisible} timeout={1500}>
          <Box sx={{ 
            bgcolor: 'rgba(11, 61, 145, 0.3)',
            borderRadius: 3,
            p: 4,
            mb: 8,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(79, 172, 254, 0.2)'
          }}>
            <Typography 
              variant="h4" 
              align="center"
              sx={{ 
                mb: 4,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Explore NASA Topics
            </Typography>
            
            <Grid container spacing={4}>
              {nasaSections.map((section, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      mb: 2,
                      color: '#4facfe',
                      textAlign: 'center'
                    }}>
                      {section.title}
                    </Typography>
                    <Divider sx={{ 
                      bgcolor: 'rgba(79, 172, 254, 0.5)',
                      mb: 2 
                    }} />
                    <List dense>
                      {section.items.map((item, itemIndex) => (
                        <ListItem key={itemIndex} sx={{ 
                          py: 0,
                          '&:hover': {
                            bgcolor: 'rgba(79, 172, 254, 0.1)'
                          }
                        }}>
                          <ListItemText 
                            primary={item} 
                            sx={{ 
                              textAlign: 'center',
                              '& .MuiTypography-root': {
                                fontSize: '0.875rem'
                              }
                            }} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Cards Grid */}
        <Box sx={{ mb: 10 }}>
          <Typography 
            variant="h4" 
            align="center" 
            sx={{ 
              mb: 6,
              fontWeight: 600,
              background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Explore NASA Data
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {cards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={card.title}>
                <Grow in={isVisible} timeout={800 + (index * 200)}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.5)`,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: `0 15px 40px -5px rgba(0, 0, 0, 0.7)`,
                      }
                    }}
                  >
                    <CardActionArea 
                      onClick={() => navigate(card.path)} 
                      sx={{ height: '100%' }}
                    >
                      <Box 
                        sx={{ 
                          height: '180px', 
                          background: `linear-gradient(135deg, ${card.color} 0%, ${darkenColor(card.color, 20)} 100%)`,
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Box 
                          component="div"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                            opacity: 0.3
                          }}
                        />
                        <Box sx={{ 
                          color: 'white',
                          mb: 2,
                          zIndex: 1
                        }}>
                          {card.icon}
                        </Box>
                        <Typography 
                          variant="h5" 
                          align="center"
                          sx={{ 
                            fontWeight: 700, 
                            zIndex: 1,
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            px: 2
                          }}
                        >
                          {card.title}
                        </Typography>
                      </Box>
                      <CardContent sx={{ bgcolor: 'background.paper' }}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            minHeight: '60px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {card.description}
                        </Typography>
                        <Box sx={{ 
                          mt: 2, 
                          display: 'flex', 
                          justifyContent: 'center' 
                        }}>
                          <Box 
                            sx={{
                              width: '40px',
                              height: '4px',
                              background: card.color,
                              borderRadius: '2px'
                            }}
                          />
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Section - Centered as requested */}
        <Zoom in={isVisible} timeout={1500}>
          <Box sx={{ 
            bgcolor: 'rgba(11, 61, 145, 0.3)',
            borderRadius: 3,
            p: 4,
            mb: 8,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(79, 172, 254, 0.2)',
            textAlign: 'center' // Added to center content
          }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #00f2fe 0%, #4facfe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Why Explore With Us
            </Typography>
            
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Box>
                  <Box
                    sx={{
                      fontSize: '3rem',
                      mb: 2,
                      color: '#4facfe'
                    }}
                  >
                    🌌
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Curated Content
                  </Typography>
                  <Typography variant="body2" sx={{ maxWidth: '300px', mx: 'auto' }}>
                    We organize NASA's vast data into easily accessible categories, 
                    making space exploration simple and enjoyable.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box>
                  <Box
                    sx={{
                      fontSize: '3rem',
                      mb: 2,
                      color: '#4facfe'
                    }}
                  >
                    🚀
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Educational Value
                  </Typography>
                  <Typography variant="body2" sx={{ maxWidth: '300px', mx: 'auto' }}>
                    Learn about astronomy, planetary science, and space technology 
                    through interactive exploration of real NASA data.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box>
                  <Box
                    sx={{
                      fontSize: '3rem',
                      mb: 2,
                      color: '#4facfe'
                    }}
                  >
                    📡
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Always Updated
                  </Typography>
                  <Typography variant="body2" sx={{ maxWidth: '300px', mx: 'auto' }}>
                    Our platform connects directly to NASA APIs, ensuring you always 
                    have the latest space data at your fingertips.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Zoom>

        {/* NASA News Section */}
        <Fade in={isVisible} timeout={1800}>
          <Box sx={{ 
            bgcolor: 'rgba(11, 61, 145, 0.3)',
            borderRadius: 3,
            p: 4,
            mb: 8,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(79, 172, 254, 0.2)'
          }}>
            <Typography 
              variant="h4" 
              align="center"
              sx={{ 
                mb: 4,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Latest NASA News
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 3,
                  bgcolor: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: 2,
                  height: '100%'
                }}>
                  <Typography variant="h6" sx={{ mb: 1, color: '#4facfe' }}>
                    Artemis Mission Updates
                  </Typography>
                  <Divider sx={{ bgcolor: 'rgba(79, 172, 254, 0.5)', mb: 2 }} />
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    NASA prepares for Artemis II, the first crewed mission around the Moon in over 50 years.
                  </Typography>
                  <Button 
                    size="small" 
                    sx={{ 
                      color: '#4facfe',
                      textTransform: 'none'
                    }}
                    onClick={() => window.open('https://www.nasa.gov/artemis', '_blank')}
                  >
                    Read More
                  </Button>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 3,
                  bgcolor: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: 2,
                  height: '100%'
                }}>
                  <Typography variant="h6" sx={{ mb: 1, color: '#4facfe' }}>
                    James Webb Discoveries
                  </Typography>
                  <Divider sx={{ bgcolor: 'rgba(79, 172, 254, 0.5)', mb: 2 }} />
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Webb Telescope reveals unprecedented details of early galaxy formation.
                  </Typography>
                  <Button 
                    size="small" 
                    sx={{ 
                      color: '#4facfe',
                      textTransform: 'none'
                    }}
                    onClick={() => window.open('https://www.nasa.gov/webb', '_blank')}
                  >
                    Read More
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button 
                variant="outlined" 
                sx={{
                  color: '#4facfe',
                  borderColor: '#4facfe',
                  '&:hover': { borderColor: '#00f2fe' }
                }}
                onClick={() => window.open('https://www.nasa.gov/news', '_blank')}
              >
                View All NASA News
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Call to Action */}
        <Fade in={isVisible} timeout={2000}>
          <Box sx={{ 
            textAlign: 'center', 
            bgcolor: 'rgba(11, 61, 145, 0.3)',
            borderRadius: 3,
            p: 6,
            mb: 8,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(79, 172, 254, 0.2)'
          }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #00f2fe 0%, #4facfe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Ready to Explore the Cosmos?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
              Start your journey through NASA's incredible data today. Whether you're a space enthusiast, 
              educator, student, or developer, there's something amazing to discover.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              sx={{
                bgcolor: '#0B3D91',
                '&:hover': { bgcolor: '#1A4DA8' },
                px: 6,
                py: 1.5
              }}
              onClick={() => navigate('/apod')}
            >
              Begin Exploration
            </Button>
          </Box>
        </Fade>
      </Container>

      {/* Footer (unchanged as requested) */}
      <Box 
        component="footer"
        sx={{ 
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          py: 6,
          mt: 'auto',
          borderTop: '1px solid rgba(79, 172, 254, 0.2)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                NASA API Explorer
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                This application utilizes NASA's open APIs to bring the wonders of space exploration 
                to your fingertips. All data is provided by NASA and is in the public domain.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Resources
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                NASA Open APIs Portal
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                NASA Image and Video Library
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Space Science Data Resources
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Connect
              </Typography>
              <Box>
                <IconButton sx={{ color: 'white' }}>
                  <Facebook />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <Twitter />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <Instagram />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <GitHub />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                © {new Date().getFullYear()} NASA API Explorer
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

// Helper function to darken colors
function darkenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)}`;
}

export default IndexPage;