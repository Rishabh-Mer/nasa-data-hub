import React, { useState, useEffect } from "react";
import { fetchApod } from "../api/APOD";
import ApodDetailDialog from "./ApodDetailDialog";

import Typography from '@mui/material/Typography';
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";


const ApodViewer = () => {

    const [apod, setApod] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    const openDialog = (img) => {
        setSelectedImage(img)
    }

    const closeDialog= () => {
        setSelectedImage(null);
    }

    useEffect(() => {
        fetchApod()
            .then(data=>{
                setApod(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);


    if (error) {
        return (
            <Typography 
             align="center"
             color="error"
            >
                {error}

            </Typography>
        )
    }

    if (!apod) {
        return (
            <Typography
             align="center"
             color="info"
            >
                {loading}

            </Typography>
        )
    }

    return (
        <div>

            <Typography sx={{textAlign:"center", fontSize:"h6.fontSize", paddingTop:18}}>
                Astronomy Pictures of Day
            </Typography>

            <Box sx={{
                display: 'flex', 
                placeContent:'center',
                minHeight: '50vh',   // makes the box fill the screen height
                padding: 5,
            }}>

                <Box sx={{
                    border: "2px solid",
                    borderColor: 'primary.main',
                    borderRadius: '16px',
                    padding: 2,
                    boxShadow: 3,
                }}>
                    <ImageList sx={{ width: 700, height:450, gap: 30}}>

                        {apod.map((img) => (
                            <ImageListItem key={img.url}>
                                <img 
                                src={img.url}
                                alt={img.title}
                                loading="lazy"
                                style={{borderRadius: '15px'}}
                                />
                                <ImageListItemBar
                                sx={{borderRadius: '15px', backgroundColor:"#"}} 
                                title={img.title}
                                actionIcon={
                                    <IconButton
                                        sx={{ color: "orange"}}
                                        onClick={() => openDialog(img)}
                                        aria-label={`info about ${img.title}`}
                                    >
                                        <InfoIcon/>
                                    </IconButton>
                                }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>

                    {selectedImage && (
                        <ApodDetailDialog
                            image={selectedImage}
                            onClose={closeDialog}
                        />
                    )}
                </Box>
            </Box>
        </div>
    );
}   

export default ApodViewer;