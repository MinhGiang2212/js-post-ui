import { setTextContent, truncateText } from './common';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

//to use fromNow func
dayjs.extend(relativeTime);

export function createPostElement(post) {
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
      console.log('post image error');

      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }

  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));
  setTextContent(liElement, '[data-id="author"]', post.author);
  //calculate timespan
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`);

  //attach events
  //go to post detail when click on div.postItem
  const divElement = liElement.firstElementChild;
  if (divElement) {
    divElement.addEventListener('click', () => {
      window.location.assign(`post-detail.html?id=${post.id}`);
    });
  }

  return liElement;
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  //clear post list
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
