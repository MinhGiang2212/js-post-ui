import { setBackgroundImage, setFieldValue, setTextContent } from './common';
import * as yup from 'yup';

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

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('please enter title'),
    author: yup
      .string()
      .required('please enter author')
      .test(
        'at-least-two-worlds',
        'please end at least two worlds and each world is 3 characters ',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

async function validatePostForm(form, formValues) {
  try {
    //reset previous error
    ['title', 'author'].forEach((name) => setFieldError(form, name, ''));

    //start validating
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    const errorLog = {};
    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        //ignore if field error is already logged;
        if (errorLog[name]) continue;

        //set field error and mark as logged
        setFieldError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');

  return isValid;
}
function showLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving...';
  }
}
function hideLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = false;
    button.innerHTML = '<i class="fas fa-save mr-1"></i> Save';
  }
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  setFormValue(form, defaultValue);

  let submitted = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    //prevent other submission
    if (submitted) return;

    showLoading(form);
    submitted = true;

    //get form values
    const formValues = getFormValues(form);
    formValues.id = defaultValue.id;

    //validation
    //if valid trigger submit callback
    //otherwise, show validation errors
    const isValid = await validatePostForm(form, formValues);
    if (!isValid) return;

    await onSubmit?.(formValues);

    hideLoading(form);
    submitted = false;
  });
}
