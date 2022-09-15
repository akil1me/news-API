const elForm = document.querySelector(".news__form");
const elInputSerach = elForm.querySelector(".news__input");
const elSelect = elForm.querySelector(".news__sort");

const elResultList = document.querySelector(".news__result-list");

const elTemplate = document.querySelector("#news__template").content;

const elSelectLang = document.querySelector(".news__lang");

const elSpinner = document.querySelector(".news__spinner");

let btns = document.querySelectorAll(".prev");
let elp = document.querySelector(".elp");
let i = 1;

// Modal
const elModal = document.querySelector(".news__modal");
const elModalInner = elModal.querySelector(".news__modal-inner");
elModal.addEventListener("click", evt => {
  if (evt.target.matches(".news__modal") || evt.target.matches(".btn-close") || evt.target.matches(".btn-close-2")) {
    elModal.classList.remove("news__modal-active");
    document.body.classList.remove("overr");

  } else {
    elModal.classList.add("news__modal-active");
  }
})

// Modal render
const btnModal = (btns, data) => {
  btns.forEach(btn => {
    btn.addEventListener("click", () => {

      elModal.classList.add("news__modal-active");
      document.body.classList.add("overr");

      const closeBtn = document.createElement("button");
      closeBtn.className = "position-absolute btn btn-close news__close";
      closeBtn.type = "button";

      elModalInner.innerHTML = `
        <img class="rounded  news__modal-img img-fluid mt-5 mb-3" src="${data.urlToImage}" alt="${data.title}" width="300" height="300">
       <div class=" text-dark">
        <h3 class="h5 fw-bold"> ${data.title}</h3>
        <p class="mb-1"> ${data.description}</p>
        <time datetime="${data.publishedAt}" class="mb-1"><span class="fw-bold">data:</span> ${data.publishedAt}</time>
        <p class="mb-1"><span class="fw-bold">Source:</span> ${data.source.name}</p>
        <a class="news__link" href="${data.url}" target="blank">Source link →</a>
       </div>
       <div class="text-end">
       <button type="button" class="btn btn-secondary btn-close-2" data-bs-dismiss="modal">Close</button>
       </div>
              `
      elModalInner.appendChild(closeBtn);
    })
  })
}


const newsRender = data => {
  elResultList.innerHTML = null;

  const datum = [...data];

  const elFragment = document.createDocumentFragment();

  datum.forEach(data => {
    const copyFragment = elTemplate.cloneNode(true);

    copyFragment.querySelector(".news__img-poster").src = data.urlToImage;
    copyFragment.querySelector(".news__img-poster").alt = data.title;

    copyFragment.querySelector(".news__card-title").innerHTML = `${data.title.split(" ").slice(0, 5).join(" ")}...`;

    const btns = copyFragment.querySelectorAll(".news__more-info");

    btnModal(btns, data);

    elFragment.append(copyFragment);
  })

  elResultList.appendChild(elFragment);

  console.log(datum);

}
// Error
const error = (err) => {
  elResultList.innerHTML = null;
  const errItem = document.createElement("li");
  errItem.className = "alert alert-danger";
  errItem.textContent = err;

  elResultList.appendChild(errItem);
}

const news = async (title = "ukraine", sort = "publishedAt", lang = "en", page = 1) => {
  try {
    const respone = await fetch(`http://newsapi.org/v2/everything?q=${title}&page=${page}&pageSize=20&language=${lang}&sortBy=${sort}&apiKey=7f93f076669541beba1122403d2be83b`);

    const data = await respone.json();

    console.log(data);
    newsRender(data.articles);

  } catch (err) {
    error(err)

  }
  finally {
    spinnerAdd()
  }
}

function spinnerRemove() {
  elSpinner.classList.remove("d-none");
}

function spinnerAdd() {
  elSpinner.classList.add("d-none");
}
let serchValue = "ukraine";
let selectValue = "publishedAt"
let languageValue = "en";

news(serchValue, selectValue, languageValue, i);
spinnerRemove();

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  elResultList.innerHTML = null;
  spinnerRemove();
  i = 1
  elp.textContent = i
  serchValue = elInputSerach.value.toLowerCase().trim();
  selectValue = elSelect.value;
  languageValue = elSelectLang.value;

  news(serchValue, selectValue, languageValue, i);

  elInputSerach.value = ""
})

btns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.textContent == "preview") {
      if (i > 1) {
        --i
        elp.textContent = i;
        news(serchValue, selectValue, languageValue, i);
      }
    } else {
      ++i
      elp.textContent = i;
      news(serchValue, selectValue, languageValue, i);
    }
  })
})
