import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
  Tabs,
  Tab,
  Slider,
  Chip,
  Divider,
  TextField
} from "@mui/material";
import { fetchNeoData } from "../api/Neo";
import { format, subDays } from "date-fns";
import DangerousIcon from '@mui/icons-material/Dangerous';
import WarningIcon from '@mui/icons-material/Warning';
import PublicIcon from '@mui/icons-material/Public';
import SpeedIcon from '@mui/icons-material/Speed';
import StraightenIcon from '@mui/icons-material/Straighten';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimelineIcon from '@mui/icons-material/Timeline';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import TableViewIcon from '@mui/icons-material/TableView';

const NeoViewer = () => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState(new Date(), 7);
  const [neoData, setNeoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [hazardFilter, setHazardFilter] = useState(false);
  const [sizeRange, setSizeRange] = useState([0, 10]);

  const formatForInput = (date) => {
    return format(date, 'yyyy-MM-dd');
  };

  const handleStartDateChange = (e) => {
    setStartDate(new Date(e.target.value));
  };

  const handleEndDateChange = (e) => {
    setEndDate(new Date(e.target.value));
  };

  const loadData = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    
    if (startDate > endDate) {
      setError("Start date must be before end date");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const data = await fetchNeoData(
        format(startDate, 'yyyy-MM-dd'), 
        format(endDate, 'yyyy-MM-dd')
      );
      
      const formatted = Object.entries(data.near_earth_objects || {})
        .flatMap(([date, neos]) => 
          neos.map(neo => ({
            id: neo.id,
            date,
            name: neo.name,
            diameter: (
              neo.estimated_diameter.kilometers.estimated_diameter_min +
              neo.estimated_diameter.kilometers.estimated_diameter_max
            ) / 2,
            hazardous: neo.is_potentially_hazardous_asteroid,
            velocity: parseFloat(neo.close_approach_data[0]?.relative_velocity.kilometers_per_second || 0),
            missDistance: parseFloat(neo.close_approach_data[0]?.miss_distance.kilometers || 0)
          }))
        )
        .filter(neo => 
          neo.diameter >= sizeRange[0] && 
          neo.diameter <= sizeRange[1] &&
          (!hazardFilter || neo.hazardous)
        );

      setNeoData(formatted);
    } catch (err) {
      console.error("Failed to fetch NEO data", err);
      setError("Failed to fetch NEO data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [hazardFilter, sizeRange]);

  const handleSizeChange = (event, newValue) => {
    setSizeRange(newValue);
  };

  const hazardousCount = neoData.filter(neo => neo.hazardous).length;
  const avgDiameter = neoData.length > 0 
    ? neoData.reduce((sum, neo) => sum + neo.diameter, 0) / neoData.length
    : 0;
  const avgVelocity = neoData.length > 0 
    ? neoData.reduce((sum, neo) => sum + neo.velocity, 0) / neoData.length
    : 0;
  
  // Group data by date for timeline view
  const timelineData = neoData.reduce((acc, neo) => {
    if (!acc[neo.date]) {
      acc[neo.date] = {
        date: neo.date,
        total: 0,
        hazardous: 0
      };
    }
    acc[neo.date].total++;
    if (neo.hazardous) acc[neo.date].hazardous++;
    return acc;
  }, {});

  // Group data by size ranges
  const sizeDistribution = [
    { range: '<0.5km', count: neoData.filter(neo => neo.diameter < 0.5).length },
    { range: '0.5-1km', count: neoData.filter(neo => neo.diameter >= 0.5 && neo.diameter < 1).length },
    { range: '1-2km', count: neoData.filter(neo => neo.diameter >= 1 && neo.diameter < 2).length },
    { range: '2-5km', count: neoData.filter(neo => neo.diameter >= 2 && neo.diameter < 5).length },
    { range: '5+km', count: neoData.filter(neo => neo.diameter >= 5).length }
  ];

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 },
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)' 
        : 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        maxWidth: 1400, 
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
          gap: 2
        }}>
          <Box>
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              Near Earth Objects Tracker
            </Typography>
            <Typography sx={{fontSize:12}} color="text.secondary">
              (Select only 7 days from Start Date)
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Monitor asteroids approaching Earth in real-time
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2,
            justifyContent: { xs: 'center', md: 'flex-end' }
          }}>
            <TextField
              label="Start Date"
              type="date"
              value={formatForInput(startDate)}
              onChange={handleStartDateChange}
            />
            <TextField
              label="End Date"
              type="date"
              value={formatForInput(endDate)}
              onChange={handleEndDateChange}
            />
            <Button 
              variant="contained" 
              onClick={loadData}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{ minWidth: 120 }}
            >
              {loading ? "Loading..." : "Update"}
            </Button>
            
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 2,
          mb: 4,
          alignItems: 'center'
        }}>
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" gutterBottom>
              Size range: {sizeRange[0].toFixed(1)} - {sizeRange[1].toFixed(1)} km
            </Typography>
            <Slider
              value={sizeRange}
              onChange={handleSizeChange}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.1}
              sx={{ width: '90%' }}
            />
          </Box>
          
          <Chip
            label={`Hazardous Only`}
            variant={hazardFilter ? "filled" : "outlined"}
            color={hazardFilter ? "error" : "default"}
            onClick={() => setHazardFilter(!hazardFilter)}
            icon={<DangerousIcon />}
            sx={{ 
              px: 1,
              '& .MuiChip-icon': { 
                color: hazardFilter ? 'inherit' : theme.palette.text.secondary 
              }
            }}
          />
        </Box>

        {error && (
          <Typography color="error" align="center" mb={2}>
            {error}
          </Typography>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: theme.palette.mode === 'dark' 
                ? 'rgba(25, 118, 210, 0.16)' 
                : 'rgba(25, 118, 210, 0.08)'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <PublicIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {neoData.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Objects
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: theme.palette.mode === 'dark' 
                ? 'rgba(244, 67, 54, 0.16)' 
                : 'rgba(244, 67, 54, 0.08)'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <DangerousIcon sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color={hazardousCount > 0 ? 'error' : 'inherit'}>
                  {hazardousCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Potentially Hazardous
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: theme.palette.mode === 'dark' 
                ? 'rgba(255, 152, 0, 0.16)' 
                : 'rgba(255, 152, 0, 0.08)'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <StraightenIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {avgDiameter.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Diameter (km)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%',
              background: theme.palette.mode === 'dark' 
                ? 'rgba(76, 175, 80, 0.16)' 
                : 'rgba(76, 175, 80, 0.08)'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SpeedIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {avgVelocity.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Velocity (km/s)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab label="Overview" icon={<PublicIcon />} iconPosition="start" />
          <Tab label="Timeline" icon={<TimelineIcon />} iconPosition="start" />
          <Tab label="Size Distribution" icon={<SsidChartIcon />} iconPosition="start" />
          <Tab label="Hazard Analysis" icon={<DangerousOutlinedIcon />} iconPosition="start" />
          <Tab label="Detailed Data" icon={<TableViewIcon />} iconPosition="start" />
        </Tabs>

        {/* Tab Content */}
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: 400 
          }}>
            <CircularProgress size={60} />
          </Box>
        ) : neoData.length > 0 ? (
          <Box>
            {/* Overview Tab */}
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card elevation={3} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <DangerousIcon color="error" sx={{ mr: 1 }} />
                      Hazard Status Summary
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Card sx={{ 
                          borderLeft: `4px solid ${theme.palette.error.main}`,
                          height: '100%'
                        }}>
                          <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="error">
                              {hazardousCount}
                            </Typography>
                            <Typography variant="body2">
                              Hazardous Objects
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(neoData.length > 0 ? (hazardousCount / neoData.length * 100).toFixed(1) : 0)}% of total
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card sx={{ 
                          borderLeft: `4px solid ${theme.palette.success.main}`,
                          height: '100%'
                        }}>
                          <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="success.main">
                              {neoData.length - hazardousCount}
                            </Typography>
                            <Typography variant="body2">
                              Non-Hazardous
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(neoData.length > 0 ? ((neoData.length - hazardousCount) / neoData.length * 100).toFixed(1) : 0)}% of total
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        <DangerousIcon color="error" sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                        Potentially hazardous asteroids are those with an Earth Minimum Orbit Intersection Distance (MOID) 
                        of 0.05 au or less and an absolute magnitude (H) of 22.0 or less.
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card elevation={3} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <StraightenIcon sx={{ mr: 1 }} />
                      Size Distribution
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      {sizeDistribution.map((item) => (
                        <Grid item xs={4} sm={4} md={2.4} key={item.range}>
                          <Card sx={{ height: '100%' }}>
                            <CardContent sx={{ textAlign: 'center', p: 1 }}>
                              <Typography variant="h6">
                                {item.count}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.range}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2">
                        <strong>Largest object:</strong> {Math.max(...neoData.map(neo => neo.diameter)).toFixed(3)} km
                      </Typography>
                      <Typography variant="body2">
                        <strong>Smallest object:</strong> {Math.min(...neoData.map(neo => neo.diameter)).toFixed(3)} km
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Timeline Tab */}
            {activeTab === 1 && (
              <Card elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon sx={{ mr: 1 }} />
                  Objects Timeline
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {Object.values(timelineData)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((day) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={day.date}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {new Date(day.date).toLocaleDateString()}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Typography variant="body2">
                                Total: {day.total}
                              </Typography>
                              {day.hazardous > 0 && (
                                <Typography variant="body2" color="error">
                                  Hazardous: {day.hazardous}
                                </Typography>
                              )}
                            </Box>
                            {day.hazardous > 0 && (
                              <Box sx={{ 
                                mt: 1,
                                p: 1,
                                backgroundColor: theme.palette.mode === 'dark' 
                                  ? 'rgba(244, 67, 54, 0.16)' 
                                  : 'rgba(244, 67, 54, 0.08)',
                                borderRadius: 1
                              }}>
                                <Typography variant="body2" color="error">
                                  <DangerousIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> 
                                  {' '}
                                  {day.hazardous} potentially hazardous objects detected
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Card>
            )}

            {/* Size Distribution Tab */}
            {activeTab === 2 && (
              <Card elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <StraightenIcon sx={{ mr: 1 }} />
                  Size vs Velocity Analysis
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {neoData
                    .sort((a, b) => b.diameter - a.diameter)
                    .slice(0, 12)
                    .map((neo) => (
                      <Grid item xs={12} sm={6} md={4} key={neo.id}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {neo.name}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Typography variant="body2">
                                <StraightenIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} />{' '}
                                {neo.diameter.toFixed(3)} km
                              </Typography>
                              <Typography variant="body2">
                                <SpeedIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} />{' '}
                                {neo.velocity.toFixed(2)} km/s
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              mt: 1,
                              p: 1,
                              backgroundColor: neo.hazardous 
                                ? (theme.palette.mode === 'dark' 
                                    ? 'rgba(244, 67, 54, 0.16)' 
                                    : 'rgba(244, 67, 54, 0.08)')
                                : (theme.palette.mode === 'dark' 
                                    ? 'rgba(76, 175, 80, 0.16)' 
                                    : 'rgba(76, 175, 80, 0.08)'),
                              borderRadius: 1
                            }}>
                              <Typography variant="body2" color={neo.hazardous ? 'error' : 'success.main'}>
                                {neo.hazardous ? (
                                  <>
                                    <DangerousIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> 
                                    {' '}
                                    Potentially hazardous
                                  </>
                                ) : (
                                  <>
                                    <PublicIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> 
                                    {' '}
                                    Non-hazardous
                                  </>
                                )}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Card>
            )}

            {/* Hazard Analysis Tab */}
            {activeTab === 3 && (
              <Box>
                <Card elevation={3} sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <DangerousOutlinedIcon sx={{ mr: 1 }} />
                    Hazardous Objects Analysis
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {hazardousCount > 0 ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" color="error">
                              Hazardous Objects Summary
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2">
                                <strong>Average Diameter:</strong> {(
                                  neoData.filter(neo => neo.hazardous)
                                  .reduce((sum, neo) => sum + neo.diameter, 0) / hazardousCount
                                ).toFixed(3)} km
                              </Typography>
                              <Typography variant="body2">
                                <strong>Average Velocity:</strong> {(
                                  neoData.filter(neo => neo.hazardous)
                                  .reduce((sum, neo) => sum + neo.velocity, 0) / hazardousCount
                                ).toFixed(2)} km/s
                              </Typography>
                              <Typography variant="body2">
                                <strong>Closest Approach:</strong> {Math.min(
                                  ...neoData.filter(neo => neo.hazardous)
                                  .map(neo => neo.missDistance)
                                ).toLocaleString()} km
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Most Dangerous Objects
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              {neoData
                                .filter(neo => neo.hazardous)
                                .sort((a, b) => a.missDistance - b.missDistance)
                                .slice(0, 3)
                                .map((neo, index) => (
                                  <Box key={neo.id} sx={{ mb: 2 }}>
                                    <Typography variant="body2" fontWeight="bold">
                                      #{index + 1}: {neo.name}
                                    </Typography>
                                    <Typography variant="body2">
                                      Miss Distance: {(neo.missDistance / 1000).toFixed(2)} thousand km
                                    </Typography>
                                    <Typography variant="body2">
                                      Date: {new Date(neo.date).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                      No hazardous objects in this date range
                    </Typography>
                  )}
                </Card>
                
                {hazardousCount > 0 && (
                  <Card elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      All Hazardous Objects
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      {neoData
                        .filter(neo => neo.hazardous)
                        .map(neo => (
                          <Grid item xs={12} sm={6} md={4} key={neo.id}>
                            <Card sx={{ 
                              borderLeft: `4px solid ${theme.palette.error.main}`,
                              height: '100%'
                            }}>
                              <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {neo.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                  <WarningIcon color="error" sx={{ mr: 1 }} />
                                  <Typography variant="body2">
                                    Miss Distance: {(neo.missDistance / 1000).toFixed(2)} thousand km
                                  </Typography>
                                </Box>
                                <Typography variant="body2">
                                  Diameter: {neo.diameter.toFixed(3)} km
                                </Typography>
                                <Typography variant="body2">
                                  Velocity: {neo.velocity.toFixed(2)} km/s
                                </Typography>
                                <Typography variant="body2">
                                  Date: {new Date(neo.date).toLocaleDateString()}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                    </Grid>
                  </Card>
                )}
              </Box>
            )}

            {/* Detailed Data Tab */}
            {activeTab === 4 && (
              <Card elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <TableViewIcon sx={{ mr: 1 }} />
                  All Detected Objects
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {neoData.map(neo => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={neo.id}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          borderLeft: neo.hazardous 
                            ? `4px solid ${theme.palette.error.main}` 
                            : `4px solid ${theme.palette.success.main}`
                        }}
                      >
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {neo.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            {neo.hazardous ? (
                              <DangerousIcon color="error" sx={{ mr: 1 }} />
                            ) : (
                              <PublicIcon color="success" sx={{ mr: 1 }} />
                            )}
                            <Typography variant="body2">
                              {neo.hazardous ? 'Hazardous' : 'Non-Hazardous'}
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            <StraightenIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} />{' '}
                            {neo.diameter.toFixed(3)} km
                          </Typography>
                          <Typography variant="body2">
                            <SpeedIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} />{' '}
                            {neo.velocity.toFixed(2)} km/s
                          </Typography>
                          <Typography variant="body2">
                            Miss Distance: {(neo.missDistance / 1000).toFixed(2)} thousand km
                          </Typography>
                          <Typography variant="body2">
                            <CalendarTodayIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} />{' '}
                            {new Date(neo.date).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            )}
          </Box>
        ) : (
          <Card elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No near-Earth objects detected in this date range
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting the date range or filters
            </Typography>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default NeoViewer;