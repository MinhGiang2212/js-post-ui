import { setBackgroundImage, setFieldValue } from './common';

function setFormValue(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);
  //hidden field
  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl);

  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValues(form) {
  if (!form) return;

  const formValues = {};

  const formData = new FormData(form);
  for (const [key, value] of formData) {
    formValues[key] = value;
  }

  return formValues;
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  setFormValue(form, defaultValue);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('submit');

    //get form values
    const formValues = getFormValues(form);
    console.log(formValues);
    //validation
    //if valid trigger submit callback
    //otherwise, show validation errors
  });
}
