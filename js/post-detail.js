import postApi from './api/postApi';
import { registerLightBox, setTextContent } from './utils';
import dayjs from 'dayjs';

function renderPostDetail(post) {
  if (!post) return;
  //render title
  //render author
  //render time span
  //rende desc
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(
    document,
    '#postDetailTimeSpan',
    `- ${dayjs(post.updatedAt).format('DD/MM/YYYY')}`
  );
  //render hero image
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`;

    heroImage.addEventListener('error', () => {
      console.log('background image error');
      // heroImage.style.backgroundImage = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }

  //render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit post';
  }
}

(async () => {
  registerLightBox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  });
  try {
    //get post ID from URL
    //fetch post detail API
    //render post detail
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    if (!postId) {
      console.log('Post not found');
      return;
    }

    const post = await postApi.getById(postId);
    renderPostDetail(post);
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();
