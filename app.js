function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    }
  };
}

function newsServiceModule() {
  const apiUrl = "https://newsapi.org";
  const apiKey = "d5c22bbbee6c463393c90ec6f4796af2";
  return {
    topHeadlines(country, cb) {
      http.get(
        `${apiUrl}/v2/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`,
        cb
      );
    },

    everything(text, cb) {
      http.get(`${apiUrl}/v2/everything?q=${text}&apiKey=${apiKey}`, cb);
    }
  };
}

const http = customHttp();
const newsService = newsServiceModule();
const newsContainer = document.querySelector(".news-container .row");
const form = document.forms["newsControls"];
const countrySelect = form["country"];
const searchInput = form["search"];

//  init selects
document.addEventListener("DOMContentLoaded", function() {
  M.AutoInit();
  showLoader();
  loadNews();
});

form.addEventListener("submit", e => {
  e.preventDefault();
  showLoader();
  if (searchInput.value) {
    newsService.everything(searchInput.value, onGetResponse);
  } else {
    newsService.topHeadlines(countrySelect.value, onGetResponse);
  }
});
// 1

function loadNews() {
  newsService.topHeadlines(countrySelect.value, onGetResponse);
}

function onGetResponse(err, response) {
  hideLoader();
  if (err) {
    console.warn(err);
    // hideLoader();
    return;
  }

  if (!response.articles.length) {
    M.toast({ html: 'Новости по вашему запросу не найдены' });
    return;
  }

  renderNews(response.articles);
  // hideLoader();
}

function renderNews(news) {
  clearContainer();
  let fragment = "";
  news.forEach(item => {
    const template = newsTemplate(item);
    fragment += template;
  });

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

function clearContainer() {
  newsContainer.innerHTML = "";
}

function newsTemplate({ title, urlToImage, url, description }) {
  return `
  <div class="col s12">
    <div class="card">
      <div class="card-image">
        <img src="${urlToImage}">
        <span class="card-title">${title || ""}</span>
      </div>
      <div class="card-content">
        <p>${description || ""}</p>
      </div>
      <div class="card-action">
        <a href="${url}">Read more</a>
      </div>
    </div>
  </div>
  `;
}

// tasks

/**
 * 1. При загрузке мы должны получить дефолтные новости
 * а - функция loadNews
 * б - функция OnGetResponse
 * в - функция для формирования шаблона newsTemplate
 * 2. при изменении формы выводим полученные новости, или, если новостей нет, то мы должны вывести уведомление, что новости не найдены
 * 3. при каждой загрузке новостей показывать прелоадер и скрывать когда новости будут получены
 */

 function showLoader() {
  const template = `
  <div class="progress">
      <div class="indeterminate"></div>
  </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', template);
 }

 function hideLoader() {
  const loader = document.querySelector('.progress');
  if (loader) {
    loader.remove();
  }
 }

// key = d5c22bbbee6c463393c90ec6f4796af2  api news

// response - what is it. ответ от сервера

// callback in ajax

// xhr.status

// try catch construction - позволяет обрабатывать ошибки не убивая в рантайме код.

// query параметры

// сигнатура - то, что принимает функция, параметры, порядок параметров

// модуль

// local storage
