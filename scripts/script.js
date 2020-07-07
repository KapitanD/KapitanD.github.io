'use strict';

const modalAdd = document.querySelector('.modal__add'),
    addAd = document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    modalItem = document.querySelector('.modal__item'),
    catalog = document.querySelector('.catalog');

document.addEventListener('keydown', event => {
    if(event.key === 'Escape'){
        modalItem.classList.add('hide');
        modalAdd.classList.add('hide');
    }
});

addAd.addEventListener('click', () => {
    modalAdd.classList.remove('hide');
    modalBtnSubmit.disabled = true;
});

catalog.addEventListener('click', event => {
    const target = event.target;

    if(target.closest('.card')){
        modalItem.classList.remove('hide');
    }
});

modalItem.addEventListener('click', event => {
    const target = event.target;

    if(target.classList.contains('modal__close') ||
        target === modalItem){
        modalItem.classList.add('hide');
    }
});

modalAdd.addEventListener('click', event => {
    const target = event.target;

    if(target.classList.contains('modal__close') ||
        target === modalAdd){
        modalAdd.classList.add('hide');
        modalSubmit.reset();
    }
});

