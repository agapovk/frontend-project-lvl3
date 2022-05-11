/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */

const buildButton = (post, i18nInstance) => {
  const { id } = post;
  const btn = document.createElement('button');
  btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  btn.setAttribute('type', 'button');
  btn.setAttribute('data-id', id);
  btn.setAttribute('data-bs-toggle', 'modal');
  btn.setAttribute('data-bs-target', '#modal');
  // btn.setAttribute("aria-label", i18nInstance.t("button"));
  btn.textContent = 'Просмотр';

  return btn;
};

const buildListItem = (post) => {
  const { title, link, id, isViewed } = post;
  const li = document.createElement('li');
  li.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
    'p-2'
  );

  const itemLink = document.createElement('a');

  isViewed
    ? itemLink.classList.add('fw-normal', 'link-secondary')
    : itemLink.classList.add('fw-bold');

  itemLink.setAttribute('href', link);
  itemLink.setAttribute('data-id', id);
  itemLink.setAttribute('target', '_blank');
  // itemLink.setAttribute("rel", "noopener noreferrer");
  itemLink.textContent = title;
  li.append(itemLink);

  return li;
};

export default (state, elements, i18nInstance) => {
  const { postsCont } = elements;
  const { posts } = state;

  postsCont.innerHTML = '';

  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('h3', 'p-2');
  postsTitle.textContent = i18nInstance.t('postsTitle');
  postsCont.append(postsTitle);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  const liElements = posts.map((post) => {
    const li = buildListItem(post);

    const btn = buildButton(post, i18nInstance);
    li.append(btn);

    return li;
  });

  liElements.forEach((li) => ul.append(li));

  postsCont.append(ul);
};
