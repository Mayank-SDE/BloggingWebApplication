import React, { useState, useEffect } from 'react';

import { Box, Grid } from '@mui/material';

import Post from './Post';

import { useSearchParams, Link } from 'react-router-dom';

import { API } from '../../../service/api';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  const [searchParams] = useSearchParams();

  const category = searchParams.get('category');

  useEffect(() => {
    const fetchData = async () => {
      let response = await API.getAllPosts({ category: category || 'all' });

      if (response.isSuccess) {
        setPosts(response.data);
      }
    };

    fetchData();
  }, [category]);

  return (
    <>
      {posts && posts.length > 0 ? (
        posts.map((post, index) => (
          <Grid item lg={3} sm={4} xs={12} key={index}>
            <Link
              to={`details/${post._id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Post post={post} />
            </Link>
          </Grid>
        ))
      ) : (
        <Box style={{ color: '#878787', margin: '30px 80px', fontSize: 18 }}>
          No data available to display.
        </Box>
      )}
    </>
  );
};

export default Posts;
