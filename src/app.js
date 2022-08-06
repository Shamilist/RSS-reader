import * as yup from 'yup';
import i18next from 'i18next';
import translation from './locales/ru.js';
import axios from 'axios';
import makeWatchedstate from './view';

export default (i18) => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    button: document.querySelector('[type="submit"]'),
    feedback: document.getElementById('feedback'),
    modalTitle: document.getElementById('modal-title'),
    modalBody: document.getElementById('modal-body'),
    modalLink: document.getElementById('modal-link'),
    posts: document.getElementById('posts'),
    content: document.getElementById('content'),
    feeds: document.getElementById('feeds'),
  };

  const state = {
    status: 'init',
    feeds: [],
    posts: [],
    error: '',
  };

  const watchedState = makeWatchedstate(state, elements, i18);

  yup.setLocale({
    mixed: {
      required: () => 'required',
      notOneOf: () => 'notOneOf',
    },
    string: {
      url: () => 'url',
    },
  });



  
};

const runApp = () => {
    const i18nextInstance = i18next.createInstance();
    i18nextInstance
      .init({
        lng: 'ru',
        resources: {
          ru: {
            translation,
          },
        },
      })
      .then(() => {
        app(i18nextInstance);
      });
  };
  
  export default runApp;
  