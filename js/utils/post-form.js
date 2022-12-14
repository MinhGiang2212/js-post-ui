import { randomNumber, setBackgroundImage, setFieldValue, setTextContent } from './common';
import * as yup from 'yup';

const imageSource = {
  UPLOAD: 'upload',
  PICSUM: 'picsum',
};

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
    imageSource: yup
      .string()
      .required('please select a option')
      .oneOf([imageSource.PICSUM, imageSource.UPLOAD], 'Invalid image source'),

    imageUrl: yup.string().when('imageSource', {
      is: imageSource.PICSUM,
      then: yup.string().required('please random a background').url('please enter a valid URL'),
    }),

    image: yup.mixed().when('imageSource', {
      is: imageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'please select an image to upload', (file) => Boolean(file?.name))
        .test('max-size-3mb', 'this image is too large (max is 3mb)', (file) => {
          const fileSize = file?.size || 0;
          const MAX_SIZE = 2 * 1024 * 1024;
          return fileSize <= MAX_SIZE;
        }),
    }),
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
    ['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''));

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
  form.classList.add('was-validated');

  return isValid;
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage');
  if (!randomButton) return;

  randomButton.addEventListener('click', () => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`;
    //hidden field
    setFieldValue(form, '[name="imageUrl"]', imageUrl);

    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}

function renderImageSource(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]');
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue;
  });
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]');
  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderImageSource(form, event.target.value));
  });
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[id="uploadImage"]');
  if (!uploadImage) return;

  uploadImage.addEventListener('change', (event) => {
    // console.log('upload image', event.target.files[0]);

    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setBackgroundImage(document, '#postHeroImage', imageUrl);
    }
  });
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
    button.textContent = 'Save';
  }
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  let submitted = false;
  setFormValue(form, defaultValue);

  //init events
  initRandomImage(form);
  initRadioImageSource(form);
  initUploadImage(form);

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
    if (isValid) await onSubmit?.(formValues);

    //always hide loading no matter form is valid or not
    hideLoading(form);
    submitted = false;
  });
}
