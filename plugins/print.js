// import Vue from 'vue';
import VueHtmlToPaper from 'vue-html-to-paper';

export default defineNuxtPlugin((app) => {
  const options = {
      name: '_blank',
      specs: [
        'fullscreen=yes',
        'titlebar=yes',
        'scrollbars=no'
      ],
      styles: [
        'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
        'https://unpkg.com/kidlat-css/css/kidlat.css',
        '~/assets/css/landscape.css'
      ],
      timeout: 3000,
      autoClose: false,
      windowTitle: window.document.title,
    }
    
    app.vueApp.use(VueHtmlToPaper, options);
    
    // or, using the defaults with no stylesheet
    app.vueApp.use(VueHtmlToPaper);
});
