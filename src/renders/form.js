/* eslint-disable no-unused-expressions */
export default (state, elements) => {
  const { rssForm } = state;
  const { input, mainButton } = elements;

  rssForm.isInputDisabled
    ? (input.setAttribute('readonly', 'true'),
    mainButton.setAttribute('disabled', 'disabled'))
    : (input.removeAttribute('readonly', 'true'),
    mainButton.removeAttribute('disabled', 'disabled'));
};
