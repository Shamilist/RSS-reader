import * as yup from 'yup';
import i18next from 'i18next';
import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';

export default () => {
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
    status: '',
    feeds: [],
    posts: [],
    error: '',
  };
};
