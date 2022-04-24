import renderFeeds from "./renders/feeds";
import renderPosts from "./renders/posts";
import renderFeedback from "./renders/feedback";

export default (state, elements) => {
  console.log(state);

  // Feedback
  renderFeedback(state, elements);

  // Feeds
  renderFeeds(state, elements);

  // Posts
  renderPosts(state, elements);
};
