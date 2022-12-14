export function setTextContent(parent, selector, text) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function truncateText(text, maxLength) {
  if (text <= maxLength) return text;

  return `${text.slice(0, maxLength - 1)}…`;
}

export function setFieldValue(form, selector, value) {
  if (!form) return;

  const field = form.querySelector(selector);
  if (field) field.value = value;
}

export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.style.backgroundImage = `url(${imageUrl})`;
}

export function randomNumber(n) {
  if (!n) return;

  const random = Math.random() * n;
  return Math.trunc(random);
}
