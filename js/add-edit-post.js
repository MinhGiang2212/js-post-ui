import postApi from './api/postApi';
import { initPostForm } from './utils';

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
          imageUrl: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValue,
      onSubmit: (formValues) => console.log('submit', formValues),
    });
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();
