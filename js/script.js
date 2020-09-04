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
	settingsButton = document.querySelector('.page-content__settings img'),
	closeSettingsButton = document.querySelector('.page-content__button'),
	settingsCard = document.querySelector('.chat-welcome');


const select = function () {
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

	if (document.querySelector('.select')) {
		document.addEventListener('click', (e) => {
			if (!e.target.closest('.select')) {
				document.querySelector('.select').classList.remove('active');
				document.querySelector('.select-header__icon').classList.remove('active');
			}
		});
	}

	selectHeader.forEach(item => {
		item.addEventListener('click', selectToggle);
	});

	selectItem.forEach(item => {
		item.addEventListener('click', selectChoose);
	});
};

select();

menu.addEventListener('click', () => {
	menu.classList.toggle('active');
	menuSide.classList.toggle('active');
});

document.addEventListener('click', (e) => {
	if (!e.target.closest('.header__menu')) {
		menuSide.classList.remove('active');
		menu.classList.remove('active');
	}
});

const hoodContent = document.querySelector('.hood-content'),
	emojiMove = document.querySelectorAll('.items-dynamic__item');

if (hoodContent) {
	hoodContent.addEventListener('mousemove', (e) => {
		const x = e.pageX / window.innerWidth,
			y = e.pageY / window.innerHeight;

		emojiMove.forEach(item => {
			item.style.transform = 'translate(-' + x * 10 + 'px, -' + y * 10 + 'px)';
		});
	});
}

document.body.onload = function () {
	setTimeout(function () {
		$('#ctn-preloader').addClass('loaded');
		// Once the preloader has finished, the scroll appears
		$('#preloader-body').removeClass('no-scroll-y');

		if ($('#ctn-preloader').hasClass('loaded')) {
			// It is so that once the preloader is gone, the entire preloader section will removed
			$('#preloader').delay(1000).queue(function () {
				$(this).remove();
			});
		}
	}, 500);
};


let isiPhone = (navigator.userAgent.match(/iPhone/i) != null);


if (isiPhone) {
    function myFunction(x) {
		if (x.matches) { // Если медиа запрос совпадает
			if (document.querySelector('.chat-page__send')) {
				document.querySelector('#input-box').addEventListener('touchmove', function (e) {
					e.preventDefault();
				});
			}
		}
	}
	
	let x = window.matchMedia("(max-width: 500px)");
	myFunction(x); // Вызов функции прослушивателя во время выполнения
	x.addListener(myFunction);
}

