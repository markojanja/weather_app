/* eslint-disable no-param-reassign */
import handlers from './handlers';

const errors = (() => {
  function handleInputError(dom, message) {
    dom.error.textContent = message;
    handlers.hideElements([dom.loader, dom.main, dom.week]);
    handlers.showElements([dom.error]);
    dom.toggleBtn.disabled = true;
    dom.form.reset();
  }
  return { handleInputError };
})();
export default errors;
