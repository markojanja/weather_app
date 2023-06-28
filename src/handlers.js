const handlers = (() => {
  function hideElements(arr) {
    arr.forEach((element) => {
      element.classList.add('hide');
    });
  }

  function showElements(arr) {
    arr.forEach((element) => element.classList.remove('hide'));
  }
  return { hideElements, showElements };
})();

export default handlers;
