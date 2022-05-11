/* eslint-disable no-param-reassign */
import _ from 'lodash';

import parser from './parser.js';
import getFeed from './getFeed.js';

export default (watchedState) => {
  const requests = watchedState.feeds.map((feed) => getFeed(feed.link));

  return Promise.all(requests).then((data) =>
    data.forEach((feed) => {
      const { posts } = parser(feed.data.contents);
      const newPosts = _.differenceBy(posts, watchedState.posts, 'link');

      const newPostsWithId = newPosts.map((newPost) => ({
        ...newPost,
        id: _.uniqueId(),
        feedId: feed.id,
      }));

      const newPostsToAdd = [...newPostsWithId, ...watchedState.posts];
      watchedState.posts = newPostsToAdd;
  	}));
};
