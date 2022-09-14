const elForm = document.querySelector(".news__form");
const elInputSerach = elForm.querySelector(".news__input");
const elSelect = elForm.querySelector(".news__sort");

const elResultList = document.querySelector(".news__result-list");

const elTemplate = document.querySelector("#news__template").content;

const elSelectLang = document.querySelector(".news__lang");

const elSpinner = document.querySelector(".news__spinner");

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

const news = async (title, sort, lang) => {
  try {
    const respone = await fetch(`https://newsapi.org/v2/everything?q=${title}&page=1&language=${lang}&pageSize=30&sortBy=${sort}&apiKey=7f93f076669541beba1122403d2be83b`);

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

news("ukraine", "publishedAt", "en");

spinnerRemove();

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  elResultList.innerHTML = null;
  spinnerRemove();

  const serchValue = elInputSerach.value.toLowerCase().trim();

  news(serchValue, elSelect.value, elSelectLang.value);


  elInputSerach.value = ""
})