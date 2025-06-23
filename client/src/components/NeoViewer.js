import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Grid
} from "@mui/material";
import { fetchNeoData } from "../api/Neo";

const NeoViewer = () => {
  const [startDate, setStartDate] = useState("2015-09-07");
  const [endDate, setEndDate] = useState("2015-09-08");
  const [neoData, setNeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date must be before end date");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const data = await fetchNeoData(startDate, endDate);
      
      const formatted = Object.entries(data.near_earth_objects || {})
        .map(([date, neos]) => {
          const avgDiameter = neos.length > 0 
            ? (neos.reduce(
                (sum, n) => sum + (
                  n.estimated_diameter.kilometers.estimated_diameter_min +
                  n.estimated_diameter.kilometers.estimated_diameter_max
                ) / 2,
                0
              ) / neos.length
            ).toFixed(3)
            : 0;
          
          return {
            date,
            count: neos.length,
            avgDiameter: parseFloat(avgDiameter)
          };
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

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
  }, []);

  // Find max values for scaling
  const maxCount = neoData.length > 0 
    ? Math.max(...neoData.map(item => item.count), 10) 
    : 10;
    
  const maxDiameter = neoData.length > 0 
    ? Math.max(...neoData.map(item => item.avgDiameter), 1) 
    : 1;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Near Earth Objects Dashboard
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        mb: 4, 
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          inputProps={{ max: endDate }}
          sx={{ minWidth: 180 }}
        />
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          inputProps={{ min: startDate }}
          sx={{ minWidth: 180 }}
        />
        <Button 
          variant="contained" 
          onClick={loadData}
          disabled={loading}
          sx={{ minWidth: 180, height: 56 }}
        >
          {loading ? <CircularProgress size={24} /> : "Fetch NEO Data"}
        </Button>
      </Box>

      {error && (
        <Typography color="error" align="center" mb={2}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 300 
        }}>
          <CircularProgress size={60} />
        </Box>
      ) : neoData.length > 0 ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom align="center">
                NEO Count Per Day
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-end', 
                height: 300,
                gap: 1,
                justifyContent: 'center',
                mt: 4
              }}>
                {neoData.map((item, index) => (
                  <Box 
                    key={item.date} 
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: `${80 / neoData.length}%`,
                      maxWidth: 60
                    }}
                  >
                    <Typography variant="caption" sx={{ mb: 1, textAlign: 'center' }}>
                      {new Date(item.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Typography>
                    <Box
                      sx={{
                        height: `${(item.count / maxCount) * 200}px`,
                        width: '80%',
                        backgroundColor: '#1976d2',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.5s ease',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 'bold',
                          textShadow: '0 0 2px rgba(0,0,0,0.5)'
                        }}
                      >
                        {item.count}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom align="center">
                Average Diameter (km)
              </Typography>
              <Box sx={{ 
                position: 'relative', 
                height: 300,
                mt: 4
              }}>
                <svg width="100%" height="100%">
                  {/* Horizontal grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map(percent => (
                    <line 
                      key={percent}
                      x1="0" 
                      y1={percent * 250} 
                      x2="100%" 
                      y2={percent * 250} 
                      stroke="#e0e0e0" 
                      strokeWidth="1" 
                    />
                  ))}
                  
                  {/* Diameter line */}
                  <polyline
                    fill="none"
                    stroke="#ff5722"
                    strokeWidth="3"
                    points={neoData.map((item, index) => 
                      `${(index / (neoData.length - 1)) * 100},${250 - (item.avgDiameter / maxDiameter) * 200}`
                    ).join(' ')}
                  />
                  
                  {/* Data points */}
                  {neoData.map((item, index) => (
                    <g key={item.date}>
                      <circle
                        cx={`${(index / (neoData.length - 1)) * 100}%`}
                        cy={`${250 - (item.avgDiameter / maxDiameter) * 200}`}
                        r="6"
                        fill="#ff5722"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                      <text
                        x={`${(index / (neoData.length - 1)) * 100}%`}
                        y={`${250 - (item.avgDiameter / maxDiameter) * 200 - 15}`}
                        textAnchor="middle"
                        fill="#ff5722"
                        fontWeight="bold"
                        fontSize="12"
                      >
                        {item.avgDiameter.toFixed(2)}
                      </text>
                      <text
                        x={`${(index / (neoData.length - 1)) * 100}%`}
                        y="270"
                        textAnchor="middle"
                        fill="#666"
                        fontSize="12"
                      >
                        {new Date(item.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </text>
                    </g>
                  ))}
                </svg>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom align="center">
                Detailed Data
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 2,
                mt: 2
              }}>
                {neoData.map(item => (
                  <Paper key={item.date} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {new Date(item.date).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography>NEO Count:</Typography>
                      <Typography fontWeight="bold">{item.count}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Avg Diameter:</Typography>
                      <Typography fontWeight="bold">{item.avgDiameter.toFixed(3)} km</Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Typography align="center" color="textSecondary" sx={{ py: 4 }}>
          No data available for the selected date range
        </Typography>
      )}
    </Box>
  );
};

export default NeoViewer;