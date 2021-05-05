const listEl = document.querySelector('.posts');
const postTemplate = document.querySelector('template');

const xhr = new XMLHttpRequest();

xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts');

xhr.responseType = 'json'; // alternatie to JSON.parse(xhr.response)

xhr.onload = function () {
  // const posts = JSON.parse(xhr.response);
  const posts = xhr.response;
  console.log(posts);

  for (const post of posts) {
    const listItemEl = postTemplate.content.querySelector('li').cloneNode(true);
    listItemEl.querySelector('h2').textContent = post.title.toUpperCase();
    listItemEl.querySelector('p').textContent = post.body;
    listEl.append(listItemEl);
  }
};

xhr.send();
