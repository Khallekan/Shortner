// <---For the mobile menu--->

const hamburger = document.querySelector('.mobile-menu');
const menu = document.getElementById('menu');

const handleClick = (e) => {
  menu.classList.toggle('hide');
  return true;
};

hamburger.addEventListener('click', handleClick);

// <---End of mobile menu--->

// <---Form submission, API handling and DOM manipulation--->

const form = document.getElementById('form');
const url = document.getElementById('url');
const submitBtn = document.querySelector('.form-btn');
const result = document.getElementById('result');

// <---Stop form from refreshing--->
form.addEventListener('submit', (e) => {
  e.preventDefault();
  return true;
});

// <---API Handler: Gets data from API, returns short URL--->

// <---Initialize variables that will be used in the dom--->
let longUrl, shortUrl;

// <---Gets shorter URL from the api, returns a boolean value--->
const getShortUrl = async () => {
  const urlValue = url.value;
  const fetchUrl = `https://api.shrtco.de/v2/shorten?url=${urlValue}`;
  const resp = await fetch(fetchUrl);
  const data = await resp.json();

  // <---If API returns an error alert with error and return false--->
  if (await data.error_code) {
    alert(await data.error);
    return false;
  }

  // <---If API returns normal object set results into initialized variables and return true--->
  longUrl = await data.result.original_link;
  shortUrl = await data.result.short_link;
  return true;
};

// <---HTML COLLECTION of all elements with specified classnames--->
const urlCopy = document.getElementsByClassName('url-copy');
const urlShortArr = document.getElementsByClassName('url-short');

// <---Remove all active classes from buttons change innerHTML--->
const removeAllActive = () => {
  for (let index = 0; index < urlCopy.length; index++) {
    const element = urlCopy[index];
    element.classList.remove('copied');
    element.innerHTML = 'Copy';
  }
  return true;
};

// <---Add event listener to body and listen for click--->
document.body.addEventListener('click', (e) => {
  // <---If target of click contains specified classname proceed--->
  if (e.target && e.target.classList.contains(`url-copy`)) {
    // <---Remove all active actions from copy buttons--->
    removeAllActive();
    // <---Add loop to add specificity to the click--->
    for (let i = 0; i < urlCopy.length; i++) {
      const element = urlCopy[i];
      // <---If location of click matches a specified button proceed--->
      if (e.target === element) {
        // <---Make button active and copy short link to clipboard--->
        element.classList.add('copied');
        element.innerHTML = `Copied!`;
        const range = document.createRange();
        range.selectNode(urlShortArr[i]);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
      }
    }
  }
  return;
});

// <---Add new elements dynamically and update session storage--->
const handleDomManipulation = () => {
  result.insertAdjacentHTML(
    `afterbegin`,
    `<div class="result-container">
      <p class="url-long">${longUrl}</p>
      <p class="url-short">${shortUrl}</p>
      <button class="url-copy btn">Copy</button>
    </div>`
  );
  sessionStorage.setItem(`oldResults`, result.innerHTML);
  return;
};

// <---Checks for input length and returns bool--->
const handleErrorInput = () => {
  if (url.value.length === 0) {
    url.classList.add(`error`);
    document.querySelector('.form-err').style.display = `block`;
    return false;
  }
  url.classList.remove(`error`);
  document.querySelector(`.form-err`).style.display = `none`;
  return true;
};

const handleMouseClick = async (e) => {
  if (handleErrorInput()) {
    if (await getShortUrl()) {
      handleDomManipulation();
      return;
    }
    return;
  }
  return;
};

const handleEnter = async (e) => {
  e.stopImmediatePropagation();
  if (e.keyCode === 13) {
    if (handleErrorInput()) {
      if (await getShortUrl()) {
        handleDomManipulation();
        e.preventDefault();
        return;
      }
      return;
    }
    return;
  }
  return;
};

url.addEventListener('keypress', handleEnter);
submitBtn.addEventListener('click', handleMouseClick);

window.addEventListener(`load`, () => {
  const saved = sessionStorage.getItem(`oldResults`);
  result.innerHTML = saved;
  removeAllActive();
});
