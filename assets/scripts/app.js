// Elements
const listEl = document.querySelector('.posts');
const postTemplate = document.querySelector('template');
const newPostForm = document.querySelector('#new-post form');
const fetchPostsBtn = document.querySelector('#available-posts button');

// Sends Http Request - Returns Promise
function sendHttpRequest(method, url, data) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.responseType = 'json'; // alternatie to JSON.parse(xhr.response)

    xhr.onload = function () {
      // const posts = JSON.parse(xhr.response);

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response); // we have access to xhr.response property when data has been loaded
      } else {
        reject(new Error('Server-side error'));
      }
    };

    xhr.onerror = function () {
      // kicks in only if we technically fail to send request (for ex network problem, timeout, failed to send) not when we have response from server (error rensponse code like 404, when somethig is wrong on the server side - in such case 'onload' event happens)
      reject(new Error('Failed to send request!'));
    };

    xhr.send(JSON.stringify(data)); // accepts optional body param
  });

  return promise;
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
