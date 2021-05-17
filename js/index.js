const hamburger = document.querySelector('.mobile-menu');
const menu = document.getElementById('menu');
const form = document.getElementById('form');
const url = document.getElementById('url');
const submitBtn = document.querySelector('.form-btn');
const result = document.querySelector('.result');
const urlCopy = document.getElementsByClassName('url-copy');
const urlShortArr = document.getElementsByClassName('url-short');

const removeAllActive = () => {
  for (let index = 0; index < urlCopy.length; index++) {
    const element = urlCopy[index];
    element.classList.remove('copied');
    element.innerHTML = 'Copy';
    return true;
  }
};

for (let i = 0; i < urlCopy.length; i++) {
  const e = urlCopy[i];
  e.addEventListener('click', (event) => {
    removeAllActive();
    e.classList.add('copied');
    e.innerHTML = 'Copied!';
    const range = document.createRange();
    range.selectNode(urlShortArr[i]);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
  });
}

let shortUrl = '';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  return true;
});

const handleClick = (e) => {
  menu.classList.toggle('hide');
  return true;
};

hamburger.addEventListener('click', handleClick);

const handleDomManipulation = (urlValue) => {
  result.insertAdjacentHTML(
    `beforeend`,
    `<div class="result-container"> 
      <p class="url-long">${urlValue}</p>
      <p class="url-short">${shortUrl}</p>
      <button class="url-copy btn">Copy</button>
    </div>`
  );
};

const getShortUrl = async (urlValue) => {
  let fetchUrl = `https://api.shrtco.de/v2/shorten?url=${urlValue}`;
  const resp = await fetch(fetchUrl);
  const data = await resp.json();
  console.log(await data);
  shortUrl = await data.result.short_link;
  let originalUrl = data.result.original_link;
  console.log(await shortUrl);
  handleDomManipulation(originalUrl);
};

const handleSubmit = (e) => {
  let urlValue = url.value;
  if (e.keyCode === 13) {
    getShortUrl(urlValue);
    return true;
  }
  return false;
};

const handleSubmitBtn = (e) => {
  let urlValue = url.value;
  getShortUrl(urlValue);

  return true;
};

url.addEventListener('keypress', handleSubmit);
submitBtn.addEventListener('click', handleSubmitBtn);
