import postApi from './api/postApi';
import { initPostForm } from './utils';

//MAIN
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    let defaultValue = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
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
