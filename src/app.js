import "bootstrap/dist/css/bootstrap.min.css";
import * as yup from "yup";
import onChange from "on-change";
import i18next from "i18next";

import view from "./view";
import ru from "./locales/ru";
import parseRSS from "./parser";
import _ from "lodash";

i18next.init({
  lng: "ru",
  debug: true,
  resources: {
    ru,
  },
});

const schema = yup.string().required().url(i18next.t("urlErr"));

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

  const watchedState = onChange(state, (path, value) => {
    console.dir(state);
    view(state, elements);
  });

  // download RSS
  const fetchRss = (url) => {
    fetch(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
        url
      )}`
    )
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(i18next.t("netErr"));
      })
      .then((data) => parseRSS(state, data.contents))
      .then(({ feed, posts }) => {
        watchedState.feeds.push(feed);
        const newPosts = [...state.posts, ...posts];
        watchedState.posts = newPosts;
      })
      .catch((err) => {
        watchedState.rssForm.isError = true;
        watchedState.rssForm.feedback = err.message;
      });
  };
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
    schema
      .validate(input.value)
      .then((result) => {
        fetchRss(result);
      })
      .then((data) => {
        console.log("data " + data);
        watchedState.rssForm.feedback = i18next.t("done");
        watchedState.rssForm.isError = false;
      })
      .catch((err) => {
        watchedState.rssForm.isError = true;
        watchedState.rssForm.feedback = err.message;
      });

    // clear input and focus
    input.value = "";
    input.focus();
  });
};
