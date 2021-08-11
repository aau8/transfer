// Мини функции
function removeClass(item,itemClass) {
  item.classList.remove(itemClass)
}

function allRemove(items,itemClass) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.classList.remove(itemClass)
  }
}

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

// Яндекс карта
function init () {

  // Создаем карту с добавленными на нее кнопками.
  var myMap = new ymaps.Map('map-way', {
      center: [44.948237, 34.100318],
      zoom: 8,
      controls: ["zoomControl"]
  }, {
      buttonMaxWidth: 300
  })
  myMap.behaviors.disable('scrollZoom')

  let myCollection = new ymaps.GeoObjectCollection()
  // Заолнение дат в инпутах Dadata.ru
  const dadata_token = "a0e1e8fc12f3e41d85bc576f2eebba089e7ae38e"
  let addressWhereFrom
  let addressWhere
  $("#address_where_from").suggestions({
    token: dadata_token,
    type: "ADDRESS",
    constraints: {
      locations: {
        country: "Россия",
        region: "Крым",
      },
    },
    /* Вызывается, когда пользователь выбирает одну из подсказок */
    onSelect: function(suggestion) {
      addressWhereFrom = [suggestion.data.geo_lat, suggestion.data.geo_lon]
      localStorage.setItem('whereFrom', addressWhereFrom)
      var multiRoute = new ymaps.multiRouter.MultiRoute({
        // Описание опорных точек мультимаршрута.
        referencePoints: [
          addressWhereFrom,
          addressWhere
        ],
        // Параметры маршрутизации.
        params: {
          // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
          results: 1,
          // Тип маршрута: на общественном транспорте.
          routingMode: "auto"
        }
    }, {
        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true
    });
    // Добавляем мультимаршрут на карту.
    myCollection.removeAll()
    myCollection.add(multiRoute)
    console.log(addressWhere, addressWhereFrom)
    if (addressWhereFrom != undefined && addressWhere != undefined) {
      myMap.geoObjects.add(myCollection)
      multiRoute.model.events.add('requestsuccess', function() {
        let activeRoute = multiRoute.getActiveRoute();
        localStorage.setItem('route', parseInt(activeRoute.properties.get("distance").text))
        localStorage.setItem('travelTime', activeRoute.properties.get("duration").text)
        console.log(parseInt(activeRoute.properties.get("distance").text))
        console.log(activeRoute.properties.get("duration").text)
        calcRoute()
        classAutoPrice()
      })
    }
    }
  });
  $("#address_where").suggestions({
    token: dadata_token,
    type: "ADDRESS",
    constraints: {
      locations: {
        country: "Россия",
        region: "Крым",
      },
    },
    onSelect: function(suggestion) {
        addressWhere = [suggestion.data.geo_lat, suggestion.data.geo_lon]
        localStorage.setItem('where', addressWhere)
        var multiRoute = new ymaps.multiRouter.MultiRoute({
          referencePoints: [
            addressWhereFrom,
            addressWhere
          ],
          params: {
            results: 1,
            routingMode: "auto"
          }
      }, {
        boundsAutoApply: true,
      });
      myCollection.removeAll()
      myCollection.add(multiRoute)
      if (addressWhereFrom != undefined && addressWhere != undefined) {
        myMap.geoObjects.add(myCollection)
        multiRoute.model.events.add('requestsuccess', function() {
          let activeRoute = multiRoute.getActiveRoute();
          localStorage.setItem('route', parseInt(activeRoute.properties.get("distance").text))
          localStorage.setItem('travelTime', activeRoute.properties.get("duration").text)
          console.log(parseInt(activeRoute.properties.get("distance").text))
          console.log(activeRoute.properties.get("duration").text)
          calcRoute()
          classAutoPrice()
        })
      }
    }
  });
}
ymaps.ready(init);

// Калькулятор поездки
function calcRoute() {
  const route = localStorage.getItem('route'),
        time  = localStorage.getItem('travelTime')

  const classAutoSelected = document.querySelector('.calc__class-card._selected'),
  classAuto = classAutoSelected.dataset.classAuto,
  priceAuto = classAutoSelected.dataset.priceAuto

  const minTotalPrice = 100

  let totalPrice = route * priceAuto
  if (totalPrice < minTotalPrice) {
    totalPrice = minTotalPrice
  }

  let additServiceTotalPrice = additionalServices()
  totalPrice += additServiceTotalPrice

  const calcTotal = document.querySelector('#calc-total')
  const calcRoute = document.querySelector('#calc-route')
  const calcTime = document.querySelector('#calc-time')

  calcTotal.innerHTML = totalPrice + ' ₽'
  calcRoute.innerHTML = route + ' км.'
  calcTime.innerHTML = time
}