$('.owl-carousel').owlCarousel({
	margin: 20,
	loop: false,
	autoWidth: true,
	dots: false,
	nav: false,
	// center: true,
	responsive: {
		330: {
			margin: 10
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

if (settingsButton) {
	settingsButton.addEventListener('click', (e) => {
		e.preventDefault();
		settingsCard.classList.add('active');
		document.querySelector('.page-content__chat').classList.add('active');
	});
}

if (closeSettingsButton) {
	closeSettingsButton.addEventListener('click', (e) => {
		settingsCard.classList.remove('active');
		document.querySelector('.page-content__chat').classList.remove('active');
	});
}


const popupLinks = document.querySelectorAll('.js-modal'),
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
		item.addEventListener('click', function (e) {
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

if (document.querySelector('.chat-page__send')) {
	/**
* Анонимная самовызывающаяся функция-обертка
* @param {document} d - получает документ
*/
	!function (d) {

		"use strict";

		/**
		 * Полифилл для Object.assign()
		 */
		Object.assign || Object.defineProperty(Object, "assign", { enumerable: !1, configurable: !0, writable: !0, value: function (e, r) { "use strict"; if (null == e) throw new TypeError("Cannot convert first argument to object"); for (var t = Object(e), n = 1; n < arguments.length; n++) { var o = arguments[n]; if (null != o) for (var a = Object.keys(Object(o)), c = 0, b = a.length; c < b; c++) { var i = a[c], l = Object.getOwnPropertyDescriptor(o, i); void 0 !== l && l.enumerable && (t[i] = o[i]) } } return t } });

		/**
		 * Переменная необходима для правильной работы форматирования в IE
		 * @type {boolean}
		 */
		var _onPaste_Strip = false;

		/**
		 * Главный объект
		 * @type {Object}
		 */
		var einput = {};

		/**
		 * Shortcut для preventDefault()
		 * @param {Event} e - получает событие
		 */
		var prevent = function (e) {
			e.preventDefault();
		};

		/**
		 * Функция форматирования контента при вставке в поле
		 * @param {Event} e - событие
		 * @param {Number} maxlength - максимальная длина контента
		 */
		einput.format = function (e, maxlength) {
			if (e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
				e.preventDefault();
				var text = e.originalEvent.originalEvent.clipboardData.getData("text/plain");
				if (text.length > maxlength) text = text.substring(0, maxlength);
				d.execCommand("insertText", false, text);
			} else if (e.clipboardData && e.clipboardData.getData) {
				e.preventDefault();
				var text = e.clipboardData.getData("text/plain");
				if (text.length > maxlength) text = text.substring(0, maxlength);
				d.execCommand("insertText", false, text);
			} else if (window.clipboardData && window.clipboardData.getData) {
				if (!_onPaste_Strip) {
					_onPaste_Strip = true;
					e.preventDefault();
					d.execCommand("ms-pasteTextOnly", false);
				}
				_onPaste_Strip = false;
			}
		};

		/**
		 * Функция установки каретки в необходимую позицию
		 * @param {Object} el - необходимый элемент
		 * @param {String} [place] - положение каретки
		 */
		einput.caret = function (el, place) {
			el = el || einput.els.field;
			var range = d.createRange();
			var sel = function () {
				var s = window.getSelection();
				s.removeAllRanges();
				s.addRange(range);
			};
			switch (place) {
				case "after": // после указанного элемента
					range.setStartAfter(el);
					range.setEndAfter(el);
					if (d.getSelection) sel();
					break;
				case "select": // выделение всего контента в элементе
					range.selectNodeContents(el);
					sel();
					break;
				default: // вставка в элемент после контента
					el.focus();
					range.selectNodeContents(el);
					range.collapse(false);
					sel();
			}
		};

		/**
		 * Функция очистки поля
		 * @param {String} tag - удаляемый тег
		 */
		einput.clear = function (tag) {
			var el = einput.els.field;
			if (tag) {
				var tags = el.getElementsByTagName(tag);
				while (tags[0]) tags[0].parentNode.removeChild(tags[0]);
			} else while (el.firstChild) el.removeChild(el.firstChild);
			einput.caret();
		};

		/**
		 * Функция получения контента поля
		 * @returns {String} - возвращает введеный текст
		 */
		einput.get = function () {
			einput.clear("br");
			return einput.els.field.innerHTML.replace(/<img.*?class="emoji e(.*?)".*?>/g, "*$1*").replace(/&nbsp;/g, " ").replace(/\s\s+/g, " ").trim();
		};

		/**
		 * Функция вставки смайлика в строку
		 * @param {Event} e - событие, возникающее при клике по смайлику из панели
		 */
		einput.insert = function (e) {
			var el = einput.els.field;

			// пробелы до и после смайла
			var spaceBefore = d.createTextNode("\u00A0");
			var spaceAfter = d.createTextNode("\u00A0");

			// генерация смайла
			var img = d.createElement("img");
			img.classList.add("emoji");
			img.classList.add(e.target.classList[1]);
			img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAAtJREFUCNdjIBEAAAAwAAFletZ8AAAAAElFTkSuQmCC";
			img.width = 16;
			img.height = 16;
			img.setAttribute("onresizestart", "return false");
			img.setAttribute("oncontrolselect", "return false");

			// вставка смайлика в опредленное кареткой место (если поддерживается браузером)
			if (window.getSelection) {
				var sel = window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					var currentEl = sel.focusNode.tagName ? sel.focusNode : sel.focusNode.parentNode;
					if (currentEl === el || currentEl === el.parentNode) {
						var range = window.getSelection().getRangeAt(0);
						range.insertNode(spaceBefore);
						range.insertNode(img);
						if (el.innerHTML.length > 0) range.insertNode(spaceAfter);
						einput.caret(spaceBefore, "after");
						return true;
					}
				}
			}

			// Стандартная вставка смайла, если положение каретки не задано
			el.appendChild(spaceBefore);
			el.appendChild(img);
			el.appendChild(spaceAfter);
			einput.caret();
		};

		/**
		 * Функция инициализации поля и панели смайлов
		 * @param {Object} [settings] - принимает объект с настройками
		 */
		einput.init = function (settings) {

			// предварительные настройки
			settings = Object.assign({}, {
				inputId: "input-box",         // id родительского элемента, в который должна вставляться строка
				placeholder: "Напишите сообщение...", // placeholder для пустой строки
				autocomplete: false,               // наличие атрибута autocomplete
				spellcheck: true,                // наличие атрибута spellcheck
				autofocus: true,                // наличие атрибута autofocus
				typefocus: true,                // автофокус в строку при печатании
				pastecheck: true,                // форматирование при вставке контента в строку
				tabindex: "-1",                // значение атрибута tabindex
				maxlength: 1000,                // максимальная длина контента в строке
				callback: function (text) {     // функция, выполяемая после отправки сообщения
					console.log(text);
					einput.clear();
				},
				panelId: "emoji-box",   // id родительского элемента, в который должна вставляться панель смайлов
				emojiCount: 207            // максимальное количество смайлов в спрайте
			}, settings);

			// подготовка атрибутов autocomplete и spellcheck
			settings.autocomplete = (settings.autocomplete) ? "on" : "off";
			settings.spellcheck = (settings.spellcheck) ? "true" : "false";

			// поиск начальных элементов
			var inputBox = d.getElementById(settings.inputId);
			var emojiBox = d.getElementById(settings.panelId);

			// генерация поля ввода
			inputBox.setAttribute("contenteditable", "false");
			inputBox.insertAdjacentHTML('afterbegin', '<div id="' + settings.inputId + '-field" tabindex="' + settings.tabindex + '" autocomplete="' + settings.autocomplete + '" spellcheck="' + settings.spellcheck + '" _moz_resizing="false" contenteditable></div><div id="' + settings.inputId + '-placeholder" data-ph="' + settings.placeholder + '" contenteditable="false"></div>');

			// генерация панели смайлов
			emojiBox.insertAdjacentHTML("afterbegin", "<div></div>");
			var frag = d.createDocumentFragment();
			var emoji = {};
			for (var k = 0; k < settings.emojiCount; k++) {
				emoji["*" + k] = k;
				var smile = d.createElement("span");
				smile.classList.add("emoji");
				smile.classList.add("e" + k);
				frag.appendChild(smile);
			}
			emojiBox.firstChild.appendChild(frag);

			// вывод элементов для глобального использования
			einput.els = {
				fieldBox: inputBox,
				field: inputBox.firstChild,
				fieldPh: inputBox.lastChild,
				panelBox: emojiBox,
				panel: emojiBox.firstChild
			};

			// добавление обработчиков
			var input = einput.els.field;
			input.addEventListener("drag", prevent);
			input.addEventListener("drop", prevent);
			input.addEventListener("resize", prevent);
			input.addEventListener("click", function (e) {// вставка каретки после добавленного смайла
				if (e.target.classList.contains("emoji")) einput.caret(input, "after");
			});
			input.addEventListener("keypress", function (e) {
				var key = e.which || e.keyCode;
				var l = this.textContent.length;

				// ...
				if (l > settings.maxlength) (key === 8 || key === 46 || key === 39 || key === 37) ? null : prevent(e);

				if (key === 13) { // переопредление действия клавиши Enter

					// изменение стандартного браузерного форматирования contenteditable
					if (d.queryCommandSupported("defaultParagraphSeparator")) d.execCommand("defaultParagraphSeparator", false, "");
					if (d.queryCommandSupported("insertHTML")) d.execCommand("insertHTML", false, "");
					if (d.queryCommandSupported("insertBrOnReturn")) d.execCommand("insertBrOnReturn", false, "");

					// вызов callback, в который передается текст
					settings.callback(einput.get());
					prevent(e);
				}
			});
			if (settings.autofocus) einput.caret();
			if (settings.pastecheck) input.addEventListener("paste", function (e) {
				einput.format(e, settings.maxlength);
			});
			if (settings.typefocus) {
				d.addEventListener("keydown", function (e) {
					if (d.activeElement !== input) einput.caret();
					e.stopPropagation();
				});
			}

			// отключение возможности resize для строки
			if (d.queryCommandSupported("enableObjectResizing")) d.execCommand("enableObjectResizing", false, false);

			// удаление лишних дочерних <br>, которые добавляет в строку Firefox
			if ("MozAppearance" in d.documentElement.style) {
				input.addEventListener("keyup", function (e) {
					if (input.textContent.length < 2 && e.key === "Backspace") {
						einput.clear("br");
						input.innerHTML = input.innerHTML.trim();
						einput.caret(input);
					}
					e.stopPropagation();
				});
			}

			// добавление событий для панели
			var panel = einput.els.panel;
			panel.addEventListener("click", function (e) {
				if (e.target.classList.contains("emoji")) einput.insert(e);
			});
			panel.addEventListener("mousedown", prevent);
		};

		window.einput = einput;

	}(document);

	// добавление события, обрабатывающего отображение или скрытие панели смайлов
	document.getElementById("btn").addEventListener("click", function (e) {
		this.classList.toggle("active");
		einput.els.panelBox.classList.toggle("show");
	});

	// запуск основной функции
	einput.init();
}

// // Form JS

	//jQuery time
	var current_fs, next_fs, previous_fs; //fieldsets
	var left, opacity, scale; //fieldset properties which we will animate
	var animating; //flag to prevent quick multi-click glitches

	$(".next").click(function(){
		if(animating) return false;
		animating = false;
		
		current_fs = $(this).parent();
		next_fs = $(this).parent().next();
		
		//activate next step on progressbar using the index of next_fs
		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
		
		//show the next fieldset
		next_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale current_fs down to 80%
				scale = 1 - (1 - now) * 0.2;
				//2. bring next_fs from the right(50%)
				left = (now * 50)+"%";
				//3. increase opacity of next_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({
	        'transform': 'scale('+scale+')',
			'position': 'relative',
			'visibility': 'visible',
			'position': 'relative',
			'transform': 'scale(1)'
	      });
				next_fs.css({'left': left, 'opacity': opacity, 'visibility': 'visible', 'position': 'relative', 'transform': 'scale(1)'});
			}, 
			duration: 0, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});

	$(".previous").click(function(){
		if(animating) return false;
		animating = true;
		
		current_fs = $(this).parent();
		previous_fs = $(this).parent().prev();
		
		//de-activate current step on progressbar
		$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
		
		//show the previous fieldset
		previous_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale previous_fs from 80% to 100%
				scale = 0.8 + (1 - now) * 0.2;
				//2. take current_fs to the right(50%) - from 0%
				left = ((1-now) * 50)+"%";
				//3. increase opacity of previous_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'left': left});
				previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
			}, 
			duration: 0, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});

	$(".submit").click(function(){
		return false;
	});

	if (document.querySelector('.acca__link')) {
		document.querySelector('.acca__link').addEventListener('click', (e) => {
			e.preventDefault();
			document.querySelector('#progressbar').style.transform = 'scale(0)';
			document.querySelector('.fieldset__login').classList.add('active');
			document.querySelectorAll('.fieldset').forEach(item => {
				item.style.transform = 'scale(0)';
			});
			document.querySelector('.previous-log').addEventListener('click', () => {
				document.querySelector('.fieldset__login').classList.remove('active');
				document.querySelectorAll('.fieldset').forEach(item => {
					item.style.transform = 'scale(1)';
				});
				document.querySelector('#progressbar').style.transform = 'scale(1)';
			});
		});
	}

const openImg = document.querySelectorAll('.interlocutor-message__image-btn'),
	  vipCard = document.querySelectorAll('.vip-image');

openImg.forEach( item => {
	item.addEventListener('click', (e) => {
		e.preventDefault();
		if (e.target) {
			vipCard.forEach(el => {
				el.classList.add('active');
				document.querySelectorAll('.vip-image__close').forEach(close => {
					close.addEventListener('click', () => {
						el.classList.remove('active');
						document.querySelectorAll('.interlocutor-message__image img').forEach( i => {
							i.style.filter = 'blur(12px)';
						});
					});
				});
				setTimeout(function () {
					if (el.classList.contains('active')) {
						document.querySelectorAll('.interlocutor-message__image img').forEach( i => {
							i.style.filter = 'blur(0px)';
						});
					}
				}, 140);

			});
		}
	});
});

const popupSpoilHead = document.querySelector('.spoil-modal__header');

if (popupSpoilHead) {
	popupSpoilHead.addEventListener('click', () => {
		popupSpoilHead.classList.toggle('active');
		$('.spoil-modal__body').slideToggle(300);
	});
}

setTimeout(function() {
    $('#ctn-preloader-chat').addClass('loaded');

    if ($('#ctn-preloader-chat').hasClass('loaded')) {
     
      $('.ctn-preloader-chat').queue(function() {
		$(this).addClass('unloaded');
      });
    }
  }, 2000);