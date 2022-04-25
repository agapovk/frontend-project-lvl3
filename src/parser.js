import i18next from "i18next";

export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "application/xml");
  const items = doc.querySelectorAll("item");
  const error = doc.querySelector("parsererror");

  if (error) throw new Error(i18next.t("rssErr"));
  else {
    const feed = {
      title: doc.querySelector("title").textContent,
      description: doc.querySelector("description").textContent,
    };

    const posts = [];
    items.forEach((item) => {
      posts.push({
        title: item.querySelector("title").textContent,
        description: item.querySelector("description").textContent,
        link: item.querySelector("link").textContent,
        isViewed: false,
      });
    });

    const result = {
      feed,
      posts,
    };

    return result;
  }
};