function additionalServices() {
  const servicesItemElems = document.querySelectorAll('.calc__services__item')
  console.log(servicesItemElems)
  let servicesItemTotalPrice = 0
  if (servicesItemElems) {
    for (let i = 0; i < servicesItemElems.length; i++) {
      const servicesItem = servicesItemElems[i];
      const servicesItemPrice = parseInt(servicesItem.dataset.priceItem)
      servicesItemTotalPrice += servicesItemPrice
      console.log(servicesItemPrice)
    }
    console.log(servicesItemTotalPrice)
  }
  return servicesItemTotalPrice
}

// В карточках классов авто указывается общая цена за поездку
function classAutoPrice() {
  const cardAutoElems = document.querySelectorAll('.calc__class-card')
  const route = localStorage.getItem('route')

  for (let i = 0; i < cardAutoElems.length; i++) {
    const cardAuto = cardAutoElems[i];

    const priceAuto = cardAuto.dataset.priceAuto
    const totalPriceAuto = route * priceAuto

    const calcClassPrice = cardAuto.querySelector('.calc__class-price')
    calcClassPrice.innerHTML = totalPriceAuto + ' ₽'
  }
}

// Изменение класса авто
changeClassAuto()
function changeClassAuto() {
  const cardAutoElems = document.querySelectorAll('.calc__class-card')

  for (let i = 0; i < cardAutoElems.length; i++) {
    const cardAuto = cardAutoElems[i];
    
    cardAuto.addEventListener('click', () => {
      const calcClassPrice = cardAuto.querySelector('.calc__class-price')
      const valueCalcClassPrice = parseInt(calcClassPrice.innerHTML)
      const calcTotal = document.querySelector('#calc-total')

      calcTotal.innerHTML = valueCalcClassPrice + ' ₽'
    })
  }
}

// Отображение меню
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

// Высота блока поиска
searchHeight()
function searchHeight() {
  const search = document.querySelector('.search__body')
  const header = document.querySelector('.header')

  const headerHeight = header.scrollHeight
  search.style.height = headerHeight + 'px'
}

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
      body.classList.add('_lock')
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
    body.classList.remove('_lock')

  })
}

closeWhenClickingOnBg('.search__body', '', document.querySelector('.search'));

// Слайдер на главном экране
const mainSlider = new Swiper('.main__slider', {
  
  slidesPerView: 1, // Кол-во показываемых слайдов
  spaceBetween: 0, // Расстояние между слайдами
  // loop: true, // Бесконечный слайдер
  // freeMode: true, // Слайдеры не зафиксированны
  // touchMoveStopPropagation: false,
  // noSwiping: false,
  allowTouchMove: false,
  // effect: 'fade',

  breakpoints: {
    1200: {

    },
    700: {

    },
    400: {

    }
  },

  pagination: {
    el: '.main__slider__pagination',
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  },
});

// Слайдер в разделе отзывы
const reviewsSlider = new Swiper('.reviews__body', { 
  
  slidesPerView: 3, // Кол-во показываемых слайдов
  spaceBetween: 14, // Расстояние между слайдами
  // allowTouchMove: false,

  breakpoints: {
    900: {
      slidesPerView: 3,
    },
    560: {
      slidesPerView: 2,
    },
    0: {
      slidesPerView: 1,
    },
  },

  pagination: {
    el: '.reviews__cards__pagination',
    clickable: true,
  },
});

// Инпуты
// Если инпут не будет пустой, элементу с классом input будет присвоен класс _valid
// validInput();
function validInput() {
  const elems = document.querySelectorAll('.input');

  for (let i = 0; i < elems.length; i++) {
    const input = elems[i].querySelector('input');

    input.addEventListener('input', () => {
      if (input.value != '') {
        input.parentElement.classList.add('_valid');
      }
      else {
        input.parentElement.classList.remove('_valid');
      }
    })
  }
}

