// Описан в документации
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
// import axios from 'axios';
const axios = require('axios').default;

import cardOfImage from '../src/templates/articles.hbs';
import NewPixabayAPI from './js/pixabay';
// import './css/style.css';

import { input, gallery } from './js/refs';
import LoadMoreBtn from '../src/js/btn';

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

  //   console.log(pixabayAPI.searchQuery);

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
}

function renderImages(image) {
  if (image.totalHits === 0) {
    loadMoreBtn.hide();
    clearContainer();
    loadMoreBtn.hide();
    Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again');
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
  pixabayAPI.endImages();
}
