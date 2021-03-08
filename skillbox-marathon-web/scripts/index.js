let header = document.querySelector(".header"),
    burgerIcon = document.querySelector(".navbar-toggler-icon"),
    logoDark = document.querySelector(".header__logo-dark"),
    logoLight = document.querySelector(".header__logo-white"),
    navBarCollapse = document.querySelector(".navbar-collapse"),
    navLinks = document.querySelectorAll(".nav-link");

console.log(navLinks);

const waitCollapsing = () => {
    while (!navBarCollapse.classList.contains('collapsing')) {
        continue;
    }
    while (navBarCollapse.classList.contains('collapsing')) {
        continue;
    }
}

const toggleOpened = (target) => {
    if (target.classList.contains('opened')) {
        target.classList.remove('opened');
    } else {
        target.classList.add('opened');
    }
}

const resetIcon = () => {
    if (logoDark.classList.contains('dn')) {
        logoDark.classList.remove('dn');
        logoLight.classList.add('dn');
    } else {
        logoLight.classList.remove('dn');
        logoDark.classList.add('dn')
    }
}

navBarCollapse.addEventListener('show.bs.collapse', () => {
    toggleOpened(header);
    toggleOpened(burgerIcon);
    resetIcon();
});

navBarCollapse.addEventListener('hidden.bs.collapse', () => {
    toggleOpened(header);
    toggleOpened(burgerIcon);
    resetIcon();
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navBarCollapse.classList.remove('show');
        toggleOpened(header);
        toggleOpened(burgerIcon);
        resetIcon();
    });
});