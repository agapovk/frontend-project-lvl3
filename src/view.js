import onChange from "on-change";

import renderFeeds from "./renders/feeds";
import renderPosts from "./renders/posts";
import renderFeedback from "./renders/feedback";
import renderModal from "./renders/modal";

export default (state, elements) => {
  const watchedState = onChange(state, (path, currentValue) => {
    console.log("path: " + path + " , value: " + currentValue);
    // Feedback
    if (path === "rssForm.feedback") renderFeedback(state, elements);

    // Feeds
    if (path === "feeds") renderFeeds(state, elements);

    // Posts
    if (state.posts.length > 0) renderPosts(state, elements);

    // Modal
    if (path === "modal.modalPostId") renderModal(state, elements);
  });

  return watchedState;
};
