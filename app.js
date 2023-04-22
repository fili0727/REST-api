"use strict";

window.addEventListener("load", start);
const endpoint =
  "https://test-5439a-default-rtdb.europe-west1.firebasedatabase.app/";

async function start() {
  const myData = await getPosts();
  const userData = await getUsers();
  updatePostGrid(myData);
  displayUsers(userData);
  document
    .querySelector("#btn-create-post")
    .addEventListener("click", createPostClicked);
}
function createPostClicked() {
  const randomNumber = Math.floor(Math.random() * 100 + 1);
  const title = `my post ${randomNumber}`;
  const body = `bla bla bla`;
  const image =
    "https://www.traeinfo.dk//uploads/2018/12/B%C3%A6redygtigt_tr%C3%A6_1100x620.jpg";
  createPost(title, body, image);
}
async function updatePostGrid() {
  const posts = await getPosts();
  displayPosts(posts);
  console.log("Update post grid");
}

async function getPosts() {
  const response = await fetch(`${endpoint}/posts.json`); //posts.json is the data ressource
  const data = await response.json();
  const posts = preparePostData(data);
  return posts;
}

async function getUsers() {
  const response = await fetch(`${endpoint}/users.json`);
  const data = await response.json();
  const users = preparePostData(data);
  return users;
}

function preparePostData(dataObject) {
  const postArray = [];
  for (const key in dataObject) {
    const post = dataObject[key];
    post.id = key;
    postArray.push(post);
  }
  return postArray;
}
function displayPosts(objList) {
  for (const obj in objList) displayPost(objList[obj]);
}
function displayUsers(objList) {
  for (const obj in objList) displayUser(objList[obj]);
}

function displayPost(postObject) {
  const postSelector = document.querySelector("#posts");
  const html = /*HTML*/ `
    <article class="grid-item" id="post" >
    <img src="${postObject.image}" alt=""> 
     <div >${postObject.body}</div>
    <div >${postObject.title}</div>
        
        <button class="btn-update">Update</button>
        <button class="btn-delete">Delete</button>
    </article>
`;
  postSelector.insertAdjacentHTML("beforeend", html);
  document
    .querySelector("#posts article:last-child .btn-delete")
    .addEventListener("click", deleteClicked);
  document
    .querySelector("#posts article:last-child .btn-update")
    .addEventListener("click", updateClicked);
  function deleteClicked() {
    console.log("Clicked");
    deletePost(postObject.id);
  }
  function updateClicked() {
    const title = `${postObject.title} Updated`;
    const body = "bla bla bla";
    const image =
      "https://media.lex.dk/media/12837/standard_compressed_trae.jpg";
    updatePost(postObject.id, title, body, image);
  }
}

async function deletePost(id) {
  const response = await fetch(`${endpoint}/posts/${id}.json`, {
    method: "DELETE",
  });
  if (response.ok) {
    console.log("deleted");
    updatePostGrid();
  }
}

function displayUser(element) {
  const postSelector = document.querySelector("#users");
  const html = /*HTML*/ `
    <article class="grid-item" id="user" >
    <img src="${element.image}" alt="">
    <div >${element.name}</div>
    <div >${element.mail}</div>
    <div >${element.phone}</div>
    <div >${element.title}</div>
    </article>
`;
  postSelector.insertAdjacentHTML("beforeend", html);
}

async function createPost(title, body, image) {
  const newPost = { title, body, image };
  const postAsJson = JSON.stringify(newPost);
  const response = await fetch(`${endpoint}/posts.json`, {
    method: "POST",
    body: postAsJson,
  });
  if (response.ok) {
    console.log("new post");
    updatePostGrid();
  }
}

async function updatePost(id, title, body, image) {
  const postToUpdate = { title, image, body };
  const postAsJson = JSON.stringify(postToUpdate);
  const url = `${endpoint}/posts/${id}.json`;
  const response = await fetch(url, { method: "PUT", body: postAsJson });

  if (response.ok) {
    console.log("updated");
    updatePostGrid();
  }
}

function updateClicked() {
  console.log("clicked");
}
