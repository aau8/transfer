const body = document.querySelector('body');

// Аккордеоны в меню
accordionMenu('.menu-arrow');
function accordionMenu(selectors) {
  const accHeaderElems = document.querySelectorAll(selectors)

  for (let i = 0; i < accHeaderElems.length; i++) {
    const accHeader = accHeaderElems[i];
    
    accHeader.addEventListener('click', () => {
      accOpen(accHeader);
    });
  }

  function accOpen(accHeader) {
    const accBody = accHeader.parentNode.nextElementSibling;
    accHeader.classList.toggle('_active');
    if (accHeader.classList.contains('_active')) {
      accBody.style.maxHeight = accHeader.parentNode.nextElementSibling.scrollHeight + 'px';
    }
    else {
      accBody.style.maxHeight = 0;
    }
  }
}


// const body = document.querySelector('body');

// // Отображение меню
menuShow();
function menuShow() {
  const burgerElems = document.querySelectorAll('.header__burger');
  for (let i = 0; i < burgerElems.length; i++) {
    const burger = burgerElems[i];
    burger.addEventListener('click', () => {
      document.querySelector('.menu').classList.add('_show');
      body.classList.add('_lock');
    })
  }
}

menuHidden();
function menuHidden() {
  const menuClose = document.querySelector('.menu-close');
  menuClose.addEventListener('click', () => {
    document.querySelector('.menu').classList.remove('_show');
    body.classList.remove('_lock');
  })
}


closeWhenClickingOnBg('.menu__sidebar', '', document.querySelector('.menu'));
// Закрытие модального окна при клике по заднему фону
function closeWhenClickingOnBg(itemArray, classShow, itemParent) {
  classShow = classShow;
  if (classShow == '') {
    classShow = '_show';
  }
  document.addEventListener('click', (e) => {
    let itemElems = document.querySelectorAll(itemArray)

    for (let i = 0; i < itemElems.length; i++) {
      const item = itemElems[i];
      
      const target = e.target,
            itsItem = target == item || item.contains(target),
            itemIsShow = item.classList.contains(classShow);
  
      if (itemParent) {
        const itsItemParent = target == itemParent || itemParent.contains(target),
              itemParentIsShow = itemParent.classList.contains(classShow);
  
        if (!itsItem && itsItemParent && itemParentIsShow) {
          itemParent.classList.remove(classShow);
  
          if (document.querySelector('body').classList.contains('_lock')) {
            document.querySelector('body').classList.remove('_lock');
          }
        }
      }
      else {
        if (!itsItem && itemIsShow) {
          item.classList.remove(classShow);
          if (document.querySelector('body').classList.contains('_lock')) {
            document.querySelector('body').classList.remove('_lock');
          }
          document.removeEventListener('click', closeItem);
        }
      }
    }
  })
}

// Поиск
searchHeight()
function searchHeight() {
  const search = document.querySelector('.search__body')
  const header = document.querySelector('.header')

  const headerHeight = header.scrollHeight
  search.style.height = headerHeight + 'px'
  console.log(headerHeight)
}

closeWhenClickingOnBg('.search__body', '', document.querySelector('.search'));

searchOpen()
function searchOpen() {
  const btnElems = document.querySelectorAll('.header__search-btn')
  const search = document.querySelector('.search')
  const input = document.querySelector('.search__form-input')
  
  for (let i = 0; i < btnElems.length; i++) {
    const btn = btnElems[i];
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      setTimeout(function (){
        input.focus()
      }, 100);
      search.classList.add('_show')
      body.classList.add('_show')
    })
  }
}

searchClose();
function searchClose() {
  const btn = document.querySelector('.search-close')
  const search = document.querySelector('.search')

  btn.addEventListener('click', (e) => {
    e.preventDefault()
    search.classList.remove('_show')
    body.classList.remove('_show')

  })
}


// // Модальные окна
// if (document.querySelector('.modal') && document.querySelector('[data-open-modal]')) {
//   const btnElems = document.querySelectorAll('[data-open-modal]');

//   for (let i = 0; i < btnElems.length; i++) {
//     btnElems[i].addEventListener('click', () => {
//       const btnData = btnElems[i].dataset.openModal,
//             modal = document.querySelector(`#${btnData}`);
  
//       showModal(modal);
      
//       const btnClose = modal.querySelector('.modal-close');

//       closeWhenClickingOnBtnClose(modal, btnClose);
//       closeWhenClickingOnBg(modal.querySelector('.modal-body'), '', modal);
//     })
//   }
  
// }

// // Показать модальное окно
// function showModal(modal) {
//   modal.classList.add('_show');
//   body.classList.add('_lock');
// }

// // Закрытие модального окна при клике по крестику
// function closeWhenClickingOnBtnClose(item, btnClose, classShow) {
//   classShow = classShow;
//   if (classShow == '' || classShow == undefined) {
//     classShow = '_show';
//   }

//   btnClose.addEventListener('click', closeItem)

//   function closeItem() {
//     item.classList.remove(classShow);    
//     if (document.querySelector('body').classList.contains('_lock')) {
//       document.querySelector('body').classList.remove('_lock');
//     }
//     btnClose.removeEventListener('click', closeItem);
//   }
// }

// const zoomify = (width, height) => {
//   const el = document.querySelector('.zoomify');
//   el.style.width = `${width}px`;
//   el.style.height = `${height}px`;
//   el.addEventListener('mousemove', handleMouseMove, false);
// }

// function handleMouseMove(e) {
//   const dimensions = this.getBoundingClientRect();
//   const [x, y] = [
//     e.clientX - dimensions.left,
//     e.clientY - dimensions.top
//   ];
//   const [percentX, percentY] = [
//     Math.round(100 / (dimensions.width / x)),
//     Math.round(100 / (dimensions.height / y))
//   ];
//   this.style.setProperty('--mouse-x', percentX);
//   this.style.setProperty('--mouse-y', percentY);
// }

// zoomify(320, 212);