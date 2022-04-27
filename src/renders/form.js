/* eslint-disable no-unused-expressions */
export default (state, elements) => {
  const { rssForm } = state;
  const { input, mainButton } = elements;

  rssForm.isInputDisabled
    ? (input.setAttribute("disabled", "disabled"),
      mainButton.setAttribute("disabled", "disabled"))
    : (input.removeAttribute("disabled", "disabled"),
      mainButton.removeAttribute("disabled", "disabled"));
};
