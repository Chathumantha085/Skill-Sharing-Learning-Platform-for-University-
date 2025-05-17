import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Button, 
  Typography, 
  Box, 
  Alert, 
  TextField, 
  Checkbox, 
  FormControlLabel, 
  Container,
  Paper,
  Fade,
  Slide
} from '@mui/material';
import { 
  Lock as LockIcon, 
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import authService from '../api/auth';
import backgroundImage from '../assets/auth-bg.jpg'; // Replace with your actual background image

const AnimatedContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: theme.spacing(4),
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
  maxWidth: 450,
  width: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[16],
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 2,
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  letterSpacing: 0.5,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check for saved credentials on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setRememberMe(true);
      // You might want to pre-fill the form here
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      await authService.login(values.username, values.password);
      
      // Save username if "Remember me" is checked
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', values.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <AnimatedContainer maxWidth={false}>
      <Slide in direction="up" timeout={500}>
        <Box>
          <Fade in timeout={800}>
            <LoginCard elevation={6}>
              <Box textAlign="center" mb={4}>
                <LockIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sign in to access your account
                </Typography>
              </Box>

              {error && (
                <Fade in>
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                </Fade>
              )}

              <Formik
                initialValues={{
                  username: localStorage.getItem('rememberedUsername') || '',
                  password: '',
                }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
                  <Form>
                    <StyledTextField
                      name="username"
                      label="Username"
                      fullWidth
                      margin="normal"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      InputProps={{
                        startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                      }}
                      variant="outlined"
                    />

                    <StyledTextField
                      name="password"
                      label="Password"
                      type="password"
                      fullWidth
                      margin="normal"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
                      }}
                      variant="outlined"
                    />

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Remember me"
                      />
                      <Typography 
                        variant="body2" 
                        color="primary" 
                        sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        onClick={() => navigate('/forgot-password')}
                      >
                        Forgot password?
                      </Typography>
                    </Box>

                    <SubmitButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting || loading}
                      fullWidth
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </SubmitButton>

                    <Box mt={3} textAlign="center">
                      <Typography variant="body2">
                        Don't have an account?{' '}
                        <Typography 
                          component="span" 
                          color="primary" 
                          sx={{ 
                            cursor: 'pointer', 
                            fontWeight: 600,
                            '&:hover': { textDecoration: 'underline' } 
                          }}
                          onClick={() => navigate('/register')}
                        >
                          Sign up
                        </Typography>
                      </Typography>
                    </Box>
                  </Form>
                )}
              </Formik>
            </LoginCard>
          </Fade>
        </Box>
      </Slide>
    </AnimatedContainer>
  );
};

export default Login;