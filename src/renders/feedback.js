/* eslint-disable no-unused-expressions */
export default (state, elements) => {
  const { rssForm } = state;
  const { feedback, input } = elements;

  rssForm.isError
    ? (input.classList.add('is-invalid'),
    feedback.classList.add('text-danger'),
    feedback.classList.remove('text-success'))
    : (input.classList.remove('is-invalid'),
    feedback.classList.add('text-success'),
    feedback.classList.remove('text-danger'));

  feedback.textContent = rssForm.feedback;
};
