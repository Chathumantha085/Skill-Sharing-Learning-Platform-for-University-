import { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Avatar, 
  Chip, 
  CircularProgress, 
  Alert,
  Paper,
  Container,
  Fade,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import userService from '../api/users';
import { Person, Email, Code, Info } from '@mui/icons-material';

const ProfileContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.shadows[10],
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    textAlign: 'center',
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    marginRight: 0,
    marginBottom: theme.spacing(2),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(1),
  },
}));

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getCurrentUser();
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error" variant="filled">{error}</Alert>
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Container maxWidth="md">
        <ProfileContainer elevation={3}>
          <ProfileHeader>
            <UserAvatar
              src={user?.profilePicture}
              alt={user?.username}
            />
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                {user?.username}
              </Typography>
              <Box display="flex" alignItems="center">
                <Email color="action" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Box>
          </ProfileHeader>
          
          <Divider sx={{ my: 3 }} />
          
          <Box mb={4}>
            <SectionTitle variant="h5">
              <Info /> About
            </SectionTitle>
            <Typography paragraph sx={{ pl: 4 }}>
              {user?.bio || 'No bio provided'}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box>
            <SectionTitle variant="h5">
              <Code /> Skills
            </SectionTitle>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pl: 4 }}>
              {user?.skills?.length > 0 ? (
                user.skills.map((skill) => (
                  <Chip 
                    key={skill} 
                    label={skill} 
                    color="primary"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography color="text.secondary">No skills added</Typography>
              )}
            </Box>
          </Box>
        </ProfileContainer>
      </Container>
    </Fade>
  );
};

export default Profile;