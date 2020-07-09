'use strict';

const database = [];

//получаем объекты разметки по классам
const modalAdd = document.querySelector('.modal__add'),
    addAd = document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    modalItem = document.querySelector('.modal__item'),
    catalog = document.querySelector('.catalog'),
    modalBtnWarning = document.querySelector('.modal__btn-warning');

const elementsModalSubmit =  [...modalSubmit.elements]
    .filter(elem => elem.tagName !== 'BUTTON'); //элементы формы



const closeModal = function (event) {
    //функция закрытия модального окна при клике по крестику или вне модального окна
    const target = event.target;

    if (target.classList.contains('modal__close') ||
        target === this) {
        // при нажатии на крестик или вне блока модального окна
        this.classList.add('hide'); //скрываем модальное окно
        if (this === modalAdd){
            modalSubmit.reset(); //при закрытии модального окна modalAdd очищаем форму
        }
        document.body.removeEventListener('keydown', closeModalEsc); //удаляем обработчик события нажатия на Esc
    }
}

const closeModalEsc = event => {
    //функция закрытия модальных окон по нажатию esc
    if (event.key === 'Escape') {
        //скрываем оба модальных окна
        modalItem.classList.add('hide');
        modalAdd.classList.add('hide');
        modalSubmit.reset(); //при закрытии модального окна очищаем форму
        document.body.removeEventListener('keydown', closeModalEsc); //удаляем обработчик события нажатия на Esc
    }
}



addAd.addEventListener('click', () => { //обработка нажатия на "подать объявления"
    modalAdd.classList.remove('hide'); //раскрываем модальное окно добавления объявления
    document.body.addEventListener('keydown', closeModalEsc); //при открытии добавляем обработчик события нажатия на Esc
    modalBtnSubmit.disabled = true; //блокируем кнопку "отправить"
});

catalog.addEventListener('click', event => { //обработка нажатия внутри католога
    const target = event.target;

    if (target.closest('.card')) { //если кликнули внутри карточки (один из родителей target является card)
        modalItem.classList.remove('hide'); //раскрываем модальное окно покупки
        document.body.addEventListener('keydown', closeModalEsc); //при открытии добавляем обработчик события нажатия на Esc
    }
});

modalSubmit.addEventListener('input', () => {
    const validForm = elementsModalSubmit.every(elem => elem.value);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : '';
});

modalSubmit.addEventListener('submit', event => {
    event.preventDefault();
    const itemObj = {};
    for(const elem of elementsModalSubmit){
        itemObj[elem.name] = elem.value;
    }
    database.push(itemObj);
});

modalItem.addEventListener('click', closeModal); //обработка нажатия на modalItem
modalAdd.addEventListener('click', closeModal); //обработка нажатия на modalAdd