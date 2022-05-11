/* eslint-disable no-param-reassign */

export default (state, elements, i18nInstance) => {
  const { feeds } = state;
  const { feedsDiv } = elements;
  feedsDiv.innerHTML = '';

  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('h3', 'p-2');
  feedsTitle.textContent = i18nInstance.t('feedsTitle');
  feedsDiv.append(feedsTitle);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  const liElements = feeds.map(({ title, description }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0', 'p-2');

    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = title;

    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedDescription.textContent = description;

    li.append(feedTitle, feedDescription);
    return li;
  });

  ul.append(...liElements);

  feedsDiv.append(ul);
};
