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
        'public/landscape.css'
      ],
      timeout: 3000, // default timeout before the print window appears
      autoClose: false, // if false, the window will not close after printing
      windowTitle: window.document.title, // override the window title
    }
    
    app.vueApp.use(VueHtmlToPaper, options);
    
    // or, using the defaults with no stylesheet
    app.vueApp.use(VueHtmlToPaper);
});
