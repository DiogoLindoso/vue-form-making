import Vue from 'vue'
import Router from 'vue-router'

import Home from '../demo/Home.vue'
import ReviewDemo from '../demo/ReviewDemo.vue'
import LanguageView from './LanguageView.vue'

Vue.use(Router)

const language = localStorage.getItem('language') || (navigator.language == 'pt-BR' ? 'pt-BR':'en-US')
export default new Router({
  routes: [
    {
      path: '/',
      redirect: to => ({name: 'index', params: {lang: language}})
    },
    {
      path: '/:lang',
      // name: 'lang',
      component: LanguageView,
      children: [
        {
          path: '',
          name: 'index',
          component: Home
        },
        {
          path: 'review',
          name: 'review',
          component: ReviewDemo
        }
      ]
    }
  ]
})