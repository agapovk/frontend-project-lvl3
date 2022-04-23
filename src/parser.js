import i18next from "i18next";
import _ from "lodash";

export default (state, data) => {
  const checkFeedExist = (newFeed) => {
    const exist = state.feeds.filter((feed) => feed.link === newFeed);
    if (exist.length === 0) return false;
    else return true;
  };

  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "application/xml");
  const items = doc.querySelectorAll("item");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) throw new Error(i18next.t("rssErr"));
  else {
    const feed = {
      id: _.uniqueId("feed_"),
      link: doc.querySelector("link").textContent,
      title: doc.querySelector("title").textContent,
      description: doc.querySelector("description").textContent,
    };

    if (checkFeedExist(feed.link)) throw new Error(i18next.t("exist"));

    const posts = [];
    items.forEach((item) => {
      posts.push({
        id: _.uniqueId("post_"),
        feedId: feed.id,
        title: item.querySelector("title").textContent,
        description: item.querySelector("description").textContent,
        link: item.querySelector("link").textContent,
      });
    });

    const result = {
      feed,
      posts,
    };

    return result;
  }
};
