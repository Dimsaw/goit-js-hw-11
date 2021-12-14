// Описан в документации
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
// import axios from 'axios';
const axios = require('axios').default;

import cardOfImage from '../src/templates/articles.hbs';
import NewPixabayAPI from './js/pixabay';

const input = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

input.addEventListener('submit', sumbitForm);
// loadMore.addEventListener('click');

const pixabayAPI = new NewPixabayAPI();

async function sumbitForm(e) {
  e.preventDefault();

  pixabayAPI.searchQuery = e.currentTarget.elements.searchQuery.value;
  //   console.log(pixabayAPI.searchQuery);
  if (pixabayAPI.searchQuery !== '') {
    const image = await pixabayAPI.fetchArticles();
    renderImages(image);
  } else {
    Notiflix.Notify.info('Sorry, there is input empty. Please try again');
    clearContainer();
  }
}

function renderImages(result) {
  if (result.totalHits === 0) {
    clearContainer();
    Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again');
  }

  const markup = cardOfImage(result);
  gallery.insertAdjacentHTML('afterbegin', markup);
}

function clearContainer() {
  gallery.innerHTML = '';
}
