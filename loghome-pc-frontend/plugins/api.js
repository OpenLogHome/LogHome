import Vue from 'vue'

// 拆分自动生成
import novels from './api/novels.js';
import search from './api/search.js';
import articles from './api/articles.js';
import statistics from './api/statistics.js';
import community from './api/community.js';
import bookcase from './api/bookcase.js';
import worlds from './api/worlds.js';
import library from './api/library.js';
import treePlant from './api/treePlant.js';
import resources from './api/resources.js';
import users from './api/users.js';
import essays from './api/essays.js';

const apiService = {
  novels,
  search,
  articles,
  statistics,
  community,
  bookcase,
  worlds,
  library,
  treePlant,
  resources,
  users,
  essays,
};

export default ({ app }, inject) => {
  inject('api', apiService)
}

Vue.prototype.$api = apiService