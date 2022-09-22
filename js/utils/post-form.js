import { setBackgroundImage, setFieldValue } from './common';

function setFormValue(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);
  //hidden field
  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl);

  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  setFormValue(form, defaultValue);
}
