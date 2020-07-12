'use strict';

//блок с константами
    //массив для сохранения поданых объявлений
    const dataBase = JSON.parse(localStorage.getItem('awito')) || []; 
    
    //получаем объекты разметки по классам
    const modalAdd = document.querySelector('.modal__add'),
        addAd = document.querySelector('.add__ad'),
        modalBtnSubmit = document.querySelector('.modal__btn-submit'),
        modalSubmit = document.querySelector('.modal__submit'),
        modalItem = document.querySelector('.modal__item'),
        catalog = document.querySelector('.catalog'),
        modalBtnWarning = document.querySelector('.modal__btn-warning'),
        modalFileInput = document.querySelector('.modal__file-input'),
        modalFileBtn = document.querySelector('.modal__file-btn'),
        modalImageAdd = document.querySelector('.modal__image-add'),
        modalHeaderItem = document.querySelector('.modal__header-item'),
        modalStatusItem = document.querySelector('.modal__status-item'),
        modalDescriptionItem = document.querySelector('.modal__description-item'),
        modalCostItem = document.querySelector('.modal__cost-item'),
        modalImageItem = document.querySelector('.modal__image-item')

    //элементы формы (все кроме кнопки подать объявление)
    const elementsModalSubmit = [...modalSubmit.elements]
        .filter(elem => elem.tagName !== 'BUTTON'); 

//функция сохранения массива объявлений в local storage
const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));  

//функция закрытия модального окна
const closeModal = function (event) {
    //проверяем тип события
    if (event.type === 'click') { //по клику вне модального окна или по крестику закрываем
        const target = event.target;
        //при нажатии на крестик или вне блока модального окна
        if (target.classList.contains('modal__close') ||
            target === this) {
            
            this.classList.add('hide'); //скрываем модальное окно
            if (this === modalAdd) {
                modalSubmit.reset(); //при закрытии модального окна modalAdd очищаем форму
            }
            document.body.removeEventListener('keydown', closeModal); //удаляем обработчик события нажатия на Esc
            modalFileBtnSetDefault();
        }
    }
    //по нажатию esc закрываем
    if (event.type === 'keydown') { 
        if (event.key === 'Escape') {
            //скрываем оба модальных окна
            modalItem.classList.add('hide');
            modalAdd.classList.add('hide');
            modalSubmit.reset(); //при закрытии модального окна очищаем форму
            document.body.removeEventListener('keydown', closeModal); //удаляем обработчик события нажатия на Esc
            modalFileBtnSetDefault();
        }
    }
    if (event.type === 'submit') { //при отправке формы очищаем форму и блокируем кнопку отправить 
        modalSubmit.reset(); //очищаем форму
        modalBtnSubmit.disabled = true; // блокируем кнопку
        modalBtnWarning.style.display = ''; //восстанавливаем предупреждающую надпись
        modalAdd.classList.add('hide'); //закрываем модальное окно
        modalFileBtnSetDefault();
    }
}

//блок с модальным окном добавления объявления
    const infoPhoto = {}; //объект для хранения информации о фото

    //обрабатываем событие смены фотографии при подаче объявления
    modalFileInput.addEventListener('change', event => {
        const target = event.target;

        const reader = new FileReader(); //создаем объект FileReader

        const file = target.files[0]; //получаем первый элемент - файл с фотографией

        infoPhoto.filename = file.name; //имя файла
        infoPhoto.size = file.size; //размер в байтах
        
        reader.readAsBinaryString(file); //прочитать как бинарный файл

        reader.addEventListener('load', event =>{ //когда файл загрузится
            if(infoPhoto.size < 200000){ //фото не более 200Кб
                modalFileBtn.textContent = infoPhoto.filename; //меняем строку на кнопке
                infoPhoto.base64 = btoa(event.target.result); //переводим из бинарного формата в строку
                modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`; //меняем фото в объявлении
            } else {
                modalFileBtn.textContent = 'Файл не должен превышать 200кб'; //меняем строку на кнопке
            }
        });
    });

    //устанавливаем стандартное состояние кнопки добавить фото
    const modalFileBtnSetDefault = () => {
        modalFileBtn.textContent = 'Добавить фото';
        modalImageAdd.src = 'img/temp.jpg';
    }

    //обработка нажатия на "подать объявление"
    addAd.addEventListener('click', () => { 
        modalAdd.classList.remove('hide'); //раскрываем модальное окно добавления объявления
        document.body.addEventListener('keydown', closeModal); //при открытии добавляем обработчик события нажатия на Esc
        modalBtnSubmit.disabled = true; //блокируем кнопку "отправить"
    });

    //обработка события изменения формы
    modalSubmit.addEventListener('input', () => { 
        const validForm = elementsModalSubmit.every(elem => elem.value); //проверка всех елементов формы на заполненность
        modalBtnSubmit.disabled = !validForm; //разблокируем кнопку, если все заполненно
        modalBtnWarning.style.display = validForm ? 'none' : ''; //скрываем предупредительную надпись если все заполненно
    });

    //обработка события отправки формы
    modalSubmit.addEventListener('submit', event => { 
        event.preventDefault(); //отключаем стандартное поведение
        const itemObj = {}; //временный объект для значений элементов формы
        for (const elem of elementsModalSubmit) { //пробегаем по всем элементам формы
            itemObj[elem.name] = elem.value; //складываем во временный объект название элемента формы и его значение
        }
        itemObj.image = infoPhoto.base64;
        dataBase.push(itemObj); //добавляем полученный объект в массив
        saveDB();
        closeModal(event); //используем для восстановления формы в исходное состояние
        renderCard();
    });

    //обработка нажатия на modalAdd
    modalAdd.addEventListener('click', closeModal); 

//блок с модальным окном отображения объявления
    //функция подготовки модального окна с объявлением для конкретной карточки
    const prepareModalItem = (_i, db = dataBase) => {
        modalHeaderItem.textContent = db[_i].nameItem;
        modalStatusItem.textContent = db[_i].status === 'old' ? 'Б/У' : 'Отличное';
        modalDescriptionItem.textContent = db[_i].descriptionItem;
        modalCostItem.textContent = db[_i].costItem;
        modalImageItem.src = `data:image/jpeg;base64,${db[_i].image}`;
    }

    //обработка нажатия внутри католога (на карточку)
    catalog.addEventListener('click', event => { 
        const target = event.target;

        if (target.closest('.card')) { //если кликнули внутри карточки (один из родителей target является card)
            const tempId = Number(target.closest('.card').getAttribute('data-id'));
            prepareModalItem(tempId);
            modalItem.classList.remove('hide'); //раскрываем модальное окно покупки
            document.body.addEventListener('keydown', closeModal); //при открытии добавляем обработчик события нажатия на Esc
        }
    });

    //обработка нажатия на modalItem
    modalItem.addEventListener('click', closeModal); 

//блок отображения каталога товаров
    //функция отображения каталога
    const renderCard = (db = dataBase) => {
        catalog.textContent = '';   //очищаем каталог
        db.forEach((item, i) => { //для каждого элемента бд
            //добавляем в верстку карточку с информацией
            catalog.insertAdjacentHTML('beforeend',
            `
            <li class="card" data-id="${i}">
                <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
                <div class="card__description">
                    <h3 class="card__header">${item.nameItem}</h3>
                    <div class="card__price">${item.costItem} ₽</div>
                </div>
            </li>
            `
            );
        });
    }

    //после загрузки страницы отображаем каталог
    renderCard();