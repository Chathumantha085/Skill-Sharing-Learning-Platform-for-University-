import { Typography, Box, Button, Container, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 0),
  color: theme.palette.common.white,
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: 2,
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    fontSize: '4rem',
  },
}));

const HeroSubtitle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  marginBottom: theme.spacing(4),
  fontSize: '1.2rem',
  maxWidth: 700,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius * 2,
  margin: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[6],
  },
}));

const Home = () => {
  const authenticated = isAuthenticated();

  return (
    <Fade in timeout={1000}>
      <Container maxWidth="lg">
        <HeroSection>
          <HeroTitle variant="h2" gutterBottom>
            Connect, Learn & Grow Together
          </HeroTitle>
          <HeroSubtitle variant="h5">
            Join our community of passionate learners and experts to share your skills 
            and discover new opportunities for growth and collaboration.
          </HeroSubtitle>
          <Box>
            {!authenticated ? (
              <>
                <ActionButton 
                  variant="contained" 
                  color="primary" 
                  component={Link} 
                  to="/register"
                  size="large"
                >
                  Get Started
                </ActionButton>
                <ActionButton 
                  variant="outlined" 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  size="large"
                >
                  Sign In
                </ActionButton>
              </>
            ) : (
              <ActionButton 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/profile"
                size="large"
              >
                View Profile
              </ActionButton>
            )}
          </Box>
        </HeroSection>
      </Container>
    </Fade>
  );
};

export default Home;