import "bootstrap/dist/css/bootstrap.min.css";
import * as yup from "yup";
import onChange from "on-change";
import i18next from "i18next";
import _ from "lodash";

import view from "./view";
import ru from "./locales/ru";
import parseRSS from "./parser";
import getFeed from "./getFeed";

i18next.init({
  lng: "ru",
  debug: true,
  resources: {
    ru,
  },
});

const validate = (url, links) => {
  const schema = yup.string().url(i18next.t("urlErr")).notOneOf(links);
  return schema.validateSync(url);
};

const elements = {
  form: document.querySelector(".rss-form"),
  input: document.querySelector("#url-input"),
  feedback: document.querySelector(".feedback"),
  examples: document.querySelectorAll(".example"),
  postsDiv: document.querySelector(".posts"),
  feedsDiv: document.querySelector(".feeds"),
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
  };

  const updatePosts = (state) => {
    console.log("update!");
    setTimeout(() => {
      updatePosts(state);
    }, 5000);
  };

  const watchedState = onChange(state, (path, value) => {
    // console.dir(state);
    view(state, elements);
  });

  const { form, input, examples, feedback } = elements;

  // easy paste link to input
  examples.forEach((example) => {
    example.addEventListener("click", (e) => {
      input.value = example.textContent;
    });
  });

  // form listener
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    feedback.textContent = "";

    // validate input
    try {
      validate(
        input.value,
        state.feeds.map((feed) => feed.link)
      );
    } catch (err) {
      console.error(err.message);
      watchedState.rssForm.isError = true;
      watchedState.rssForm.feedback = err.message;
      return;
    }

    getFeed(input.value)
      .then(({ data }) => parseRSS(state, data.contents))
      .then(({ feed, posts }) => {
        watchedState.feeds.push(feed);
        const newPosts = [...state.posts, ...posts];
        watchedState.posts = newPosts;

        watchedState.rssForm.feedback = i18next.t("done");
        watchedState.rssForm.isError = false;
      })
      .catch((err) => {
        watchedState.rssForm.isError = true;
        watchedState.rssForm.feedback = err.message;
        return;
      });

    updatePosts(state);

    // clear input and focus
    input.value = "";
    input.focus();
  });
};
