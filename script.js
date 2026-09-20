const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzFdMA4tMbOtY-tkhy-qUm6S5bdG6m_K0Ia5n1zevi466WV85rnVuyBC9-PgNb4xbrnaQ/exec';
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
      const data = await submitToGoogleSheets(email);
      if (!data.ok) throw new Error(data.message || 'Could not join right now.');

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

function submitToGoogleSheets(email) {
  return new Promise((resolve, reject) => {
    if (!GOOGLE_SHEETS_WEBHOOK_URL.startsWith('https://script.google.com/')) {
      reject(new Error('Google Sheets is not configured yet.'));
      return;
    }

    const callbackName = `waitlistCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Could not reach Google Sheets. Please try again.'));
    }, 10000);

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('Could not reach Google Sheets. Please try again.'));
    };
    script.src = `${GOOGLE_SHEETS_WEBHOOK_URL}?email=${encodeURIComponent(email)}&source=outfitted-waitlist&callback=${callbackName}`;
    document.head.appendChild(script);

    function cleanup() {
      window.clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    }
  });
}
