import "bootstrap/dist/css/bootstrap.min.css";
import * as yup from "yup";
import i18next from "i18next";
import _ from "lodash";

import getWatchedState from "./view.js";
import ru from "./locales/ru.js";
import parseRSS from "./parser.js";
import getFeed from "./getFeed.js";
import loadPosts from "./loadPosts.js";

i18next.init({
  lng: "ru",
  debug: true,
  resources: {
    ru,
  },
});

const validate = (currentUrl, links) => {
  const schema = yup
    .string()
    .url(i18next.t("urlErr"))
    .notOneOf(links, i18next.t("exist"));
  return schema.validateSync(currentUrl);
};

const updatePosts = (watchedState) => {
  setTimeout(() => {
    loadPosts(watchedState).finally(() => updatePosts(watchedState));
  }, 5000);
};

const elements = {
  form: document.querySelector(".rss-form"),
  input: document.querySelector("#url-input"),
  feedback: document.querySelector(".feedback"),
  examples: document.querySelectorAll(".example"),
  postsDiv: document.querySelector(".posts"),
  feedsDiv: document.querySelector(".feeds"),
  modalTitle: document.querySelector(".modal-title"),
  modalDescription: document.querySelector(".modal-description"),
  modalLinkToPost: document.querySelector(".full-article"),
};

export default () => {
  const state = {
    posts: [],
    feeds: [],
    rssForm: {
      inputText: "",
      feedback: "",
      isError: false,
    },
    modal: {
      modalPostId: null,
    },
  };

  const watchedState = getWatchedState(state, elements);

  const { form, input, examples, postsDiv } = elements;

  // easy paste link to input
  examples.forEach((example) => {
    example.addEventListener("click", () => {
      input.value = example.textContent;
    });
  });

  // form listener
  if (form)
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const currentUrl = input.value;

      watchedState.rssForm.feedback = "";
      input.value = "";
      input.focus();

      // validate input
      try {
        validate(
          currentUrl,
          state.feeds.map((feed) => feed.link)
        );
      } catch (err) {
        watchedState.rssForm.isError = true;
        watchedState.rssForm.feedback = err.message;
        return;
      }

      getFeed(currentUrl)
        .then(({ data }) => parseRSS(data.contents))
        .then(({ feed, posts }) => {
          const feedId = _.uniqueId("feed_");
          const feedWithId = {
            ...feed,
            id: feedId,
            link: currentUrl,
          };

          const posstsWithId = posts.map((post) => ({
            ...post,
            id: _.uniqueId("post_"),
            feedId,
          }));

          const newFeeds = [feedWithId, ...watchedState.feeds];
          const newPosts = [...posstsWithId, ...watchedState.posts];

          watchedState.feeds = newFeeds;
          watchedState.posts = newPosts;

          watchedState.rssForm.isError = false;
          watchedState.rssForm.feedback = i18next.t("done");
        })
        .catch((err) => {
          watchedState.rssForm.isError = true;
          watchedState.rssForm.feedback = err.message;
        });
    });

  updatePosts(watchedState);

  if (postsDiv)
    postsDiv.addEventListener("click", (e) => {
      const { target } = e;
      const btnId = target.dataset.id; // select <a> or <btn> with "data-id" attribute

      if (btnId) {
        watchedState.modal.modalPostId = btnId;
        const currentPostIndex = watchedState.posts.findIndex(
          (post) => post.id === btnId
        );
        watchedState.posts[currentPostIndex].isViewed = true;
      }
    });
};
