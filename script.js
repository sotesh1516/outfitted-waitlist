const forms = document.querySelectorAll('[data-waitlist-form]');

forms.forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const message = form.querySelector('.form-message');
    const email = input.value.trim();

    message.textContent = '';
    message.classList.remove('success');
    button.disabled = true;
    button.textContent = 'Joining…';

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Could not join right now.');

      message.textContent = data.message || "You're on the list.";
      message.classList.add('success');
      input.value = '';
    } catch (error) {
      message.textContent = error instanceof Error ? error.message : 'Could not join right now.';
    } finally {
      button.disabled = false;
      button.innerHTML = 'Join the waitlist <span aria-hidden="true">→</span>';
    }
  });
});
