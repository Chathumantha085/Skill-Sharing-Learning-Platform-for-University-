import { AppBar, Toolbar, Typography, Button, IconButton, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { styled } from '@mui/material/styles';
import { Home, Person, Login, HowToReg, ExitToApp } from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.shadows[4],
}));

const NavTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: 1,
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  fontWeight: 600,
  '& svg': {
    marginRight: theme.spacing(1),
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const user = isAuthenticated();

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <NavTitle variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Home /> Skill Sharing App
        </NavTitle>
        
        <NavButton color="inherit" component={Link} to="/" startIcon={<Home />}>
          Home
        </NavButton>
        
        {!user ? (
          <>
            <NavButton color="inherit" component={Link} to="/login" startIcon={<Login />}>
              Login
            </NavButton>
            <NavButton color="inherit" component={Link} to="/register" startIcon={<HowToReg />}>
              Register
            </NavButton>
          </>
        ) : (
          <>
            <NavButton color="inherit" component={Link} to="/profile" startIcon={<Person />}>
              Profile
            </NavButton>
            <IconButton
              color="inherit"
              onClick={() => {
                localStorage.removeItem(process.env.REACT_APP_TOKEN_NAME);
                navigate('/login');
              }}
              sx={{ ml: 1 }}
            >
              <ExitToApp />
            </IconButton>
            <Avatar 
              src={user.profilePicture} 
              alt={user.username} 
              sx={{ width: 40, height: 40, ml: 2 }}
            />
          </>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;