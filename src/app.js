/* eslint-disable no-unused-expressions */
import * as yup from 'yup';
import i18next from 'i18next';
import _ from 'lodash';

import getWatchedState from './view.js';
import ru from './locales/ru.js';
import parseRSS from './parser.js';
import getFeed from './getFeed.js';
import loadPosts from './loadPosts.js';

const i18nInstance = i18next.createInstance();
i18nInstance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

const validate = (currentUrl, links) => {
  const schema = yup
    .string()
    .url(i18nInstance.t('urlErr'))
    .notOneOf(links, i18nInstance.t('exist'));
  return schema.validateSync(currentUrl);
};

const updatePosts = (watchedState) => {
  setTimeout(() => {
    loadPosts(watchedState).finally(() => updatePosts(watchedState));
  }, 5000);
};

export default () => {
  const state = {
    posts: [],
    feeds: [],
    rssForm: {
      inputText: '',
      feedback: '',
      isError: false,
      isInputDisabled: false,
    },
    modal: {
      modalPostId: null,
    },
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    examples: document.querySelectorAll('.example'),
    postsDiv: document.querySelector('.posts'),
    postsCont: document.querySelector('.postsContainer'),
    feedsDiv: document.querySelector('.feeds'),
    modalTitle: document.querySelector('.modal-title'),
    modalDescription: document.querySelector('.modal-description'),
    modalLinkToPost: document.querySelector('.full-article'),
    mainButton: document.querySelector('#main-button'),
  };

  const watchedState = getWatchedState(state, elements, i18nInstance);

  const {form, input, examples, postsDiv} = elements;

  // easy paste link to input
  examples.forEach((example) => {
    example.addEventListener('click', () => {
      input.value = example.textContent;
    });
  });

  // form listener
  // if (form)
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const currentUrl = formData.get('url').trim();

    watchedState.rssForm.isInputDisabled = true;
    watchedState.rssForm.feedback = '';

    // validate input
    try {
      validate(
        currentUrl,
        state.feeds.map((feed) => feed.link),
      );
    } catch (err) {
      watchedState.rssForm.isInputDisabled = false;
      watchedState.rssForm.isError = true;
      watchedState.rssForm.feedback = err.message;
      input.value = '';
      input.focus();
      return;
    }

    getFeed(currentUrl)
      .then(({ data }) => parseRSS(data.contents, i18nInstance))
      .then(({ feed, posts }) => {
        const feedId = _.uniqueId('feed_');
        const feedWithId = {
          ...feed,
          id: feedId,
          link: currentUrl,
        };

        const posstsWithId = posts.map((post) => ({
          ...post,
          id: _.uniqueId('post_'),
          feedId,
        }));

        const newFeeds = [feedWithId, ...watchedState.feeds];
        const newPosts = [...posstsWithId, ...watchedState.posts];

        watchedState.feeds = newFeeds;
        watchedState.posts = newPosts;

        watchedState.rssForm.isError = false;
        watchedState.rssForm.feedback = i18nInstance.t('done');
      })
      .catch((err) => {
        watchedState.rssForm.isError = true;
        err.isAxiosError
          ? (watchedState.rssForm.feedback = i18nInstance.t('netErr'))
          : (watchedState.rssForm.feedback = err.message);
      })
      .finally(() => {
        watchedState.rssForm.isInputDisabled = false;
        input.value = '';
        input.focus();
      });
  });

  updatePosts(watchedState);

  // if (postsDiv)
  postsDiv?.addEventListener('click', (e) => {
    const { target } = e;
    const btnId = target.dataset.id; // select <a> or <btn> with 'data-id' attribute

    if (btnId) {
      watchedState.modal.modalPostId = btnId;
      const currentPostIndex = watchedState.posts.findIndex(
        (post) => post.id === btnId,
      );
      watchedState.posts[currentPostIndex].isViewed = true;
    }
  });
};
