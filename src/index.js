import './css/style.css';

import cardOfImage from '../src/templates/articles.hbs';
import NewPixabayAPI from './js/pixabay';

import { input, gallery } from './js/refs';
import LoadMoreBtn from '../src/js/btn';

import Notiflix from 'notiflix';
// import axios from 'axios';
const axios = require('axios').default;

// Описан в документации
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

const loadMoreBtn = new LoadMoreBtn({ selector: '[data-action="load-more"]', hidden: true });
const pixabayAPI = new NewPixabayAPI();

input.addEventListener('submit', sumbitForm);
loadMoreBtn.refs.button.addEventListener('click', loadMoreImages);

async function sumbitForm(e) {
  e.preventDefault();

  pixabayAPI.searchQuery = e.currentTarget.elements.searchQuery.value;
  pixabayAPI.resetPage();
  clearContainer();
  loadMoreBtn.show();
  loadMoreBtn.disable();

  if (pixabayAPI.searchQuery !== '') {
    const image = await pixabayAPI.fetchArticles();
    renderImages(image);
    loadMoreBtn.enable();
    const totalHits = image.totalHits;
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
  } else {
    Notiflix.Notify.info('Sorry, there is input empty. Please try again');
    clearContainer();
    loadMoreBtn.hide();
  }
  simpleLight();
}

function renderImages(image) {
  if (image.totalHits === 0) {
    loadMoreBtn.hide();
    clearContainer();
    loadMoreBtn.hide();
    return Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again',
    );
  } else if (image.hits.length < 40 && image.hits.length >= 1) {
    const markup = cardOfImage(image);
    gallery.insertAdjacentHTML('beforeend', markup);
    loadMoreBtn.hide();
  } else {
    const markup = cardOfImage(image);
    gallery.insertAdjacentHTML('beforeend', markup);
  }
}

function clearContainer() {
  gallery.innerHTML = '';
}

async function loadMoreImages() {
  loadMoreBtn.disable();
  const image = await pixabayAPI.fetchArticles();
  renderImages(image);
  loadMoreBtn.enable();
  scroll();
  simpleLight();
  finishOfImages(image);
}

function scroll() {
  const { height: cardHeight } = input.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function finishOfImages(image) {
  if (
    pixabayAPI.page === 1 + Math.ceil(image.totalHits / pixabayAPI.per_page) ||
    (image.hits.length < 40 && image.hits.length >= 1)
  ) {
    loadMoreBtn.hide();
    return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}

function simpleLight() {
  const galerry = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
}
