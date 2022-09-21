import postApi from './api/postApi';

//MAIN
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    let defaultValue = Boolean(postApi)
      ? await postApi.getById(postId)
      : {
          title: '',
          descripttion: '',
          author: '',
          imageURL: '',
        };
    console.log(defaultValue);
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();
