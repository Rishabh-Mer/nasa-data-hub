import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import nasaLogo from "../logo/nasa_red.png"


function Navbar() {

    return (
        <AppBar position="static" sx={{backgroundColor:"#0B3D91"}}>
            <Toolbar>
                <Box 
                 component={Link}
                 to="/"
                 sx={{
                    display:"flex",
                    alignItems:'center',
                    textDecoration:'none',
                    color:'inherit',
                    mr:2,
                 }}
                >
                    <img 
                     src={nasaLogo}
                     alt="NASA LOGO"
                     style={{ height: 40, marginRight: 8}} 
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;







