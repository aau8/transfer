const formElems = document.querySelectorAll('form');

formElems.forEach(form => {
  sendForm(form);
})

function sendForm(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let reqUserName = validateName(form);

    if (reqUserName) {
      const formData = new FormData(form);
  
      const pathHandlerFile = form.getAttribute('action');
  
      response = await fetch(pathHandlerFile, {
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
    }
  })
}

function validateName(form) {
  const input = form.querySelector('[name="user_name"]');

  if (input.value == '') {
    console.log('Укажите свое имя!');
  }
  else {
    return true;
  }
}

function inputNotSpaceInStart() {
  const inputElems = document.querySelectorAll('input, textarea');
  inputElems.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (input.value.length < 1) {
        const inputCharCode = e.charCode;
        if (inputCharCode == 32) {
          e.preventDefault();
        }
      }
    })
  })
}
inputNotSpaceInStart();

function inputTelNotLetters() {
  const inputElems = document.querySelectorAll('[type="tel"]');
  inputElems.forEach(input => {
    input.addEventListener('keypress', function(e) {
      const inputCharCode = e.charCode;
      if(!(inputCharCode >= 48 && inputCharCode <= 57) && (inputCharCode != 43 && inputCharCode != 0 && inputCharCode != 40 && inputCharCode != 41 && inputCharCode != 45)) {
        e.preventDefault();
      }
    });
  })
}
inputTelNotLetters();

function inputNameNotNumbers(name) {
  const inputElems = document.querySelectorAll(`[name="${name}"]`);
  console.log(inputElems);
  inputElems.forEach(input => {
    input.addEventListener('keypress', function(e) {
      const inputCharCode = e.charCode;
      if((inputCharCode >= 48 && inputCharCode <= 57) && (inputCharCode != 43 && inputCharCode != 0 && inputCharCode != 40 && inputCharCode != 41 && inputCharCode != 45)) {
        e.preventDefault();
      }
    });
  })
}
inputNotNumbers('user_name');