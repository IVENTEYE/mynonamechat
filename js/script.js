(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());

const menu = document.querySelector('.header__menu-burger'),
      menuSide = document.querySelector('.header__menu-body'),
	  header = document.querySelector('.header'),
	  settingsButton = document.querySelector('.page-content__settings'),
	  closeSettingsButton = document.querySelector('.page-content__button'),
	  settingsCard = document.querySelector('.chat-welcome');

const headerScroll = () => {
    if (window.pageYOffset > 80) {
        header.classList.add('fixed');
    } else {
        header.classList.remove('fixed');
    }
};

const select = function()  {
	const selectHeader = document.querySelectorAll('.select-header'),
		  selectItem = document.querySelectorAll('.select-body__item');

	const selectToggle = function (e) {
		this.parentElement.classList.toggle('active');
		if (this.parentElement.classList.contains('active')) {
			document.querySelector('.select-header__icon').classList.add('active');
		} else {
			document.querySelector('.select-header__icon').classList.remove('active');
		}
	};

	const selectChoose = function () {
		const text = this.innerHTML,
		      select = this.closest('.select'),
			  currentText = this.closest('.select').querySelector('.select-header__current');

		currentText.innerHTML = text;
		select.classList.remove('active');
		document.querySelector('.select-header__icon').classList.remove('active');
	};

	document.addEventListener('click', (e) => {
		if (!e.target.closest('.select')) {
			document.querySelector('.select').classList.remove('active');
			document.querySelector('.select-header__icon').classList.remove('active');
		}
	});

	selectHeader.forEach( item => {
		item.addEventListener('click', selectToggle);
	});

	selectItem.forEach( item => {
		item.addEventListener('click', selectChoose);
	});
};

select();

menu.addEventListener('click', () => {
    menu.classList.toggle('active');
	menuSide.classList.toggle('active');
	// if (menuSide.classList.contains('active')) {
	// 	document.querySelector('body').style.overflowY = 'hidden';
	// } else {
	// 	document.querySelector('body').style.overflowY = 'visible';
	// }
});

document.addEventListener('click', (e) => {
	if (!e.target.closest('.header__menu')) {
		menuSide.classList.remove('active');
		menu.classList.remove('active');
		// document.querySelector('body').style.overflow = 'visible';
	}
});

window.addEventListener('scroll', headerScroll);

const hoodContent = document.querySelector('.hood-content'),
      emojiMove = document.querySelectorAll('.items-dynamic__item');

hoodContent.addEventListener('mousemove', (e) => {
    const x = e.pageX / window.innerWidth,
          y = e.pageY / window.innerHeight;
      
    emojiMove.forEach( item => {
        item.style.transform =  'translate(-' + x * 10 + 'px, -' + y * 10 + 'px)';
    });
});

document.body.onload = function() {
		setTimeout(function() {
		$('#ctn-preloader').addClass('loaded');
		// Once the preloader has finished, the scroll appears
		$('#preloader-body').removeClass('no-scroll-y');
	
		if ($('#ctn-preloader').hasClass('loaded')) {
		  // It is so that once the preloader is gone, the entire preloader section will removed
		  $('#preloader').delay(1000).queue(function() {
			$(this).remove();
		  });
		}
	  }, 500);
};

$('.owl-carousel').owlCarousel({
	margin:20,
    loop:true,
    autoWidth:true,
	dots:false,
	nav: false,
	// center: true,
    responsive:{
      330:{
        margin:10
      }
    }
});

$("#example_id").ionRangeSlider({
	type: "double",
	min: 15,
	max: 100,
	from: 15,
	to: 100,
});

settingsButton.addEventListener('click', (e) => {
	e.preventDefault();
	settingsCard.classList.add('active');
	document.querySelector('.page-content__chat').style.display = 'block';
});

closeSettingsButton.addEventListener('click', (e) => {
	settingsCard.classList.remove('active');

	setTimeout(function() {
		document.querySelector('.page-content__chat').style.display = 'none';
	  }, 300);
});

const popupLinks = document.querySelectorAll('.page-tape__add'),
      body = document.querySelector('body'),
      lockPadding = document.querySelectorAll('.lock-padding'), // для фиксированных обьектов
      timeout = 800;

let unlock = true;

if (popupLinks.length > 0) {
    popupLinks.forEach(item => {
        item.addEventListener('click', function (e) {
            const popupName = item.getAttribute('href').replace('#', ''),
                  currentPopup = document.getElementById(popupName);
            popupOpen(currentPopup);
            e.preventDefault();
        });
    });
}

const popupCloseIcon = document.querySelectorAll('.js-modal-close');

if (popupCloseIcon.length > 0) {
    popupCloseIcon.forEach(item => {
        item.addEventListener('click', function(e) {
            popupClose(item.closest('.popup'));
            e.preventDefault();
        });
    });
}

function popupOpen(currentPopup) {
    if (currentPopup && unlock) {
        const popupActive = document.querySelector('.popup.active');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }
        currentPopup.classList.add('active');
        currentPopup.addEventListener('click', function (e) {
            if (!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'));
            }
        });
    }
}

function popupClose(popupActive, doUnLock = true) {
    if (unlock) {
        popupActive.classList.remove('active');
        if (doUnLock) {
            bodyUnLock();
        }
    }
}

function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.popup').offsetWidth + 'px';
    if (lockPadding.langth > 0) {
        lockPadding.forEach(item => {
            item.style.paddingRight = lockPaddingValue;
        });
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock'); // в css добавить body.lock overflow: hidden; 
    
    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

function bodyUnLock() {
    setTimeout(function () {
        if (lockPadding.length > 0) {
            lockPadding.forEach(item => {
                item.style.paddingRight = '0px';
            });
        }
        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeout);

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

document.addEventListener('keydown', (e) => {
    if (e.which === 27) {
        const popupActive = document.querySelector('.popup.active');
        popupClose(popupActive);
    }
});

(function () {
    //проверяем поддержку
    if (Element.prototype.closest) {
        // реализуем
        Element.prototype.closest = function (css) {
            var node = this;
            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }
})();
(function () {
    if (Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector;
    }
})();