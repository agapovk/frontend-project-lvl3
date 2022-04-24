import i18next from "i18next";

const buildButton = ({ id }) => {
  const btn = document.createElement("button");
  btn.classList.add("btn", "btn-outline-primary", "btn-sm");
  btn.setAttribute("type", "button");
  // btn.setAttribute("data-id", id);
  // btn.setAttribute("data-bs-toggle", "modal");
  // btn.setAttribute("data-bs-target", "#modal");
  btn.textContent = i18next.t("button");

  return btn;
};

const buildListItem = (state, { title, link, id }) => {
  const li = document.createElement("li");
  li.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-start",
    "border-0",
    "border-end-0",
    "p-2"
  );
  const itemLink = document.createElement("a");

  // if (state.posts.postsReadList.has(id)) {
  //   itemLink.classList.add("fw-normal", "link-secondary");
  // } else {
  //   itemLink.classList.add("fw-bold");
  // }

  itemLink.setAttribute("href", link);
  itemLink.setAttribute("data-id", id);
  // itemLink.setAttribute("target", "_blank");
  // itemLink.setAttribute("rel", "noopener noreferrer");
  itemLink.textContent = title;
  li.append(itemLink);

  return li;
};

export default (state, { postsDiv }) => {
  const { posts } = state;
  postsDiv.innerHTML = "";

  const postsTitle = document.createElement("h2");
  postsTitle.classList.add("h3", "p-2");
  postsTitle.textContent = i18next.t("postsTitle");
  postsDiv.append(postsTitle);

  const ul = document.createElement("ul");
  ul.classList.add("list-group", "border-0", "rounded-0");

  const liElements = posts.map((post) => {
    const li = buildListItem(state, post);

    const btn = buildButton(post);
    li.append(btn);

    return li;
  });

  ul.append(...liElements);
  postsDiv.append(ul);
};
