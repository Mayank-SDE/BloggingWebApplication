import React, { useState, useContext, useEffect } from 'react';

import { Box, TextareaAutosize, Button, styled } from '@mui/material';

import { DataContext } from '../../../context/DataProvider';
import Comment from './Comment';

import { API } from '../../../service/api';
const Container = styled(Box)`
  margin-top: 100px;
  display: flex;
`;

const Image = styled('img')({
  width: 50,
  height: 50,
  borderRadius: '50%',
});

const StyledTextArea = styled(TextareaAutosize)`
  height: 100px;
  width: 100%;
  margin: 0 20px;
`;
const initialValues = {
  name: '',
  postId: '',
  comments: '',
  date: new Date(),
};
const Comments = ({ post }) => {
  const url = 'https://static.thenounproject.com/png/12017-200.png';
  const { account } = useContext(DataContext);
  const [comment, setComment] = useState(initialValues);
  const [comments, setComments] = useState([]);
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    const getData = async () => {
      const response = await API.getAllComments(post._id);
      if (response.isSuccess) {
        setComments(response.data);
      }
    };
    getData();
  }, [post, toggle]);
  const handleChange = (event) => {
    setComment({
      ...comment,
      name: account.username,
      postId: post._id,
      comments: event.target.value,
    });
  };
  const addComment = async (event) => {
    let response = await API.newComment(comment);
    if (response.isSuccess) {
      setComment(initialValues);
    }
    setToggle((prevState) => !prevState);
  };
  return (
    <Box>
      <Container>
        <Image src={url} alt="dp" />
        <StyledTextArea
          minRows={5}
          placeholder="Whats on your mind?"
          value={comment.comments}
          onChange={(event) => {
            handleChange(event);
          }}
        />
        <Button
          variant="contained"
          color="primary"
          size="medium"
          style={{ height: '40px' }}
          onClick={(event) => {
            addComment(event);
          }}
        >
          Post
        </Button>
      </Container>
      <Box>
        {comments &&
          comments.length > 0 &&
          comments.map((comment, index) => (
            <Comment comment={comment} key={index} setToggle={setToggle} />
          ))}
      </Box>
    </Box>
  );
};

export default Comments;
