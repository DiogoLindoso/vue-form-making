import VueI18n from 'vue-i18n'
import 'normalize.css/normalize.css'

import MakingForm from './components/Container.vue'
import GenerateForm from './components/GenerateForm.vue'
import ReviewForm from './components/Review/ReviewForm.vue'
import ElementUI from 'element-ui'
import VueEditor from 'vue2-editor'
import enUS from './lang/en-US'
import zhCN from './lang/zh-CN'
import ptBR from './lang/pt-BR'

import './iconfont/iconfont.css'
import './styles/cover.scss'
import './styles/index.scss'

const loadLang = function (Vue, lang, locale, i18n) {
  if (locale) {
    locale('en-US', {...locale('en-US'), ...enUS})
    locale('zh-CN', {...locale('zh-CN'), ...zhCN})
    locale('pt-BR', {...locale('pt-BR'), ...ptBR})
    Vue.config.lang = lang
  } else if (i18n) {
    i18n.setLocaleMessage('en-US', {...i18n.messages['en-US'], ...enUS})
    i18n.setLocaleMessage('zh-CN', {...i18n.messages['zh-CN'], ...zhCN})
    i18n.setLocaleMessage('pt-BR', {...i18n.messages['pt-BR'], ...ptBR})
    i18n.locale = lang
  } else {
    Vue.use(VueI18n)
    const localI18n = new VueI18n({
      locale: lang,
      messages: {
        'en-US': {...enUS},
        'zh-CN': {...zhCN},
        'pt-BR': {...ptBR},
      }
    })

    const init = Vue.prototype._init
    Vue.prototype._init = function (options) {
      init.call(this, {
        i18n: localI18n,
        ...options
      })
    }
  }
}

MakingForm.install = function (Vue, opts = {
  lang: 'pt-BR',
  locale: null,
  i18n: null
}) {
  loadLang(Vue, opts.lang, opts.locale, opts.i18n)
  Vue.component(MakingForm.name, MakingForm)
  Vue.use(ElementUI, { 
    size: 'small',
    i18n: (key, value) => i18n.t(key, value)
  })
  Vue.use(VueEditor)
}

GenerateForm.install = function (Vue, opts = {
  lang: 'pt-BR',
  locale: null,
  i18n: null
}) {
  loadLang(Vue, opts.lang, opts.locale, opts.i18n)
  Vue.component(GenerateForm.name, GenerateForm)
  Vue.use(ElementUI, { 
    size: 'small',
    i18n: (key, value) => i18n.t(key, value)
  })
  Vue.use(VueEditor)
}

ReviewForm.install = function (Vue, opts = {
  lang: 'pt-BR',
  locale: null,
  i18n: null
}) {
  loadLang(Vue, opts.lang, opts.locale, opts.i18n)
  Vue.component(ReviewForm.name, ReviewForm)
  Vue.use(ElementUI, { 
    size: 'small',
    i18n: (key, value) => i18n.t(key, value)
  })
  Vue.use(VueEditor)
}

const components = [
  MakingForm,
  GenerateForm,
  ReviewForm
]

const install = function (Vue, opts = {
  lang: 'pt-BR',
  locale: null,
  i18n: null
}) {
  opts = {
    lang: 'pt-BR',
    locale: null,
    i18n: null,
    ...opts
  }

  loadLang(Vue, opts.lang, opts.locale, opts.i18n)
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  Vue.use(ElementUI, { 
    size: 'small',
    // i18n: (key, value) => i18n.t(key, value)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  install,
  MakingForm,
  GenerateForm
}

export default {
  install,
  MakingForm,
  GenerateForm
}
