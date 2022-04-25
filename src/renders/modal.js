export default (state, elements) => {
  const { modal, posts } = state;
  const { modalTitle, modalDescription, modalLinkToPost } = elements;

  modalTitle.innerHTML = "";
  modalDescription.innerHTML = "";

  const currentPost = posts.find((post) => post.id === modal.modalPostId);

  modalTitle.textContent = currentPost.title;
  modalDescription.textContent = currentPost.description;
  modalLinkToPost.setAttribute("href", currentPost.link);
};
