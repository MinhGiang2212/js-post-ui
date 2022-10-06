import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

function removeUnusedFields(formValues) {
  const payload = { ...formValues };
  if (payload.imageSource === 'picsum') {
    delete payload.image;
  } else {
    delete payload.imageUrl;
  }

  //finally remove imageSource
  delete payload.imageSource;

  //remove id if it's add-post mode
  if (!payload.id) delete payload.id;

  return payload;
}

function jsonToFormData(jsonObject) {
  const formData = new FormData();

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }

  return formData;
}

async function handlerPostFormSubmit(formValues) {
  try {
    const payload = removeUnusedFields(formValues);
    const formData = jsonToFormData(payload);

    //check add/edit post
    //S1: check id on URL(search params)
    //S2: check id in form values
    //call API
    const savedPost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);

    //show success message
    toast.success('Save post successfully');

    //redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 2000);
  } catch (error) {
    console.log('failed to save post', error);
    toast.error(`Error: ${error.message}`);
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
