// APP clone using fetch() API

// Elements
const listEl = document.querySelector('.posts');
const postTemplate = document.querySelector('template');
const newPostForm = document.querySelector('#new-post form');
const fetchPostsBtn = document.querySelector('#available-posts button');

// Sends Http Request - Returns Promise
function sendHttpRequest(method, url, data) {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    // fetch returns promise resolved with 'Response' object with streamed data which should be converted first via .json()
    return response.json(); // .json returns promise as well
  }); // returns promise, in simplest form with only one param (url) - makes GET request
}

// Using Promise - Get Data & append it inside DOM
function fetchPosts() {
  sendHttpRequest('GET', 'https://jsonplaceholder.typicode.com/posts')
    .then((responseData) => {
      const posts = responseData;
      listEl.textContent = '';

      for (const post of posts) {
        const listItemEl = postTemplate.content
          .querySelector('li')
          .cloneNode(true);
        listItemEl.querySelector('h2').textContent = post.title.toUpperCase();
        listItemEl.querySelector('p').textContent = post.body;
        listItemEl.id = `post-${post.id}`;
        listEl.append(listItemEl);
      }
    })
    .catch((error) => {
      console.log('Fetching posts failed =>', error);
    });
}

// Using Promise - Post Data
function createPost(title, content) {
  const postId = Math.random();
  const post = {
    title: title,
    body: content,
    userId: postId,
  };

  sendHttpRequest(
    'POST',
    'https://jsonplaceholder.typicode.com/posts',
    post
  ).catch((error) => {
    console.log('Posting data failed', error);
  });
}

// Button/Element Listeners
fetchPostsBtn.addEventListener('click', fetchPosts);

newPostForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const enteredTitle = event.currentTarget.querySelector('#title').value;
  const enteredContent = event.currentTarget.querySelector('#content').value;

  createPost(enteredTitle, enteredContent);
});

listEl.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    const postId = event.target.closest('li').id;
    // event.target.closest('li').remove();

    sendHttpRequest(
      'DELETE',
      `https://jsonplaceholder.typicode.com/posts/${postId.slice(5)}`
    )
      .then(() => {
        event.target.closest('li').remove();
      })
      .catch((error) => {
        console.log('Deleting data failed', error);
      });
  }
});
