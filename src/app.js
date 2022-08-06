import * as yup from 'yup';
import i18next from 'i18next';
import translation from './locales/ru.js';
import axios from 'axios';
import makeWatchedstate from './view';

export default (i18next) => {
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
};
