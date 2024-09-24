// Знаходимо елементи за різними методами
const button = document.getElementById('show-promo');
const promoText = document.querySelector('#promo');
const welcomeMsg = document.getElementById('welcome-msg');
const movieItems = document.getElementsByClassName('movie-item');
const allParagraphs = document.getElementsByTagName('p');

// Додаємо обробник для зміни кольору всіх абзаців
for (let i = 0; i < allParagraphs.length; i++) {
    allParagraphs[i].addEventListener('click', function() {
        allParagraphs[i].style.color = 'purple';
    });
}

// Обробник події кліку на кнопку
button.onclick = function() {
    if (promoText.classList.contains('hidden')) {
        promoText.classList.remove('hidden');
        button.textContent = "Приховати спецпропозицію";
    } else {
        promoText.classList.add('hidden');
        button.textContent = "Показати спецпропозицію";
    }
};

// Подія наведеного курсора на пункт розкладу
for (let i = 0; i < movieItems.length; i++) {
    movieItems[i].addEventListener('mouseover', function() {
        movieItems[i].classList.add('highlight');
    });
    movieItems[i].addEventListener('mouseout', function() {
        movieItems[i].classList.remove('highlight');
    });
}

// Відслідковуємо натискання клавіші та змінюємо текст привітання
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        welcomeMsg.textContent = "Чекаємо на вас у кінотеатрі!";
        welcomeMsg.style.color = 'green';
    }
});
