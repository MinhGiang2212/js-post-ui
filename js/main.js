import postApi from './api/postApi';
import { setTextContent, truncateText } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//to use fromNow func
dayjs.extend(relativeTime);

function createPostElement(post) {
  if (!post) return;

  //find, clone template
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  //update thumbnail, title, description, author
  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }

  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));
  setTextContent(liElement, '[data-id="author"]', post.author);
  //calculate timespan
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`);

  //attach events

  return liElement;
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postsList');
  if (!ulElement) return;

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

function handlerFilterChange(filterName, filterValue) {
  //update query params
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  window.history.pushState({}, '', url);

  //fetch API
  //re-render post list
}

function handlerNextPagination(event) {
  event.preventDefault();
}

function handlerPrevPagination(event) {
  event.preventDefault();
}

function initPagination() {
  //bind click event for prev/next pagination
  const ulPagination = document.getElementById('pagination');
  if (!ulPagination) return;

  //add click event for prev pagination
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (prevLink) {
    prevLink.addEventListener('click', handlerPrevPagination);
  }

  //add click event for next pagination
  const nextLink = ulPagination.lastElementChild?.firstElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', handlerNextPagination);
  }
}

function initURL() {
  const url = new URL(window.location);

  //update search params if needed
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

  window.history.pushState({}, '', url);
}

(async () => {
  initPagination();
  //set default query params if not exist
  initURL();

  try {
    const queryParams = new URLSearchParams(window.location.search);
    const { data, pagination } = await postApi.getAll(queryParams);

    renderPostList(data);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
