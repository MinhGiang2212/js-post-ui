import postApi from './api/postApi';
import { initPostForm, toast } from './utils';
async function handlerPostFormSubmit(formValues) {
  // console.log('submit from parent', formValues);
  try {
    //check add/edit post
    //S1: check id on URL(search params)
    //S2: check id in form values
    //call API
    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues);
    //show success message
    toast.success('Save post successfully');
    //redirect to detail page
    // console.log('redirect to ', savedPost);
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 3000);
  } catch (error) {
    console.log('failed to save post', error);
    toast.error(`Error :${error.message}`);
  }
}
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
      onSubmit: handlerPostFormSubmit,
    });
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();
