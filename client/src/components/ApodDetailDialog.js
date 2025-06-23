import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";


function ApodDetailDialog({image, onClose }) {

    return (
        <Dialog open maxWidth="md">
            <DialogTitle sx={{textAlign:"center"}}>{image.title}</DialogTitle>
            <IconButton 
                onClick={onClose}
                sx={{position:"absolute", color:"grey", right: 8, top:8}}
            >
                <CloseIcon/>
            </IconButton>
            <DialogContent dividers>
                <Typography sx={{textAlign:"center", textJustify:"inherit"}}> 
                    {image.explanation}
                </Typography>
            </DialogContent>
        </Dialog>
    )
}

export default ApodDetailDialog;