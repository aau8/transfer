const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  let response = await fetch('../mail.php', {
    method: 'POST',
    body: formData
  })

  if (response.ok) {
    console.log('Successful');
    form.reset();
  }
  else {
    console.log('Error');
  }
})