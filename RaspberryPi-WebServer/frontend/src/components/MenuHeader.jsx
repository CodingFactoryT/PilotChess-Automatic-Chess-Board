import {useState} from 'react';
import {AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Divider} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function MenuHeader({children}) {
  const username = "TestUser123";  //TODO Actual Username
  const [accountMenuAnchorElement, setAccountMenuAnchorElement] = useState(null);
  const isAccountMenuOpen = Boolean(accountMenuAnchorElement);

  const handleAccountMenuOpen = (event) => setAccountMenuAnchorElement(event.currentTarget);
  const handleAccountMenuClose = () => setAccountMenuAnchorElement(null);
  
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <>
    <AppBar position="static" sx={{
      display: "flex",
      height: "5vh",
      justifyContent: "center",
      backgroundColor: "inherit",
      color: "inherit",
      marginBottom: "15px"
    }}>
      <Toolbar>
      <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="profile"
          onClick={() => navigate("/")}
        >
          <HomeOutlinedIcon />
        </IconButton>
        <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
          
        </Typography>

        <Button
          aria-controls={isAccountMenuOpen ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={isAccountMenuOpen ? 'true' : undefined}
          onClick={handleAccountMenuOpen}
          sx={{
            textTransform: "none",
            color: "inherit",
            marginRight: "1rem"
          }}
        >
          {username} <AccountCircleOutlinedIcon sx={{
            marginLeft: "0.5rem"
          }}/>
        </Button>
        <Menu
          id="account-menu"
          anchorEl={accountMenuAnchorElement}
          open={isAccountMenuOpen}
          onClose={handleAccountMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transitionDuration={0}
          slotProps={{
            paper: {
              style: {
                minWidth: accountMenuAnchorElement?.offsetWidth + 50
              }
            }
          }}
        >
          <MenuItem onClick={handleAccountMenuClose}>TODO1</MenuItem>
          <MenuItem onClick={handleAccountMenuClose}>TODO2</MenuItem>
          <Divider />
          <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
    {children}
    </>
  );
}