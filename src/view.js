/* eslint-disable no-unused-vars */
import onChange from 'on-change';

import renderFeeds from './renders/feeds.js';
import renderPosts from './renders/posts.js';
import renderFeedback from './renders/feedback.js';
import renderModal from './renders/modal.js';
import renderForm from './renders/form.js';

export default (state, elements, i18nInstance) => {
  const watchedState = onChange(state, (path, currentValue) => {
    // console.log(`path: ${path} , value: ${currentValue}`);

    // Input and button
    if (path === 'rssForm.isInputDisabled') renderForm(state, elements);

    // Feedback
    if (path === 'rssForm.feedback') renderFeedback(state, elements);

    // Feeds
    if (path === 'feeds') renderFeeds(state, elements, i18nInstance);

    // Posts and Modal
    if (state.posts.length > 0) renderPosts(state, elements, i18nInstance);

    // Modal
    if (path === 'modal.modalPostId') renderModal(state, elements);
  });

  return watchedState;
};
