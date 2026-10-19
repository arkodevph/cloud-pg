const form = document.querySelector('[data-login-preview]');
const password = form.querySelector('[name="password"]');
const status = form.querySelector('[role="status"]');
const show = form.querySelector('[data-login-show]');
form.querySelector('[data-admin-demo]').addEventListener('click', () => { window.location.href = '/admin/'; });
form.addEventListener('submit', event => {
  event.preventDefault();
  password.value = '';
  status.textContent = 'Login preview complete. No account was accessed.';
});
form.querySelector('[type="submit"]').disabled = false;
show.addEventListener('click', () => {
  const visible = password.type === 'password';
  password.type = visible ? 'text' : 'password';
  show.textContent = visible ? 'Hide' : 'Show';
  show.setAttribute('aria-pressed', String(visible));
});
form.querySelector('[data-login-forgot]').addEventListener('click', () => {
  status.textContent = 'Password reset is a preview only. No reset email has been sent.';
});
