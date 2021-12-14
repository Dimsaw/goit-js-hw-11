const axios = require('axios').default;

const API_KEY = '24793371-9eea329880a97afb5c057777f';
const BASE_URL = 'https://pixabay.com/api/';

export default class NewPixabayAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchArticles() {
    const option = {
      params: {
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: this.page,
      },
    };

    try {
      const image = await axios.get(BASE_URL, option);

      this.incrementPage();
      const result = image.data;
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
