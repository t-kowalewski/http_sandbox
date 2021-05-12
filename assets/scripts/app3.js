// APP clone using AXIOS library

// Elements
const listEl = document.querySelector('.posts');
const postTemplate = document.querySelector('template');
const newPostForm = document.querySelector('#new-post form');
const fetchPostsBtn = document.querySelector('#available-posts button');

// Sends Http Request - Returns Promise
// function sendHttpRequest(method, url, data) {
//   return fetch(url, {
//     method: method,
//     body: JSON.stringify(data),
//     // body: data, // for FormData test
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     .then((response) => {
//       // fetch returns promise resolved with 'Response' object with streamed data which should be converted first via .json()
//       if (response.status >= 200 && response.status < 300) {
//         return response.json(); // .json returns promise as well
//       } else {
//         return response.json().then((errorData) => {
//           console.log(errorData); // access error body when error occurs
//           throw new Error('Server-side error');
//         });
//       }
//     })
//     .catch((error) => {
//       console.log('Failed to send request', error);
//       throw new Error('Sending HTTP request failed');
//     }); // returns promise, in simplest form with only one param (url) - makes GET request
// }

// Using Promise - Get Data & append it inside DOM
function fetchPosts() {
  axios
    .get('https://jsonplaceholder.typicode.com/posts')
    .then((responseData) => {
      const posts = responseData.data; // axios has custom response object
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
      console.log(error.response); //axios generates custom error object; you can check response even in case of error
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

  // FormData example - can add data manually or parse form input and add it
  // const fd = new FormData(newPostForm); //we add arg. - JS will add data from form
  // // fd.append('title', title);
  // // fd.append('body', content);
  // fd.append('userId', postId);

  axios
    .post(
      'https://jsonplaceholder.typicode.com/posts',
      post
      // fd //using FormData
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
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

    axios
      .delete(`https://jsonplaceholder.typicode.com/posts/${postId.slice(5)}`)
      .then(() => {
        event.target.closest('li').remove();
      })
      .catch((error) => {
        console.log('Deleting data failed', error);
      });
  }
});
