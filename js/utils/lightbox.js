export function registerLightBox() {
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
    const imgList = document.querySelectorAll(`img[data-album="${event.target.dataset.album}"]`);
    const index = [...imgList].findIndex((x) => x === target);
    console.log({ target, index, imgList });
  });
}
