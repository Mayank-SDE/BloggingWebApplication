import React, { useState, useContext } from 'react';
import { Box, TextField, Typography, Button, styled } from '@mui/material';
import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';
import { useNavigate } from 'react-router-dom';

const Component = styled(Box)`
  width: 400px;
  margin: auto;
  box-shadow: 5px 2px 5px 5px rgb(0 0 0/0.6);
`;

const Image = styled('img')({
  //camelCase

  width: 100,
  display: 'flex',
  margin: 'auto',
  padding: '50px 0 0',
});

const Wrapper = styled(Box)`
  padding: 25px 35px;
  display: flex;
  flex: 1;
  flex-direction: column;
  & > div,
  & > p,
  & > button {
    margin-top: 20px;
  }
`;

const LoginButton = styled(Button)`
  text-transform: none;
  background: #fb641b;
  color: #ffffff;
  height: 48px;
  border-radius: 2px;
`;

const SignupButton = styled(Button)`
  text-transform: none;
  background: #ffffff;
  color: #2874f0;
  height: 48px;
  border-radius: 2px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 /20%);
`;

const Text = styled(Typography)`
  color: #878787;
  font-size: 16px;
`;

const signupInitialValues = {
  name: '',
  username: '',
  password: '',
};
const loginInitialValues = {
  username: '',
  password: '',
};

const Error = styled(Typography)`
  font-size: 10px;
  color: #ff6161;
  line-height: 0;
  margin-top: 10px;
  font-weight: 600;
`;
const Login = ({ isUserAuthenticated }) => {
  const imageURL =
    'https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png';

  const [account, toggleAccount] = useState('login');

  const [signup, setSignup] = useState(signupInitialValues);

  const [error, setError] = useState('');

  const [login, setLogin] = useState(loginInitialValues);

  const { setAccount } = useContext(DataContext);

  const navigate = useNavigate();

  const toggleSignup = () => {
    account === 'signup' ? toggleAccount('login') : toggleAccount('signup');
  };

  const onInputChange = (event) => {
    setSignup({ ...signup, [event.target.name]: event.target.value });
  };

  const signupUser = async () => {
    const response = await API.userSignup(signup);
    if (response.isSuccess) {
      setError('');
      setSignup(signupInitialValues);
      toggleAccount('login');
    } else {
      setError('Something went wrong. Please try agin later.');
    }
  };

  const onValueChange = (event) => {
    setLogin({ ...login, [event.target.name]: event.target.value });
  };

  const loginUser = async () => {
    const response = await API.userLogin(login);

    if (response.isSuccess) {
      setError('');
      sessionStorage.setItem(
        'accessToken',
        `Bearer ${response.data.accessToken}`
      );
      sessionStorage.setItem(
        'refreshToken',
        `Bearer ${response.data.refreshToken}`
      );

      setAccount({
        username: response.data.username,
        name: response.data.name,
      });
      isUserAuthenticated(true);
      setLogin(loginInitialValues); //
      navigate('/');
    } else {
      setError('Something went wrong. Please try again later.');
    }
  };
  return (
    <Component>
      <Box>
        <Image src={imageURL} alt="login" />
        {account === 'login' ? (
          <Wrapper>
            <TextField
              value={login.username}
              name="username"
              variant="standard"
              onChange={(event) => onValueChange(event)}
              label="Enter Username"
            />
            <TextField
              value={login.password}
              name="password"
              variant="standard"
              onChange={(event) => onValueChange(event)}
              label="Enter Password"
            />
            {error && <Error>{error}</Error>}
            <LoginButton variant="contained" onClick={() => loginUser()}>
              Login
            </LoginButton>
            <Text style={{ textAlign: 'center' }}>OR</Text>
            <SignupButton onClick={() => toggleSignup()}>
              CREATE AN ACCOUNT
            </SignupButton>
          </Wrapper>
        ) : (
          <Wrapper>
            <TextField
              name="name"
              variant="standard"
              onChange={(event) => onInputChange(event)}
              label="Enter Name"
            />
            <TextField
              name="username"
              variant="standard"
              onChange={(event) => onInputChange(event)}
              label="Enter Username"
            />
            <TextField
              name="password"
              variant="standard"
              onChange={(event) => onInputChange(event)}
              label="Enter Password"
            />
            {error && <Error>{error}</Error>}
            <SignupButton onClick={() => signupUser()}>Sign Up</SignupButton>
            <Text style={{ textAlign: 'center' }}>OR</Text>
            <LoginButton variant="contained" onClick={() => toggleSignup()}>
              Already have an account
            </LoginButton>
          </Wrapper>
        )}
      </Box>
    </Component>
  );
};

export default Login;
