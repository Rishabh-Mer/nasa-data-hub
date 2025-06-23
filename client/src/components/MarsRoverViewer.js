import { useState, useEffect } from "react";
import { fetchMarsRover } from "../api/MarRover";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";

const MarsRoverViewer = () => {

  const [marsImage, setMarsImage] = useState([]);
  const [rover, setRover] = useState("curiosity");
  const [earthDate, setEarthDate] = useState("");
  const [sol, setSol] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const openDialog = (img) => {
    setSelectedImage(img);
  };

  const closeDialog = () => {
    setSelectedImage(null);
  };

  const handleSearch = () => {
    fetchMarsRover(rover, earthDate, sol)
      .then((data) => {
        setMarsImage(data.photos);
      })
      .catch((error) => {
        setError(error);
        setMarsImage([]);
      });
  };

  return (
    <>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: "h4.fontSize",
          paddingTop: "40px",
          fontWeight: "bold",
        }}
      >
        MARS ROVER IMAGES
      </Typography>

      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 2, mb: 4 }}
      >
        <Grid item>
          <TextField
            type="date"
            label="Earth Date"
            InputLabelProps={{ shrink: true }}
            value={earthDate}
            onChange={(e) => {
              setEarthDate(e.target.value);
              if (e.target.value) setSol("");
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            type="number"
            label="Mars Sol"
            value={sol}
            onChange={(e) => {
              setSol(e.target.value);
              if (e.target.value) setEarthDate("");
            }}
            disabled={!!earthDate}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleSearch}>
            Search Images
          </Button>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ padding: 4, minHeight: "100vh" }}
      >
        {marsImage.map((img) => (
          <Grid item xs={12} sm={6} md={3} key={img.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardActionArea onClick={() => openDialog(img)}>
                <img
                  src={img.img_src}
                  alt={img.camera.full_name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                  }}
                />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {img.camera.full_name}
                  </Typography>
                  <Typography variant="body2">
                    Rover: {img.rover.name}
                  </Typography>
                  <Typography variant="body2">
                    Status: {img.rover.status}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

    </>
  );
}

export default MarsRoverViewer;
