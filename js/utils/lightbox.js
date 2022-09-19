function showModal(modalId) {
  //make sure bootstrap script is loaded
  if (!window.bootstrap) return;
  const modal = new window.bootstrap.Modal(document.getElementById(modalId));
  if (modal) modal.show();
}
export function registerLightBox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  //selectors
  const imgElement = modalElement.querySelector(imgSelector);
  const prevButton = modalElement.querySelector(prevSelector);
  const nextButton = modalElement.querySelector(nextSelector);
  if (!imgElement || !prevButton || !nextButton) return;

  //lightbox vars
  let imgList = [];
  let currentIndex = 0;

  function showImageAtIndex(index) {
    imgElement.src = imgList[index].src;
  }
  //handler click for all imgs -> event delegation
  //img click -> find all imgs with the same album/gallery
  //detarmine index of selected img
  //show modal with selected img
  //handler prev/next click
  document.addEventListener('click', (event) => {
    // console.log(e.target);
    const { target } = event;
    if (event.target.tagName !== 'IMG' || !event.target.dataset.album) return;

    //img with data album
    imgList = document.querySelectorAll(`img[data-album="${event.target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);
    console.log({ target, currentIndex, imgList });
    // show img at index
    showImageAtIndex(currentIndex);
    //show modal
    showModal(modalId);
  });

  prevButton.addEventListener('click', () => {
    //show prev img of current album
  });
  nextButton.addEventListener('click', () => {
    //show next img for current album
  });
}
