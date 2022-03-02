//-------------------------------------------------------------------------------------
//------------------------------------МОДАПЫ-------------------------------------------
//-------------------------------------------------------------------------------------
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelector(".lock-padding");
const join = document.querySelector('join__form');
const feedback = document.querySelector('feedback__form');

let unlock = true;
const timeout = 400;

if (popupLinks.length > 0) {
	for (let i = 0; i < popupLinks.length; i++) {
		const popupLink = popupLinks[i];
		popupLink.addEventListener("click", function(e) {
			const popupName = popupLink.getAttribute('href').replace('#','');
			const currentPopup = document.getElementById(popupName);
			popupOpen(currentPopup);
			e.preventDefault();
		});
	}
}
const popupCloseButton = document.querySelectorAll('.close-button');
if (popupCloseButton.length > 0) {
	for (let i = 0; i < popupCloseButton.length; i++) {
		const cl = popupCloseButton[i];
		cl.addEventListener('click', function (e) {
		popupClose(cl.closest('.popup'));
		e.preventDefault();
		});
	}
}
function popupOpen (currentPopup) {
	if  (currentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		currentPopup.classList.add('open');

		currentPopup.addEventListener("click", function(e) {
			if (!e.target.closest('.popup-content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}
function popupClose (popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}
function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
	if (lockPadding.length > 0) {
			for (let i=0; i < lockPadding.length; i++ ) {
			const el = lockPadding[i];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unlock = false;
	setTimeout(function() {
		unlock = true;
	}, timeout);
};
function bodyUnLock() {
	setTimeout(function () {
		for (let i = 0; i < lockPadding.length; i++) {
			const el = lockPadding[i];
			el.style.paddingRight = '0px';
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

	unlock = false;
	setTimeout(function() {
		unlock = true;
	}, timeout);
}

//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//---------------------------------             ---------------------------------------
//---------------------------------    JQUERY    --------------------------------------
//---------------------------------             ---------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------
//----------------------------------------СЛАЙДЫ-----------------------------------------
//---------------------------------------------------------------------------------------
//-СЛАЙД УЧАСТНИКОВ
new Swiper('.graduates__swiper', {
	navigation: {
			nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	slidesPerView: 1,
	spaceBetween: 30,
	mousewheel: {
		sensitivity: 1,
	},
	breakpoints: {
			750: {
				slidesPerView: 1,
				spaceBetween: 30
			},
			1200: {
				slidesPerView: 2.9,
				spaceBetween: 30,
			}
		},
});
//-СЛАЙД НОВОСТЬ
new Swiper('.new__container', {
	navigation: {
			nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	slidesPerView: 1,
	spaceBetween: 81,
	mousewheel: {
		sensitivity: 1,
	}
});
//---------------------------------------------------------------------------------------
//--------------------------------------НАСТРОЙКИ ФОРМ-----------------------------------
//---------------------------------------------------------------------------------------
// Подключение плагина SELECT
$(document).ready(function() {
	$('.join-learning').select2({
		placeholder: 'По какому напралению вы хотите учиться?',
		width: '100%',
		minimumResultsForSearch: -1,
		dropdownCssClass: 'join-select',
	});
});
$(document).ready(function() {
	$('.join-work').select2({
		placeholder: 'В какой отрасли вы хотите работать?',
		width: '100%',
		minimumResultsForSearch: -1,
		dropdownCssClass: 'join-select'
	});
});

//-----------------------------------------------------------------------------------
//--------------------------------------ПРОВЕРКА ФОРМЫ-------------------------------
//-----------------------------------------------------------------------------------
$(function() {
	$('.join__form,.feedback__form').each(function(){
	var form = $(this),
	btn = form.find('.btn__submit');

	form.find('input, select').val();
	form.find('.rfield').addClass('empty_field');
	function checkInput(){
		form.find('.rfield').each(function(){
			if($(this).val() != '' && $(this).val()!= null && !$(this).hasClass('error'))  {
				$(this).removeClass('empty_field');
			} else {
				$(this).addClass('empty_field');
			}
		});
	}

// Функция для подсветки незаполненных полей
function lightEmpty(){
		form.find('.empty_field').css({'border-color':'#FC0B0B', 'background-color':'#FFF0F0'});
		form.find('.empty_field').siblings('.empty-fields').css({'opacity':'1','visibility':'visible'});
}

// Отключение подсветки при закрытии
setInterval(function(){
	if(!$(document).find('.popup').hasClass("open")) {
		$('.join__form,.feedback__form').find('.empty-fields').css({'opacity':'0','visibility':'hidden'});
		$('.join__form,.feedback__form').find('.empty_field').css({'border-color':'#007EC1', 'background-color':'#F2F8FC'});
		$('#joinLearning, #joinWork').val(''); 
		$('#joinLearning, #joinWork').trigger('change'); 
		$('.form__submit').slideUp();
	}
},200);

// Проверка в режиме реального времени
	setInterval(function(){
		checkInput();
		var sizeEmpty = form.find('.empty_field').length;
		if(sizeEmpty > 0){
			// Все поля раздела заполнены   уведомление отключено   
			$('join__item, .feedback__item').each(function() {
				var fielsetControl = $(this).find('.empty_field').length;
				if(fielsetControl <= 0) {
					$(this).find('.empty-fields').removeAttr('style');
				}
			});
			// 
			if(btn.hasClass('error')){
				return false;
			} else {
				btn.addClass('error');
			}
		} else {
			btn.removeClass('error');
			form.find('.empty-fields').removeAttr('style');
		}
	}, 200);
	// Событие клика по кнопке отправить
		btn.click(function(e){
			if($(this).hasClass('error')){
				lightEmpty();
				return false
			} else {
				e.preventDefault ();
				var JoinEmail = $('#joinMail').val();
				var FeedbackEmail = $('#feedbackMail').val();

				function JoinMail(JoinEmail) {
					var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
					if(!regex.test(JoinEmail)) {
						return false;
					} else{
						return true;
					}
				}
				function FeedbackMail(FeedbackEmail) {
					var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
					if(!regex.test(FeedbackEmail)) {
						return false;
					} else{
						return true;
					}
				}
				console.log('nya');
				if ($('.feedback').hasClass('open')) {

					if (FeedbackMail(FeedbackEmail)==false ) {
						$('.feedback-mail').addClass('error');
						$('.feedback-mail').siblings('.empty-fields').css({'opacity':'1','visibility':'visible'});
						return false;
					} else {
						Submit()
					}
				} else if ($('.join').hasClass('open')) {
					if (JoinMail(JoinEmail) == false ) {
						$('.join-mail').addClass('error');
						$('join').find('.empty_field').siblings('.empty-fields').css({'opacity':'1','visibility':'visible'});
						return false;
					} else {
						Submit()
					}
				}
			}
		});
		//Событие при успешной отправке формы
		function Submit() {
					$('.join-mail, .feedback-mail').removeClass('error');
					$('.form__submit').slideDown();
		};
	});
});


//---------------------------------------------------------------------------------------
//--------------------------------------НАСТРОЙКИ ФОРМ-----------------------------------
//---------------------------------------------------------------------------------------
// Отключение подсветки при фокусе
$(function() {
	$('.rfield').focus(function() { 
		$(this).removeAttr('style');
	});
});

//Отключение иконок при фокусе
$(function() {
	$('.join-name, .join-mail, .join-comment, .feedback-name, .feedback-mail, .feedback-comment').focus(function() { 
		$(this).siblings('label').addClass('focused');
		$(this).removeClass('error');
	});
});
$(function() {
	$('.join-name, .join-mail, .join-comment, .feedback-name, .feedback-mail, .feedback-comment').focusout(function() { 
		if ($(this).val().length === 0) {
			$(this).siblings('label').removeClass('focused');
		}
	});
});
// Поворот стрелки селекта при фокусе
$(function() {
	$('.select2-container').click(function() {
		$(this).siblings('label').toggleClass('rotate');
		console.log('nya')
	});
});