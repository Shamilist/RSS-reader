import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import translation from '../locales/ru.js';
import makeWatchedstate from './view.js';
import rssParser from './parser.js';

const getProxiedUrl = (url) => {
  const proxiedUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxiedUrl.searchParams.set('disableCache', 'true');
  proxiedUrl.searchParams.set('url', url);
  return proxiedUrl;
};

const addNewPosts = (posts, watchedState, feedId) => {
  posts.forEach((post) => {
    const param = _.findIndex(watchedState.posts, (prePost) => post.link === prePost.link);
    if (param === -1) {
      post.feedId = feedId;
      post.id = watchedState.posts.length;
      watchedState.posts.push(post);
    }
  });
};

const uploadNewFeed = (url, watchedState) => {
  watchedState.status = 'start';
  const proxiedUrl = getProxiedUrl(url);
  axios.get(proxiedUrl).then((response) => {
    const { feedInfo, posts } = rssParser(response);

    feedInfo.url = url;
    feedInfo.id = watchedState.feeds.length;
    watchedState.feeds.push(feedInfo);

    addNewPosts(posts, watchedState, feedInfo.id);
    watchedState.status = 'success';
  })
    .catch((error) => {
      switch (error.message) {
        case ('Network Error'):
          watchedState.error = 'network';
          break;

        case ('Parsing Error'):
          watchedState.error = 'parsing';
          break;

        default:
          watchedState.error = 'unknown';
          break;
      }
      watchedState.status = 'failure';
    });
};

const postsUploading = (watchedState) => {
  const renewPeriod = 5000;

  const promises = watchedState.feeds.map((feed) => {
    const proxiedUrl = getProxiedUrl(feed.url);
    return axios.get(proxiedUrl);
  });
  Promise.allSettled(promises).then((responses) => {
    responses.forEach((response, index) => {
      if (response.status === 'fulfilles') {
        const { posts } = rssParser(response.value);
        const feedID = watchedState.feeds[index].id;
        addNewPosts(posts, watchedState, feedID);
      }
    });
  }).finally(() => {
    setTimeout(() => postsUploading(watchedState), renewPeriod);
  });
};

const app = (i18) => {
  const elements = {
    form: document.getElementById('form-rss'),
    input: document.getElementById('url'),
    button: document.getElementById('add'),
    feedback: document.getElementById('feedback'),
    modalTitle: document.getElementById('modal-title'),
    modalBody: document.getElementById('modal-body'),
    modalLink: document.getElementById('modal-link'),
    posts: document.getElementById('posts'),
    content: document.getElementById('content'),
    feeds: document.getElementById('feeds'),
  };

  const state = {
    status: 'initialization',
    feeds: [],
    posts: [],
    error: '',
    uiState: {
      viewedPosts: new Set(),
      postId: null,
    }
  };

  yup.setLocale({
    mixed: {
      required: () => 'required',
      notOneOf: () => 'notOneOf',
    },
    string: {
      url: () => 'url',
    },
  });

  const watchedState = makeWatchedstate(state, elements, i18);

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.status = 'initialization';
    const inputValue = elements.input.value;
    const feedsUrl = watchedState.feeds.map((feed) => feed.url);
    const schema = yup.string().url().required().notOneOf(feedsUrl);

    schema
      .validate(inputValue)
      .then((value) => {
        uploadNewFeed(value, watchedState);
      })
      .catch((validateError) => {
        const { errors } = validateError;
        [watchedState.error] = errors;
        watchedState.status = 'invalid';
      });
  });
  postsUploading(watchedState);
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
