'use strict';

const database = []; //массив для сохранения поданых объявлений

//получаем объекты разметки по классам
const modalAdd = document.querySelector('.modal__add'),
    addAd = document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    modalItem = document.querySelector('.modal__item'),
    catalog = document.querySelector('.catalog'),
    modalBtnWarning = document.querySelector('.modal__btn-warning');

const elementsModalSubmit = [...modalSubmit.elements]
    .filter(elem => elem.tagName !== 'BUTTON'); //элементы формы


//функция закрытия модального окна
const closeModal = function (event) {
    //проверяем тип события
    if (event.type === 'click') { //по клику вне модального окна или по крестику закрываем
        const target = event.target;

        if (target.classList.contains('modal__close') ||
            target === this) {
            // при нажатии на крестик или вне блока модального окна
            this.classList.add('hide'); //скрываем модальное окно
            if (this === modalAdd) {
                modalSubmit.reset(); //при закрытии модального окна modalAdd очищаем форму
            }
            document.body.removeEventListener('keydown', closeModal); //удаляем обработчик события нажатия на Esc
        }
    }
    if (event.type === 'keydown') { //по нажатию esc закрываем
        if (event.key === 'Escape') {
            //скрываем оба модальных окна
            modalItem.classList.add('hide');
            modalAdd.classList.add('hide');
            modalSubmit.reset(); //при закрытии модального окна очищаем форму
            document.body.removeEventListener('keydown', closeModal); //удаляем обработчик события нажатия на Esc
        }
    }
    if (event.type === 'submit') { //при отправке формы очищаем форму и блокируем кнопку отправить 
        modalSubmit.reset(); //очищаем форму
        modalBtnSubmit.disabled = true; // блокируем кнопку
        modalBtnWarning.style.display = ''; //восстанавливаем предупреждающую надпись
        modalAdd.classList.add('hide'); //закрываем модальное окно
    }
}

addAd.addEventListener('click', () => { //обработка нажатия на "подать объявления"
    modalAdd.classList.remove('hide'); //раскрываем модальное окно добавления объявления
    document.body.addEventListener('keydown', closeModal); //при открытии добавляем обработчик события нажатия на Esc
    modalBtnSubmit.disabled = true; //блокируем кнопку "отправить"
});

catalog.addEventListener('click', event => { //обработка нажатия внутри католога
    const target = event.target;

    if (target.closest('.card')) { //если кликнули внутри карточки (один из родителей target является card)
        modalItem.classList.remove('hide'); //раскрываем модальное окно покупки
        document.body.addEventListener('keydown', closeModal); //при открытии добавляем обработчик события нажатия на Esc
    }
});

modalSubmit.addEventListener('input', () => { //обработка события изменения формы
    const validForm = elementsModalSubmit.every(elem => elem.value); //проверка всех елементов формы на заполненность
    modalBtnSubmit.disabled = !validForm; //разблокируем кнопку, если все заполненно
    modalBtnWarning.style.display = validForm ? 'none' : ''; //скрываем предупредительную надпись если все заполненно
});

modalSubmit.addEventListener('submit', event => { //обработка события отправки формы
    event.preventDefault(); //отключаем стандартное поведение
    const itemObj = {}; //временный объект для значений элементов формы
    for (const elem of elementsModalSubmit) { //пробегаем по всем элементам формы
        itemObj[elem.name] = elem.value; //складываем во временный объект название элемента формы и его значение
    }
    database.push(itemObj); //добавляем полученный объект в массив
    closeModal(event); //используем для восстановления формы в исходное состояние
    console.log(database); //проверяем, попал ли item в database
});

modalItem.addEventListener('click', closeModal); //обработка нажатия на modalItem
modalAdd.addEventListener('click', closeModal); //обработка нажатия на modalAdd