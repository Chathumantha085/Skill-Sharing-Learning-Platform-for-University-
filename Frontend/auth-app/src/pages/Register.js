import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
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
  Slide,
  LinearProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import authService from '../api/auth';
import backgroundImage from '../assets/auth-bg.jpg'; // Replace with your background image

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

const RegisterCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
  maxWidth: 500,
  width: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[16],
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
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

const PasswordStrengthBar = styled(LinearProgress)(({ theme, strength }) => ({
  height: 6,
  borderRadius: 3,
  marginTop: -20,
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.grey[300],
  '& .MuiLinearProgress-bar': {
    backgroundColor: 
      strength === 'weak' ? theme.palette.error.main :
      strength === 'medium' ? theme.palette.warning.main :
      theme.palette.success.main,
  },
}));

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      'Must contain at least one uppercase, one lowercase, one number and one special character'
    ),
});

const Register = () => {
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    value: 0,
    strength: 'weak'
  });
  const navigate = useNavigate();

  // Check for saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setRememberMe(true);
    }
  }, []);

  const calculatePasswordStrength = (password) => {
    let strengthValue = 0;
    // Length check
    if (password.length >= 8) strengthValue += 25;
    // Uppercase check
    if (/[A-Z]/.test(password)) strengthValue += 25;
    // Lowercase check
    if (/[a-z]/.test(password)) strengthValue += 25;
    // Special char check
    if (/[!@#$%^&*]/.test(password)) strengthValue += 25;

    let strength;
    if (strengthValue < 50) strength = 'weak';
    else if (strengthValue < 75) strength = 'medium';
    else strength = 'strong';

    return { value: strengthValue, strength };
  };

  const handlePasswordChange = (e, handleChange) => {
    handleChange(e);
    setPasswordStrength(calculatePasswordStrength(e.target.value));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      await authService.register(values.username, values.email, values.password);
      
      // Save email if "Remember me" is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', values.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            <RegisterCard elevation={6}>
              <Box textAlign="center" mb={4}>
                <LockIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  Create Your Account
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Join our community today
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
                  username: '',
                  email: localStorage.getItem('rememberedEmail') || '',
                  password: '',
                }}
                validationSchema={RegisterSchema}
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
                      name="email"
                      label="Email"
                      fullWidth
                      margin="normal"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      InputProps={{
                        startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                      }}
                      variant="outlined"
                    />

                    <StyledTextField
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      margin="normal"
                      value={values.password}
                      onChange={(e) => handlePasswordChange(e, handleChange)}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                    />

                    {values.password && (
                      <Box>
                        <PasswordStrengthBar 
                          variant="determinate" 
                          value={passwordStrength.value} 
                          strength={passwordStrength.strength}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Password strength: {passwordStrength.strength}
                        </Typography>
                      </Box>
                    )}

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
                      {loading ? 'Creating Account...' : 'Register'}
                    </SubmitButton>

                    <Box mt={3} textAlign="center">
                      <Typography variant="body2">
                        Already have an account?{' '}
                        <Typography 
                          component="span" 
                          color="primary" 
                          sx={{ 
                            cursor: 'pointer', 
                            fontWeight: 600,
                            '&:hover': { textDecoration: 'underline' } 
                          }}
                          onClick={() => navigate('/login')}
                        >
                          Sign in
                        </Typography>
                      </Typography>
                    </Box>
                  </Form>
                )}
              </Formik>
            </RegisterCard>
          </Fade>
        </Box>
      </Slide>
    </AnimatedContainer>
  );
};

export default Register;