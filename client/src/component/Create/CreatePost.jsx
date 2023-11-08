import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../context/DataProvider';
import {
  Box,
  styled,
  FormControl,
  InputBase,
  Button,
  TextareaAutosize,
} from '@mui/material';
import { AddCircle as Add } from '@mui/icons-material';
import { API } from '../../service/api';
import { useLocation, useNavigate } from 'react-router-dom';
const Container = styled(Box)(({ theme }) => ({
  margin: '50px 100px',

  [theme.breakpoints.down('md')]: {
    margin: 0,
  },
}));

const Image = styled('img')({
  width: '100%',
  height: '50vh',
  objectFit: 'cover',
});

const StyledFormControl = styled(FormControl)`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
`;

const InputTextField = styled(InputBase)`
  flex: 1;
  margin: 0 30px;
  font-size: 25px;
`;

const TextArea = styled(TextareaAutosize)`
  width: 100%;
  margin-top: 50px;
  font-size: 18px;
  border: none;
  &:focus-visible {
    outline: none;
  }
`;

const initialPost = {
  title: '',
  description: '',
  picture: '',
  username: '',
  categories: '',
  createdDate: new Date(),
};
const CreatePost = () => {
  const [post, setPost] = useState(initialPost);

  const [file, setFile] = useState('');

  const location = useLocation();

  const { account } = useContext(DataContext);
  const navigate = useNavigate();
  const url = post.picture
    ? post.picture
    : 'https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';
  useEffect(() => {
    const getImage = async () => {
      if (file) {
        const data = new FormData();
        data.append('name', file.name);
        data.append('file', file);

        //API for image upload
        const response = await API.uploadFile(data);

        setPost({ ...post, picture: response.data });
      }
    };
    getImage();
    post.categories = location.search?.split('=')[1] || 'All';
    post.username = account.username;
  }, [file]);

  const handleChange = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const savePost = async () => {
    const response = await API.createPost(post);
    if (response.isSuccess) {
      navigate('/');
    }
  };
  return (
    <Container>
      <Image src={url} alt="post-banner" />
      <StyledFormControl>
        <label htmlFor="fileInput">
          <Add fontSize="large" color="action" />
        </label>
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={(event) => setFile(event.target.files[0])}
        />
        <InputTextField
          placeholder="Title"
          onChange={(event) => handleChange(event)}
          name="title"
        />
        <Button
          variant="contained"
          onClick={() => {
            savePost();
          }}
        >
          Publish
        </Button>
      </StyledFormControl>
      <TextArea
        minRows={5}
        placeholder="Tell your story."
        onChange={(event) => handleChange(event)}
        name="description"
      />
    </Container>
  );
};

export default CreatePost;