// Если инпут с классом _req будет пустым, ему присвоется класс _error
requiredInput();
function requiredInput() {
  const inputElems = document.querySelectorAll('._req');

  for (let i = 0; i < inputElems.length; i++) {
    const input = inputElems[i];

    input.addEventListener('input', () => {
      if (input.value == '') {
        input.parentElement.classList.add('_error');
      }
      else {
        input.parentElement.classList.remove('_error');
      }
    })
  }
}

// Первая буква каждого слова будет в высоком регистре
upperCaseAllFirstLetter('input');
function upperCaseAllFirstLetter(inputs) {
  const inputElems = document.querySelectorAll(inputs);

  for (let i = 0; i < inputElems.length; i++) {
    const input = inputElems[i];
   
    input.addEventListener('input', () => {
      input.value = input.value.replace(/(\s|^)[а-яёa-z]/g, function(match) {
        return match.toUpperCase();
      });
    })
  }
}

// В инпуте могут быть только буквы английские и русские
validInputName();
function validInputName() {
  const inputElems = document.querySelectorAll('input[name="user_name"]');

  for (let i = 0; i < inputElems.length; i++) {
    const input = inputElems[i];
    
    input.addEventListener('keypress', function(e) {
      const inputCharCode = e.charCode;
      if((inputCharCode >= 48 && inputCharCode <= 57) && (inputCharCode != 43 && inputCharCode != 0 && inputCharCode != 40 && inputCharCode != 41 && inputCharCode != 45)) {
        e.preventDefault();
      }
    });
  }
  // inputElems.forEach(input => {
  // })
}

// В начале не может быть пробела. 2 пробела подряд меняются на один
inputSpace();
function inputSpace() {
  const inputElems = document.querySelectorAll('input, textarea');
  for (let i = 0; i < inputElems.length; i++) {
    const input = inputElems[i];
    
    input.addEventListener('keypress', (e) => {
      if (input.value.length < 1) {
        const inputCharCode = e.charCode;
        if (inputCharCode == 32) {
          e.preventDefault();
        }
      }
    })
    
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\s\s+/g, ' ');
    })
  }
}

calcSelectClass();
function calcSelectClass() {
  const cardElems = document.querySelectorAll('.calc__class-card')

  for (let i = 0; i < cardElems.length; i++) {
    const card = cardElems[i];
    card.addEventListener('click', () => {
      allRemove(cardElems, '_selected')
      card.classList.add('_selected')
      const data = card.dataset.classAuto
      localStorage.setItem('classAuto', data)
    })
  }
}

// Отображение tooltip
tooltip()
function tooltip() {
  const elems = document.querySelectorAll('[data-tooltip]')

  for (let i = 0; i < elems.length; i++) {
    const elem = elems[i];
    const data = elem.dataset.tooltip
    const elemClass = elem.getAttribute('class')
    const tooltip = document.createElement('span')

    elem.style.position = 'relative'
    elem.style.zIndex = '1'
    tooltip.classList.add('tooltip')
    tooltip.classList.add(elemClass + '-tooltip')
    tooltip.innerText = data

    elem.append(tooltip)
  }
}

// Аккордеоны
accordion('.faq__acc__header')
function accordion(selector) {
  const accHeaderElem = document.querySelectorAll(selector)
  accHeaderElem.forEach((accHeader) => {
    accHeader.addEventListener('click', () => {
      for (let i = 0; i < accHeaderElem.length; i++) {
        accHeaderElem[i].classList.remove('_open');
        if (!accHeaderElem[i].classList.contains('_open')) {
          accHeaderElem[i].nextElementSibling.style.maxHeight = 0;
        }
      }
      accHeader.classList.toggle('_open');
      accHeader.nextElementSibling.style.maxHeight = accHeader.nextElementSibling.scrollHeight + 'px';
    });
    accHeader.nextElementSibling.style.maxHeight = '0';
    for (let i = 0; i < accHeaderElem.length; i++) {
      if (accHeaderElem[i].classList.contains('_open')) {
        accHeaderElem[i].nextElementSibling.style.maxHeight = accHeader.nextElementSibling.scrollHeight + 'px';
      }
    }
  });
}

// Отображение доп. опций "Номер рейса" и "Аренда"
additionalyInputs()
function additionalyInputs() {
  const checkboxElems = document.querySelectorAll('[data-show-checkbox]')

  for (let i = 0; i < checkboxElems.length; i++) {
    const checkbox = checkboxElems[i];
    checkbox.addEventListener('click', () => {
      const data = checkbox.dataset.showCheckbox;
      const inputElems = document.querySelectorAll(`[data-show-input=${data}]`)
      for (let i = 0; i < inputElems.length; i++) {
        const input = inputElems[i];
        if (checkbox.checked) {
          input.classList.add('_show')
        }
        else {
          input.classList.remove('_show')
        }
        }
    })
  }
}

