import onChange from 'on-change';
import _ from 'lodash';

const renderForm = (watchedState, elements, i18) => {
  switch (watchedState.status) {
    case ('invalid'):
      elements.input.classList.add('is-invalid');
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
      elements.button.disabled = false;
      elements.feedback.className = 'text-success';
      elements.feedback.textContent = i18.t('success');
      elements.input.focus();
      break;
    case ('failure'):
      elements.input.classList.add('is-invalid');
      elements.input.readOnly = false;
      elements.button.disabled = false;
      elements.feedback.className = 'text-danger';
      elements.feedback.textContent = i18.t(watchedState.error);
      elements.input.focus();
      break;
    default:
      console.log('Status not recognized');
  }
};

const renderFeeds = (watchedState, elements) => {
  elements.content.classList.remove('d-none');
  elements.feeds.innerHTML = '';

  watchedState.feeds.forEach((feed) => {
    const titleEl = document.createElement('p');
    titleEl.classList.add('fw-bold', 'mb-0');
    titleEl.textContent = feed.title;

    const descriptionEl = document.createElement('p');
    descriptionEl.textContent = feed.description;

    elements.feeds.append(titleEl, descriptionEl);
  });
};

const renderPosts = (watchedState, elements, i18n) => {
  const sortedPosts = _.reverse(_.sortBy(watchedState.posts, (o) => Date.parse(o.timemark)));
  elements.posts.innerHTML = '';
  sortedPosts.forEach((post) => {
    const link = document.createElement('a');
    if (watchedState.uiState.viewedPosts.has(post.id)) {
      link.classList.add('fw-normal');
    } else {
      link.classList.add('fw-bold');
    }
    link.textContent = post.title;
    link.href = post.link;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18n.t('show');

    button.addEventListener('click', () => {
      watchedState.uiState.viewedPosts.add(post.id);
      watchedState.uiState.postId = post.id;
    });

    const div = document.createElement('div');
    div.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'mb-3');
    div.setAttribute('rel', 'noopener norefferer');
    div.setAttribute('target', '_blank');
    div.append(link, button);
    elements.posts.append(div);
  });
};

const renderModal = (watchedState, elements) => {
  const post = watchedState.posts.find((item) => item.id === watchedState.uiState.postId);
  elements.modalTitle.textContent = post.title;
  elements.modalBody.textContent = post.description;
  elements.modalLink.href = post.link;
};

const makeWatchedstate = (state, elements, i18) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case ('status'): renderForm(watchedState, elements, i18);
        break;
      case ('feeds'): renderFeeds(watchedState, elements);
        break;
      case ('uiState.postId'): renderModal(watchedState, elements);
        renderPosts(watchedState, elements, i18);
        break;
      case ('posts'): renderPosts(watchedState, elements, i18);
        break;
      default: console.log('Path is not recognized');
    }
  });
  return watchedState;
};

export default makeWatchedstate;
