import { Container, Box } from '@mui/material';
import Navbar from './Navbar';
import { styled } from '@mui/material/styles';
import backgroundImage from '../assets/auth-bg.jpg';

const LayoutContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Navbar />
      <ContentContainer maxWidth="lg">
        {children}
      </ContentContainer>
    </LayoutContainer>
  );
};

export default Layout;