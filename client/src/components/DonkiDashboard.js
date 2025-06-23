import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  Paper, 
  Grid, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Tooltip,
  Chip
} from '@mui/material';
import { 
  fetchCME, 
  fetchFLR, 
  fetchSEP, 
  fetchGST, 
  fetchStatus 
} from "../api/DONKI";

import { format, subDays, subMonths } from 'date-fns';

const DonkiDashboard = () => {
  const [eventType, setEventType] = useState('cme');
  const [startDate, setStartDate] = useState(format(subMonths(new Date(), 1), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState({});
  const [timeRange, setTimeRange] = useState('1m');

  // Event type labels
  const eventTypes = {
    cme: 'Coronal Mass Ejection (CME)',
    flr: 'Solar Flare (FLR)',
    sep: 'Solar Energetic Particle (SEP)',
    gst: 'Geomagnetic Storm (GST)'
  };

  // Load data based on selected parameters
  const loadData = async () => {
    setLoading(true);
    
    try {
      let result;
      switch(eventType) {
        case 'cme':
          result = await fetchCME(startDate, endDate);
          break;
        case 'flr':
          result = await fetchFLR(startDate, endDate);
          break;
        case 'sep':
          result = await fetchSEP(startDate, endDate);
          break;
        case 'gst':
          result = await fetchGST(startDate, endDate);
          break;
        default:
          result = [];
      }
      
      // Process data based on event type
      const processed = result.map(item => {
        const date = item.time21_5 || item.beginTime || item.startTime || item.gstID?.split('-')[0];
        
        switch(eventType) {
          case 'cme':
            return {
              id: item.activityID,
              date,
              speed: item.cmeAnalyses?.[0]?.speed || 0,
              halfAngle: item.cmeAnalyses?.[0]?.halfAngle || 0,
              note: item.note || 'No additional notes',
              type: 'CME'
            };
          case 'flr':
            return {
              id: item.flrID,
              date,
              class: item.classType,
              intensity: item.peakIntensity || 0,
              duration: item.duration || 0,
              note: 'Solar flare event',
              type: 'FLR'
            };
          case 'sep':
            return {
              id: item.sepID,
              date,
              flux: item.flux || 0,
              probability: item.probability || 0,
              note: item.note || 'Solar energetic particle event',
              type: 'SEP'
            };
          case 'gst':
            return {
              id: item.gstID,
              date,
              kpIndex: item.allKpIndex?.reduce((max, kp) => kp.kpIndex > max ? kp.kpIndex : max, 0) || 0,
              scale: kpToScale(item.allKpIndex?.reduce((max, kp) => kp.kpIndex > max ? kp.kpIndex : max, 0) || 0),
              note: 'Geomagnetic storm event',
              type: 'GST'
            };
          default:
            return item;
        }
      });
      
      setData(processed);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Convert KP index to storm scale
  const kpToScale = (kpIndex) => {
    if (kpIndex < 5) return 'G0';
    if (kpIndex < 6) return 'G1';
    if (kpIndex < 7) return 'G2';
    if (kpIndex < 8) return 'G3';
    if (kpIndex < 9) return 'G4';
    return 'G5';
  };

  // Set time range presets
  const setPresetTimeRange = (range) => {
    setTimeRange(range);
    
    const today = new Date();
    const start = new Date();
    
    switch(range) {
      case '1w':
        start.setDate(today.getDate() - 7);
        break;
      case '2w':
        start.setDate(today.getDate() - 14);
        break;
      case '1m':
        start.setMonth(today.getMonth() - 1);
        break;
      case '3m':
        start.setMonth(today.getMonth() - 3);
        break;
      case '6m':
        start.setMonth(today.getMonth() - 6);
        break;
      default:
        start.setMonth(today.getMonth() - 1);
    }
    
    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(today, 'yyyy-MM-dd'));
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  // Initialize data
  useEffect(() => {
    loadData();
    
    // Fetch status data
    const fetchStatusData = async () => {
      const statusData = await fetchStatus();
      setStatus(statusData);
    };
    
    fetchStatusData();
  }, [eventType, startDate, endDate]);

  // Find max values for scaling
  const getMaxValues = () => {
    if (data.length === 0) return { speed: 1000, intensity: 10, flux: 15000, kp: 9 };
    
    const maxValues = {
      speed: Math.max(...data.map(item => item.speed || 0), 1000),
      intensity: Math.max(...data.map(item => item.intensity || 0), 10),
      flux: Math.max(...data.map(item => item.flux || 0), 15000),
      kp: Math.max(...data.map(item => item.kpIndex || 0), 9)
    };
    
    return maxValues;
  };

  const maxValues = getMaxValues();

  // Render chart based on event type
  const renderChart = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <CircularProgress size={60} />
          <Typography variant="body1" sx={{ ml: 2 }}>Loading space weather data...</Typography>
        </Box>
      );
    }
    
    if (data.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography variant="h6" color="textSecondary">
            No data available for the selected criteria
          </Typography>
        </Box>
      );
    }
    
    switch(eventType) {
      case 'cme':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: 300 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', flexGrow: 1, gap: 2, px: 2, pb: 2 }}>
              {data.map((item, index) => (
                <Tooltip key={index} title={
                  <Box>
                    <Typography><strong>Date:</strong> {formatDisplayDate(item.date)}</Typography>
                    <Typography><strong>Speed:</strong> {item.speed || 'N/A'} km/s</Typography>
                    <Typography><strong>Half Angle:</strong> {item.halfAngle || 'N/A'}°</Typography>
                    <Typography><strong>Note:</strong> {item.note}</Typography>
                  </Box>
                }>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    width: `${80 / data.length}%`,
                    maxWidth: 100
                  }}>
                    <Typography variant="caption" sx={{ mb: 1 }}>
                      {item.date ? formatDisplayDate(item.date).split(',')[0] : 'N/A'}
                    </Typography>
                    <Box sx={{
                      width: '80%',
                      backgroundColor: '#4e79a7',
                      borderRadius: '4px 4px 0 0',
                      position: 'relative'
                    }}>
                      {item.speed > 0 && (
                        <Box sx={{
                          height: `${(item.speed / maxValues.speed) * 100}%`,
                          backgroundColor: '#e15759',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.5s ease'
                        }} />
                      )}
                      {item.halfAngle > 0 && (
                        <Box sx={{
                          height: `${(item.halfAngle / 90) * 100}%`,
                          backgroundColor: '#76b7b2',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.5s ease'
                        }} />
                      )}
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      width: '100%',
                      mt: 0.5
                    }}>
                      <Typography variant="caption" color="textSecondary">
                        {item.speed ? `${item.speed} km/s` : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Tooltip>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#e15759', mr: 1 }} />
                <Typography variant="caption">Speed (km/s)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#76b7b2', mr: 1 }} />
                <Typography variant="caption">Half Angle (°)</Typography>
              </Box>
            </Box>
          </Box>
        );
      
      case 'flr':
        return (
          <Box sx={{ height: 300, position: 'relative' }}>
            <svg width="100%" height="100%">
              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(percent => (
                <line 
                  key={percent}
                  x1="0" 
                  y1={percent * 240} 
                  x2="100%" 
                  y2={percent * 240} 
                  stroke="#f0f0f0" 
                  strokeWidth="1" 
                />
              ))}
              
              {/* Intensity line */}
              <polyline
                fill="none"
                stroke="#f28e2c"
                strokeWidth="3"
                points={data.map((item, index) => 
                  `${(index / (data.length - 1)) * 100},${220 - (item.intensity / maxValues.intensity) * 180}`
                ).join(' ')}
              />
              
              {/* Data points */}
              {data.map((item, index) => (
                <g key={index}>
                  <circle
                    cx={`${(index / (data.length - 1)) * 100}%`}
                    cy={`${220 - (item.intensity / maxValues.intensity) * 180}`}
                    r="6"
                    fill="#f28e2c"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <text
                    x={`${(index / (data.length - 1)) * 100}%`}
                    y={`${220 - (item.intensity / maxValues.intensity) * 180 - 15}`}
                    textAnchor="middle"
                    fill="#f28e2c"
                    fontWeight="bold"
                    fontSize="12"
                  >
                    {item.class}
                  </text>
                  <text
                    x={`${(index / (data.length - 1)) * 100}%`}
                    y="260"
                    textAnchor="middle"
                    fill="#666"
                    fontSize="12"
                  >
                    {item.date ? formatDisplayDate(item.date).split(',')[0] : 'N/A'}
                  </text>
                </g>
              ))}
            </svg>
          </Box>
        );
        
      case 'sep':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: 300 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              flexGrow: 1, 
              gap: 2, 
              px: 2, 
              pb: 2,
              position: 'relative'
            }}>
              {data.map((item, index) => (
                <Tooltip key={index} title={
                  <Box>
                    <Typography><strong>Date:</strong> {formatDisplayDate(item.date)}</Typography>
                    <Typography><strong>Proton Flux:</strong> {item.flux} pfu</Typography>
                    <Typography><strong>Probability:</strong> {item.probability}%</Typography>
                    <Typography><strong>Note:</strong> {item.note}</Typography>
                  </Box>
                }>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    width: `${80 / data.length}%`,
                    maxWidth: 100
                  }}>
                    <Typography variant="caption" sx={{ mb: 1 }}>
                      {item.date ? formatDisplayDate(item.date).split(',')[0] : 'N/A'}
                    </Typography>
                    <Box sx={{
                      height: `${(item.flux / maxValues.flux) * 100}%`,
                      width: '80%',
                      backgroundColor: '#59a14f',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s ease',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 'bold',
                          textShadow: '0 0 2px rgba(0,0,0,0.5)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.flux} pfu
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      height: 4, 
                      width: '100%', 
                      backgroundColor: '#edc949',
                      mt: 0.5,
                      position: 'relative'
                    }}>
                      <Box sx={{
                        width: `${item.probability}%`,
                        height: '100%',
                        backgroundColor: '#e15759',
                      }} />
                    </Box>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                      {item.probability}%
                    </Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#59a14f', mr: 1 }} />
                <Typography variant="caption">Proton Flux (pfu)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#e15759', mr: 1 }} />
                <Typography variant="caption">Event Probability</Typography>
              </Box>
            </Box>
          </Box>
        );
        
      case 'gst':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: 300 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexGrow: 1,
              gap: 3,
              flexWrap: 'wrap',
              p: 2
            }}>
              {data.map((item, index) => {
                // Determine color based on storm intensity
                let color;
                const kp = item.kpIndex || 0;
                if (kp <= 4) color = '#4e79a7'; // Minor
                else if (kp <= 6) color = '#f28e2c'; // Moderate
                else color = '#e15759'; // Severe
                
                return (
                  <Tooltip key={index} title={
                    <Box>
                      <Typography><strong>Date:</strong> {formatDisplayDate(item.date)}</Typography>
                      <Typography><strong>KP Index:</strong> {kp}</Typography>
                      <Typography><strong>Scale:</strong> {item.scale}</Typography>
                      <Typography><strong>Note:</strong> {item.note}</Typography>
                    </Box>
                  }>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: 120
                    }}>
                      <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: color,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 18,
                        boxShadow: `0 0 10px ${color}80`
                      }}>
                        {kp}
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                        {item.scale}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.date ? formatDisplayDate(item.date).split(',')[0] : 'N/A'}
                      </Typography>
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 3,
              mt: 2,
              px: 2,
              pb: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#4e79a7', mr: 1 }} />
                <Typography variant="caption">Minor (KP 0-4)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#f28e2c', mr: 1 }} />
                <Typography variant="caption">Moderate (KP 5-6)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#e15759', mr: 1 }} />
                <Typography variant="caption">Severe (KP 7-9)</Typography>
              </Box>
            </Box>
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: '#0a1929', 
      minHeight: '100vh',
      color: '#e0e0e0'
    }}>
      <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          pt: 2
        }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffffff' }}>
              NASA DONKI Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#bbbbbb' }}>
              Space Weather Database Of Notifications, Knowledge, Information
            </Typography>
          </Box>
          <Box sx={{ 
            backgroundColor: 'rgba(25, 118, 210, 0.2)', 
            borderRadius: 2,
            px: 2,
            py: 1,
            border: '1px solid rgba(25, 118, 210, 0.5)'
          }}>
            <Typography variant="body2" sx={{ color: '#64b5f6' }}>
              Real-time Space Weather Monitoring
            </Typography>
          </Box>
        </Box>
        
        {/* Controls */}
        <Paper sx={{ 
          p: 3, 
          mb: 4,
          backgroundColor: 'rgba(30, 40, 60, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="event-type-label">Event Type</InputLabel>
                <Select
                  labelId="event-type-label"
                  value={eventType}
                  label="Event Type"
                  onChange={(e) => setEventType(e.target.value)}
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <MenuItem value="cme">Coronal Mass Ejection (CME)</MenuItem>
                  <MenuItem value="flr">Solar Flare (FLR)</MenuItem>
                  <MenuItem value="sep">Solar Energetic Particle (SEP)</MenuItem>
                  <MenuItem value="gst">Geomagnetic Storm (GST)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button 
                  variant={timeRange === '1w' ? 'contained' : 'outlined'}
                  onClick={() => setPresetTimeRange('1w')}
                >
                  1 Week
                </Button>
                <Button 
                  variant={timeRange === '2w' ? 'contained' : 'outlined'}
                  onClick={() => setPresetTimeRange('2w')}
                >
                  2 Weeks
                </Button>
                <Button 
                  variant={timeRange === '1m' ? 'contained' : 'outlined'}
                  onClick={() => setPresetTimeRange('1m')}
                >
                  1 Month
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Main content */}
        <Grid container spacing={4}>
          {/* Event Visualization */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              p: 3, 
              height: '100%',
              backgroundColor: 'rgba(30, 40, 60, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#ffffff' }}>
                {eventTypes[eventType]} Events
              </Typography>
              {renderChart()}
            </Paper>
          </Grid>
          
          {/* Event Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: 3, 
              height: '100%',
              backgroundColor: 'rgba(30, 40, 60, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#ffffff' }}>
                Event Summary
              </Typography>
              
              <Box sx={{ 
                backgroundColor: 'rgba(25, 118, 210, 0.15)', 
                borderRadius: 2,
                p: 2,
                mb: 3,
                border: '1px solid rgba(25, 118, 210, 0.3)'
              }}>
                <Typography variant="body1" sx={{ color: '#64b5f6', fontWeight: 500 }}>
                  {data.length} events detected
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: '#bbbbbb' }}>
                  Between {formatDisplayDate(startDate)} and {formatDisplayDate(endDate)}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                  RECENT EVENTS
                </Typography>
                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {data.slice(0, 5).map((item, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        p: 2, 
                        mb: 1, 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 1,
                        borderLeft: '3px solid #4e79a7'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#ffffff' }}>
                          {formatDisplayDate(item.date)}
                        </Typography>
                        <Chip 
                          label={item.type} 
                          size="small" 
                          sx={{ 
                            backgroundColor: 
                              item.type === 'CME' ? 'rgba(233, 30, 99, 0.2)' :
                              item.type === 'FLR' ? 'rgba(255, 152, 0, 0.2)' :
                              item.type === 'SEP' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(33, 150, 243, 0.2)',
                            color: 
                              item.type === 'CME' ? '#e91e63' :
                              item.type === 'FLR' ? '#ff9800' :
                              item.type === 'SEP' ? '#4caf50' : '#2196f3'
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1, color: '#bbbbbb', fontSize: 14 }}>
                        {item.note || 'No additional notes'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          {/* Space Weather Status */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3,
              backgroundColor: 'rgba(30, 40, 60, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#ffffff' }}>
                Current Space Weather Status
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: 'rgba(233, 30, 99, 0.15)', 
                    borderRadius: 2,
                    border: '1px solid rgba(233, 30, 99, 0.3)'
                  }}>
                    <Typography variant="body2" sx={{ color: '#e91e63' }}>
                      Coronal Mass Ejections
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 1, color: '#ffffff' }}>
                      {status.cmeCount || 0} (last 30 days)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#bbbbbb' }}>
                      Last updated: {status.lastUpdated ? formatDisplayDate(status.lastUpdated) : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: 'rgba(255, 152, 0, 0.15)', 
                    borderRadius: 2,
                    border: '1px solid rgba(255, 152, 0, 0.3)'
                  }}>
                    <Typography variant="body2" sx={{ color: '#ff9800' }}>
                      Solar Flares
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 1, color: '#ffffff' }}>
                      {status.flareCount || 0} (last 30 days)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#bbbbbb' }}>
                      Last updated: {status.lastUpdated ? formatDisplayDate(status.lastUpdated) : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: 'rgba(33, 150, 243, 0.15)', 
                    borderRadius: 2,
                    border: '1px solid rgba(33, 150, 243, 0.3)'
                  }}>
                    <Typography variant="body2" sx={{ color: '#2196f3' }}>
                      Geomagnetic Activity
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 1, color: '#ffffff' }}>
                      Normal
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#bbbbbb' }}>
                      No significant storms
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: 'rgba(76, 175, 80, 0.15)', 
                    borderRadius: 2,
                    border: '1px solid rgba(76, 175, 80, 0.3)'
                  }}>
                    <Typography variant="body2" sx={{ color: '#4caf50' }}>
                      Radiation Levels
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 1, color: '#ffffff' }}>
                      Normal
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#bbbbbb' }}>
                      No radiation storms
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Footer */}
        <Box sx={{ 
          mt: 4, 
          pt: 2, 
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Typography variant="body2" sx={{ color: '#bbbbbb' }}>
            Data provided by NASA's Space Weather Database Of Notifications, Knowledge, Information (DONKI)
          </Typography>
          <Typography variant="caption" sx={{ color: '#888888', display: 'block', mt: 1 }}>
            This dashboard displays real data from NASA's DONKI API
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DonkiDashboard;