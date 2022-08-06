import onChange from 'on-change';
import _ from 'lodash';

const renderForm = (watchedState, elements, i18) => {
  switch (watchedState.status) {
    case ('invalid'):
      elements.input.classList.add('is-invaid');
      elements.feedback.className = 'text-danger';
      elements.feedback.textContent = i18.t(watchedState.error);
      elements.input.focus();
      break;

    case ('start'):
      elements.input.readOnly = true;
      elements.button.disabled = true;
      break;

    case ('success'):
      elements.input.value = '';
      elements.input.classList.remove('is-invalid');
      elements.input.readOnly = false;
      elements.input.focus();
      elements.button.disabled = false;
      elements.feedback.className = 'text-success';
      elements.feedback.textContent = i18.t('success');
      break;

    case ('failure'):
      elements.input.classList.add('is-invalid');
      elements.input.readOnly = false;
      elements.input.focus();
      elements.button.disabled = false;
      elements.feedback.className = 'text-danger';
      elements.feedback.textContent = i18.t(watchedState.error);
      break;

    default:
      throw new Error(`${watchedState.status} - undefined status!`);
  }
};

const makeWatchedstate = (state, elements, i18) => {
  const watchedState = onChange(state, (path) => {
    if (path === 'status') renderForm(watchedState, elements, i18);
  });
  return watchedState;
};

export default makeWatchedstate;