// Кастомный select (можно выбрать что-то одно)
selectOne()
function selectOne() {
  const headerElems = document.querySelectorAll('.select__header')
  for (let i = 0; i < headerElems.length; i++) {
    const header = headerElems[i];
    
    header.addEventListener('click', () => {
      header.classList.toggle('_show')
      selectList(header)
    })
  }

  function selectList(header) {
    const body = header.nextElementSibling
    const items = body.querySelectorAll('.select-item')
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      item.addEventListener('click', () => {
        const value = item.innerHTML
        const title = header.querySelector('.select-title')
        title.innerHTML = value

        const data = item.dataset.selectItem
        title.dataset.selectTitle = data
        selectShowInput(data)

        allRemove(items,'_selected')
        item.classList.add('_selected')
        removeClass(header, '_show')

      })
    }
  }
}

function selectShowInput(data) {
  const inputElems = document.querySelectorAll(`[data-select-input="${data}"]`)
  const allInputElems = document.querySelectorAll('[data-select-input]')
  allRemove(allInputElems, '_show')
  for (let i = 0; i < inputElems.length; i++) {
    const input = inputElems[i];
    input.classList.add('_show')
  }
}

// Поле множественного выбора для доп. услуг
selectMore()
function selectMore() {
  const headerElems = document.querySelectorAll('.select__more__header')
  for (let i = 0; i < headerElems.length; i++) {
    const header = headerElems[i];
    
    header.addEventListener('click', () => {
      header.classList.toggle('_show')
      selectMoreList(header)
    })
  }

  function selectMoreList(header) {
    const body = header.nextElementSibling
    const items = body.querySelectorAll('.select__more-item')
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      item.addEventListener('click', () => {
        item.classList.toggle('_selected')

        let array = []
        const itemSelectedElems = body.querySelectorAll('.select__more-item._selected')
        for (let i = 0; i < itemSelectedElems.length; i++) {
          const itemSelected = itemSelectedElems[i]
          const data = itemSelected.dataset.addItem
          array.push(data)
        }
          header.dataset.addArray = array
          selectMoreCreateTable(item)
          selectMoreTableRemove(header)
      })
    }
  }

  function selectMoreCreateTable(item) {
    const data = item.dataset.addItem
    const tableExists = document.querySelector(`.calc__services__item[data-add-table="${data}"]`)
    calcRoute()
    if (!tableExists) {
      const title = item.innerHTML
      const table = document.createElement('li')
      const tableContainer = document.querySelector('.calc__services__select')
      const priceItem = item.dataset.priceItem

      table.dataset.addTable = data
      table.dataset.priceItem = priceItem
      table.classList.add('calc__services__item')
      table.innerHTML = `
        <span class="calc__services__select-text">${title}</span>
        <span class="calc__services__select-remove">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3L3.00004 8.99996M3 3L8.99997 8.99996" stroke="#CCCCCC" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </span>
      `
      tableContainer.append(table)
      return
    }
    else {
      tableExists.remove()
    }
  }

  function selectMoreTableRemove(header) {
    const tableElems = document.querySelectorAll('.calc__services__item')
    calcRoute()
    for (let i = 0; i < tableElems.length; i++) {
      const table = tableElems[i];
      table.addEventListener('click', function () {
        this.remove()
        const data = this.dataset.addTable
        const item = document.querySelector(`.select__more-item[data-add-item="${data}"]`)
        item.classList.remove('_selected')
  
        let array = []
        const itemSelectedElems = body.querySelectorAll('.select__more-item._selected')
        for (let i = 0; i < itemSelectedElems.length; i++) {
          const itemSelected = itemSelectedElems[i]
          const data = itemSelected.dataset.addItem
          array.push(data)
        }
        header.dataset.addArray = array
      })
    }
  }
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

// Размер карты в калькуляторе 
const mediaQuery = window.matchMedia('(max-width: 900px)');
if (mediaQuery.matches) {
  mapSize()
}
function mapSize() {
  const map = document.querySelector('.calc-map')
  const mapHeight = map.scrollWidth
  map.style.height = mapHeight + 'px'
  console.log(mapHeight)
}