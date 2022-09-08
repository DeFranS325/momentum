let IMG_COUNT = 20;
const slide_next = document.querySelector('.slide-next');
const slide_prev = document.querySelector('.slide-prev');
let translateData;
const dataLang = {
    "ru": {
        "windTitle": "Ветер",
        "humidityTitle": "Влажность",
        "defaultCity": "Минск",
        "weatherError": `Ошибка ввода!!!\n&\nГород будет изменен на Минск`,
        "dateLang": "ru-RU",
        "morning": "Доброе утро",
        "afternoon": "Добрый день",
        "evening": "Добрый вечер",
        "night": "Доброй / Спокойной ночи",
        "placeholder": "Введите имя",
        "settingsTitle": "Настройки",
        "timeTitle": "Время",
        "dateTitle": "Дата",
        "greetingTitle": "Приветствие",
        "quotesTitle": "Цитата дня",
        "weatherTitle": "Прогноз погоды",
        "audioTitle": "Аудиоплеер",
        "todoClearList": "Добавьте новую задачу",
        "todoTitle": "Список дел",
        "todoButton": "Список дел",
        "todoToday": "Текущие",
        "todoDone": "Выполненные",
        "newTodo": "Новая задача",
        "todoEdit": "Изменить",
        "todoDelete": "Удалить",
        "bgTitle": "Фон",
        "tagAPITitle": "Тег/теги",
        "languageTitle": "Язык"
    },
    "en": {
        "windTitle": "Wind",
        "humidityTitle": "Humidity",
        "defaultCity": "Minsk",
        "weatherError": `Input Error!!!\n&\nThe city will be changed to Minsk`,
        "dateLang": "en-En",
        "morning": "Good morning",
        "afternoon": "Good afternoon",
        "evening": "Good evening",
        "night": "Good night",
        "placeholder": "Enter name",
        "settingsTitle": "Settings",
        "timeTitle": "Time",
        "dateTitle": "Date",
        "greetingTitle": "Greeting",
        "quotesTitle": "Quotes",
        "weatherTitle": "Weather",
        "audioTitle": "Audioplayer",
        "todoClearList": "Add a new task",
        "todoTitle": "To-do list",
        "todoButton": "Todo",
        "todoToday": "Today",
        "todoDone": "Done",
        "newTodo": "New Todo",
        "todoEdit": "Edit",
        "todoDelete": "Delete",
        "bgTitle": "Background",
        "tagAPITitle": "Tag/tags",
        "languageTitle": "Language"
    }
};
let TOD = '';  //time of day
let t = '';  //time of day for updateTextContent()
let randomNum;
//translation variables
let dateLang = 'ru-RU';
let greetingTextContent = '';
let placeholder = 'Введите имя';
let titleTrack = 'Название песни';
//---------------------
const menuButton = document.querySelector('.icono-sliders');
const menu = document.querySelector('.menu-container');
const closeMenu = document.querySelector('.close-menu');
const selLang = document.querySelector('.language');
const selAPI = document.querySelector('.bg');

let lang;
let timeHide,
    dateHide,
    greetingHide,
    quoteHide,
    weatherHide,
    audioHide,
    bgAPI,
    unsplashTags = '',
    flickrTags = '',
    todoHide;
let todoList = new Array();
let sizeTodoList = 0;

let todayCount = 0, doneCount = 0;

const bodyBefore = document.body;

//#region WEATHER

const city = document.querySelector('.city');
const name = document.querySelector('.name');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
let windTitle = 'Ветер';
let humidityTitle = 'Влажность';
let weatherError = '';

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=36b993830043da93e7df44ef3b1216f4&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    const cod = data.cod;
    try {
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.floor(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `${windTitle}: ${Math.floor(data.wind.speed)}м/с`;
        humidity.textContent = `${humidityTitle}: ${Math.floor(data.main.humidity)}%`;
    }
    catch {
        let errorMessage = translateData["weatherError"].replace("&", data.message);
        alert(errorMessage);
        city.value = translateData["defaultCity"];
        getWeather();
    }
}

city.addEventListener('change', getWeather);
//#endregion

//#region ToDo

const todoButton = document.querySelector('.todo-button');

function todoMenuShow() {
    const todoMenu = document.querySelector('.todo-menu');
    todoMenu.addEventListener('click', () => {
        if (event.target.classList.contains('todo-menu-before-active')) {
            const allSubMenu = document.querySelectorAll('.submenu');
            allSubMenu.forEach(el => {
                el.classList = 'submenu submenu-hide';
            });
            todoMenu.classList.remove('todo-menu-before-active');
        }
    });
    todoMenu.classList.add('todo-menu-show');
    todoMenu.addEventListener('animationend', (animationEvent) => {
        if (animationEvent.animationName === 'show-menu') {
            todoMenu.classList.remove('todo-menu-show');
            todoMenu.classList.add('todo-menu-active');
        }
    });
    bodyBefore.classList.add('body-before-active');
}
todoButton.addEventListener('click', todoMenuShow);

function recalculationTodoCount() {
    todayCount = 0;
    doneCount = 0;
    todoList.forEach(el => {
        for (let key in el) {
            if (el[key] == 0)
                todayCount++;
            else
                doneCount++;
        }
    });
}

const newTodo = document.querySelector('.new-todo');
newTodo.addEventListener('keypress', (event) => {
    if (event.key == 'Enter') {
        const textTodo = newTodo.value;
        if (sizeTodoList == 0)
            delNoTodo();
        createTodoItem(textTodo, todoMenuCombobox.selectedIndex, sizeTodoList);

        let newObj = new Object();
        newObj[textTodo] = todoMenuCombobox.selectedIndex;
        console.log(newObj);
        todoList.push(newObj);
        console.log(todoList);
        sizeTodoList++;
        newTodo.value = '';
        recalculationTodoCount();
        addTitleForTodoCombobox();
    }
});

//add text "Add a todo to get started"
function addNoTodo() {
    const spanNoTodo = document.querySelector('.span-no-todo');
    spanNoTodo.textContent = translateData['todoClearList'];
}

function delNoTodo() {
    const spanNoTodo = document.querySelector('.span-no-todo');
    spanNoTodo.textContent = '';
}

function createTodoItem(text, done, index) {
    let divTodoList = document.querySelector('.todo-list');
    let todoItem = document.createElement('div');
    let todoItemCheckBox = document.createElement('input');
    let todoItemTitle = document.createElement('input');
    let todoSubMenuIcon = document.createElement('div');
    let todoSubMenu = document.createElement('div');
    let todoSubMenuEdit = document.createElement('div');
    let todoSubMenuLine = document.createElement('div');
    let todoSubMenuDelete = document.createElement('div');

    todoItemCheckBox.type = 'checkbox';
    todoItemCheckBox.classList.add('todo-item-checkbox');
    todoItemCheckBox.checked = done;
    /*todoItemCheckBox.addEventListener('change', function () {
        if (this.checked)
            todoList[text] = 1;
        else
            todoList[text] = 0;
    });*/
    todoItemCheckBox.addEventListener('change', function () {
        if (this.checked)
            todoList[index][text] = 1;
        else
            todoList[index][text] = 0;
        recalculationTodoCount();
        addTitleForTodoCombobox();
    });

    todoItemTitle.type = 'text';
    todoItemTitle.classList.add('todo-item-title');
    todoItemTitle.id = `todo-item-${index + 1}`;
    todoItemTitle.value = text;
    todoItemTitle.setAttribute('readonly', true);
    if (done == 1)
        todoItemTitle.classList.add('done');
    todoItemTitle.addEventListener('dblclick', doubleClick);
    todoItemTitle.addEventListener('mouseout', function () {
        if (this.readOnly)
            this.blur();
    });
    todoItemTitle.addEventListener('change', function () {
        this.blur();
    });
    todoItemTitle.addEventListener('blur', function () {
        endEditing(this.value);
        this.setAttribute('readonly', true);
    });
    todoItemTitle.addEventListener('mousedown', function (event) {
        if (event.detail > 1) {
            event.preventDefault();
        }
    }, false);

    todoSubMenuIcon.classList = 'submenu-icon';
    todoSubMenuIcon.innerHTML = '<div class="icono-hamburger"></div>';

    todoSubMenu.classList = 'submenu submenu-hide';

    todoSubMenuEdit.classList = 'edit';
    todoSubMenuEdit.textContent = translateData["todoEdit"];
    todoSubMenuLine.classList = 'submenu-item-line';
    todoSubMenuDelete.classList = 'delete';
    todoSubMenuDelete.textContent = translateData["todoDelete"];

    todoSubMenu.append(todoSubMenuEdit);
    todoSubMenu.append(todoSubMenuLine);
    todoSubMenu.append(todoSubMenuDelete);

    const todoMenu = document.querySelector('.todo-menu');

    todoSubMenuIcon.addEventListener('click', function () {
        if (todoSubMenu.classList.contains('submenu-hide')) {
            const allSubMenu = document.querySelectorAll('.submenu');
            allSubMenu.forEach(el => {
                el.classList = 'submenu submenu-hide';
            });
            todoSubMenu.classList.toggle('submenu-hide');
            todoMenu.classList.add('todo-menu-before-active');
        }
        else {
            todoSubMenu.classList.toggle('submenu-hide');
            todoMenu.classList.add('todo-menu-before-active');
        }
    });
   
    todoSubMenuEdit.addEventListener('click', function () { //edit item
        todoSubMenu.classList = 'submenu submenu-hide';
        let event_dblclick = new Event('dblclick', doubleClick);
        todoItemTitle.dispatchEvent(event_dblclick);
        todoItemTitle.focus();
    });

    todoSubMenuDelete.addEventListener('click', function () {  //delete item
        todoList.splice(index, 1);
        clearTodoList();
        createTodoList();
        recalculationTodoCount();
        addTitleForTodoCombobox();
        const menuItems = document.querySelectorAll('.todo-item');
        if (todoMenuCombobox.selectedIndex == 1)
            menuItems.forEach(el => {
                if (!el.querySelector('.todo-item-checkbox').checked)
                    el.classList.add('item-hide');
            });
        else
            menuItems.forEach(el => {
                el.classList.remove('item-hide');
            });
    });

    todoItem.classList.add('todo-item');
    todoItem.append(todoItemCheckBox);
    todoItem.append(todoItemTitle);
    todoItem.append(todoSubMenuIcon);
    todoItem.append(todoSubMenu);

    divTodoList.appendChild(todoItem);
}

function editTodoItemTitle() { //edit item
    todoSubMenu.classList = 'submenu submenu-hide';
    let event_dblclick = new Event('dblclick', doubleClick);
    todoItemTitle.dispatchEvent(event_dblclick);
    todoItemTitle.focus();
}

function deleteTodoItemTitle(index) {  //delete item
    console.log('Удаляем один элемент массива');
    todoList.splice(index, 1);
    createTodoList();
}

function addTitleForTodoCombobox() {
    let s;
    s = translateData["todoToday"] + ` (${todayCount.toString()})`;
    todoMenuCombobox.options[0].textContent = s;
    s = translateData["todoDone"] + ` (${doneCount.toString()})`;
    todoMenuCombobox.options[1].textContent = s;
}

function clearTodoList() {
    const divTodoList = document.querySelector('.todo-list');
    divTodoList.innerHTML = '<span class="span-no-todo"></span>';
}

function createTodoList() {
    //let i = 0;
    /*for (let key in todoList) {
        if (todoList[key] == 0)
            todayCount++;
        else
            doneCount++;
        createTodoItem(key, todoList[key], i);
        i++;
    }*/
    for (let i = 0; i < todoList.length; i++) {
        for (let key in todoList[i]) {
            if (todoList[i][key] == 0)
                todayCount++;
            else
                doneCount++;
            createTodoItem(key, todoList[i][key], i);
            //i++;
        }
    }
    addTitleForTodoCombobox();
}

let oldKey;
function doubleClick() {
    oldKey = this.value;
    this.removeAttribute('readonly');
}

function endEditing(text) {
    let newKey = text;
    if ((oldKey != undefined) && (newKey != oldKey)) {
        todoList.forEach(el => {
            for (let key in el)
                if (key == oldKey) {
                    el[newKey] = el[key];
                    delete el[key];
                }
        });
        oldKey = '';
    }
}

function selectTypeTodo() { //Today or Done
    const menuItems = document.querySelectorAll('.todo-item');
    if (this.selectedIndex == 1)
        menuItems.forEach(el => {
            if (!el.querySelector('.todo-item-checkbox').checked)
                el.classList.add('item-hide');
        });
    else
        menuItems.forEach(el => {
            el.classList.remove('item-hide');
        });
}

const todoMenuCombobox = document.querySelector('.todo-menu-combobox');
todoMenuCombobox.addEventListener('change', selectTypeTodo);

//#endregion

//#region  QUOTES 

const quotes = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');

async function getQuotes() {
    const file = 'https://rolling-scopes-school.github.io/defrans325-JSFEPRESCHOOL2022Q2/momentum/json/quotes.json';
    const res = await fetch(file);
    const data = await res.json();
    let i;
    if (lang == 'ru')
        i = Math.floor(Math.random() * 50 + 1);
    else
        i = Math.floor(Math.random() * 50 + 51);
    quotes.textContent = `"${data[i].text}"`;
    author.textContent = `${data[i].author}`;
}

changeQuote.addEventListener('click', getQuotes);
//#endregion

//writing language to memory
function setLocalStorage() {
    localStorage.setItem('name', name.value);
    localStorage.setItem('city', city.value);
    localStorage.setItem('lang', lang);
    localStorage.setItem('timeHide', timeHide);
    localStorage.setItem('dateHide', dateHide);
    localStorage.setItem('greetingHide', greetingHide);
    localStorage.setItem('quoteHide', quoteHide);
    localStorage.setItem('weatherHide', weatherHide);
    localStorage.setItem('audioHide', audioHide);
    localStorage.setItem('bgAPI', bgAPI);
    localStorage.setItem('unsplashTags', unsplashTags);
    localStorage.setItem('flickrTags', flickrTags);
    localStorage.setItem('todoHide', todoHide);
    localStorage.setItem('todoList', JSON.stringify(todoList));
}
window.addEventListener('beforeunload', setLocalStorage);

//loading language from memory
function getLocalStorage() {
    if (localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
    }
    if (localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    }
    timeHide = (localStorage.getItem('timeHide') != null) ? parseInt(localStorage.getItem('timeHide')) : 1;
    dateHide = (localStorage.getItem('dateHide') != null) ? parseInt(localStorage.getItem('dateHide')) : 1;
    greetingHide = (localStorage.getItem('greetingHide') != null) ? parseInt(localStorage.getItem('greetingHide')) : 1;
    quoteHide = (localStorage.getItem('quoteHide') != null) ? parseInt(localStorage.getItem('quoteHide')) : 1;
    weatherHide = (localStorage.getItem('weatherHide') != null) ? parseInt(localStorage.getItem('weatherHide')) : 1;
    audioHide = (localStorage.getItem('audioHide') != null) ? parseInt(localStorage.getItem('audioHide')) : 1;
    unsplashTags = (localStorage.getItem('unsplashTags') != null) ? localStorage.getItem('unsplashTags') : '';
    flickrTags = (localStorage.getItem('flickrTags') != null) ? localStorage.getItem('flickrTags') : '';
    todoHide = (localStorage.getItem('todoHide') != null) ? localStorage.getItem('todoHide') : 1;
    if (localStorage.getItem('todoList'))
        todoList = JSON.parse(localStorage.getItem('todoList'));
        
    if (localStorage.getItem('bgAPI')) {
        bgAPI = localStorage.getItem('bgAPI');
        selAPI.selectedIndex = parseInt(bgAPI);
    }
    else {
        bgAPI = '0';
        selAPI.selectedIndex = 0;
    }
    if (localStorage.getItem('lang')) {
        let l = localStorage.getItem('lang');
        switch (l) {
            case 'ru': selLang.selectedIndex = 0; break;
            case 'en': selLang.selectedIndex = 1; break;
        }
    }
    else {
        selLang.selectedIndex = 0; //default - russian language
    }
    applySettings();
    
    lang = selLang.options[selLang.selectedIndex].value;
    showTime();
    sizeTodoList = todoList.length;

    if (sizeTodoList == 0) {
        addNoTodo();
    }
    else {
        delNoTodo();
        createTodoList();
    }
    loadTranslateData(lang);
}
window.addEventListener('load', getLocalStorage);

//loading language textContent from json
function loadTranslateData(lang) {
    translateData = dataLang[lang];
    getQuotes();
    windTitle = translateData["windTitle"];
    humidityTitle = translateData["humidityTitle"];
    weatherError = translateData["weatherError"];
    if ((city.value == 'Минск') || (city.value == 'Minsk'))
        city.value = translateData["defaultCity"];
    getWeather();
    dateLang = translateData["dateLang"];
    greetingTextContent = translateData[TOD];
    placeholder = translateData["placeholder"];
    name.placeholder = `[ ${placeholder} ]`;
    titleTrack = translateData["titleTrack"];

    //menu
    const settingsTitle = document.querySelector('.settings-title');
    settingsTitle.textContent = translateData["settingsTitle"];
    const timeTitle = document.querySelector('.time-title');
    timeTitle.textContent = translateData["timeTitle"];
    const dateTitle = document.querySelector('.date-title');
    dateTitle.textContent = translateData["dateTitle"];
    const greetingTitle = document.querySelector('.greeting-title');
    greetingTitle.textContent = translateData["greetingTitle"];
    const quotesTitle = document.querySelector('.quotes-title');
    quotesTitle.textContent = translateData["quotesTitle"];
    const weatherTitle = document.querySelector('.weather-title');
    weatherTitle.textContent = translateData["weatherTitle"];
    const audioTitle = document.querySelector('.audio-title');
    audioTitle.textContent = translateData["audioTitle"];

    if (sizeTodoList == 0) {
        addNoTodo();
    }
    else {
        delNoTodo();
        const itemSubMenuEdit = document.querySelectorAll('.edit');
        itemSubMenuEdit.forEach(el => {
            el.textContent = translateData["todoEdit"];
        });
        const itemSubMenuDelete = document.querySelectorAll('.delete');
        itemSubMenuDelete.forEach(el => {
            el.textContent = translateData["todoDelete"];
        });
    }

    const todoTitle = document.querySelector('.todo-title');
    todoTitle.textContent = translateData["todoTitle"];
    const todoButton = document.querySelector('.todo-button');
    todoButton.textContent = translateData["todoButton"];
    const todoMenuComboBox = document.querySelector('.todo-menu-combobox');
    todoMenuComboBox.options[0].textContent = translateData["todoToday"];
    todoMenuComboBox.options[1].textContent = translateData["todoDone"];
    const newTodo = document.querySelector('.new-todo');
    newTodo.placeholder = translateData["newTodo"];
    const bgTitle = document.querySelector('.bg-title');
    bgTitle.textContent = translateData["bgTitle"];
    const tagAPITitle = document.querySelector('.tagAPI-title');
    tagAPITitle.textContent = translateData["tagAPITitle"];
    const languageTitle = document.querySelector('.language-title');
    languageTitle.textContent = translateData["languageTitle"];
    addTitleForTodoCombobox();
}

function applySettings() {
    timeSwitch.checked = timeHide;
    if (!timeHide) {
        const time = document.querySelector('.time');
        hideElement(time);
    }
    dateSwitch.checked = dateHide;
    if (!dateHide) {
        const date = document.querySelector('.date');
        hideElement(date);
    }
    greetingSwitch.checked = greetingHide;
    if (!greetingHide) {
        const greeting = document.querySelector('.greeting-container');
        hideElement(greeting);
    }
    quoteSwitch.checked = quoteHide;
    if (!quoteHide) {
        const quote = document.querySelector('.quote-container');
        hideElement(quote);
        const changeQuote = document.querySelector('.change-quote');
        hideElement(changeQuote);
    }
    weatherSwitch.checked = weatherHide;
    if (!weatherHide) {
        const weather = document.querySelector('.weather');
        hideElement(weather);
    }
    audioSwitch.checked = audioHide;
    if (!audioHide) {
        const audio = document.querySelector('.player');
        hideElement(audio);
    }
    todoSwitch.checked = todoHide;
    if (!todoHide) {
        const todo = document.querySelector('.todo-container');
        hideElement(todo);
    }
    switch (bgAPI) {
        case '0': const tagAPI = document.querySelector('.tagAPI');
            tagAPI.classList.toggle('invisible');
            break;
        case '1': tags.value = unsplashTags; break;
        case '2': tags.value = flickrTags; break;
    }
}

function showTime() {
    const time = document.querySelector('.time');
    const my_time = new Date();
    time.textContent = my_time.toLocaleTimeString();
    getTimeOfDay();
    showGreeting();
    showDate();
    updateTextContent();
    setTimeout(showTime, 1000);
}

function showGreeting() {
    const greeting = document.querySelector('.greeting');
    greeting.textContent = todToText(TOD);
}

function todToText(str) {
    switch (str) {
        case "morning": return `${greetingTextContent}, `; break;
        case "afternoon": return `${greetingTextContent}, `; break;
        case "evening": return `${greetingTextContent}, `; break;
        case "night": return `${greetingTextContent}, `; break;
    }
}

function getTimeOfDay() {
    const date = new Date();
    const h = date.getHours();
    if ((h >= 6) && (h < 12)) return TOD = "morning";
    if ((h >= 12) && (h < 18)) return TOD = "afternoon";
    if ((h >= 18) && (h < 24)) return TOD = "evening";
    if ((h >= 0) && (h < 6)) return TOD = "night";
}

function showDate() {
    const date = document.querySelector('.date');
    const my_date = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' };
    date.textContent = my_date.toLocaleDateString(dateLang, options);
}
//showTime();

function getRandomNum(count) {
    randomNum = Math.floor(Math.random() * count) + 1;
}

function loadImgGitHub() {
    let imgURL = new Image();
    imgURL.src = `https://raw.githubusercontent.com/DeFranS325/stage1-tasks/assets/images/${t}/${randomNum.toString().padStart(2, '0')}.webp`;
    imgURL.onload = () => {
        document.body.style.backgroundImage = `url(${imgURL.src})`;
    }
}

function loadBg() {
    switch (parseInt(bgAPI)) {
        case 0: loadImgGitHub(); break;
        case 1: loadImgUnsplash(); break;
        case 2: loadImgFlickr(); break;
    }    
}

let tagsForURL;

/* Unsplash API */

let unsplashImg;
async function loadImgUnsplash() {
    if ((tagsForURL.trim() === '') || (tagsForURL === null))
        tagsForURL = t;
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${tagsForURL}&client_id=e6T1ADenQsVen4WbYQEL9a4wZ0R4W-BOCVDngKizwRs`;
    const res = await fetch(url);
    const data = await res.json();
    unsplashImg = data["urls"]["regular"];
    let imgURL = new Image();
    imgURL.src = unsplashImg;
    imgURL.onload = () => {
        document.body.style.backgroundImage = `url(${imgURL.src})`;
    }
}

/* -------------------- */

/* Flickr API */

let flickrImg;
async function loadImgFlickr() {
    if ((tagsForURL.trim() === '') || (tagsForURL === null))
        tagsForURL = t;
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=3e565579ae959ed9013b4f9ad83c9b24&tags=${tagsForURL}&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    flickrImg = data["photos"]["photo"][randomNum]["url_l"];
    let imgURL = new Image();
    imgURL.src = flickrImg;
    imgURL.onload = () => {
        document.body.style.backgroundImage = `url(${imgURL.src})`;
    }
}

/* -------------------- */

function updateTextContent() {
    if (t != TOD) {
        switch (parseInt(bgAPI)) {
            case 0: getRandomNum(IMG_COUNT); break;
            case 1: tagsForURL = unsplashTags; break;
            case 2:
                getRandomNum(IMG_COUNT);
                tagsForURL = flickrTags;
                break;
        }
        loadTranslateData(lang);
        t = TOD;
        loadBg();
    }
}

function getSlideNext() {
    randomNum++;
    if (randomNum > IMG_COUNT)
        randomNum = 1;
    loadBg();
}

function getSlidePrev() {
    randomNum--;
    if (randomNum < 1)
        randomNum = IMG_COUNT;
    loadBg();
}

slide_next.addEventListener('click', getSlideNext);
slide_prev.addEventListener('click', getSlidePrev);

/*  MENU  */

function showMenu() {
    menu.classList.toggle('show-menu');
    bodyBefore.classList.add('body-before-active');
}

menuButton.addEventListener('click', showMenu);
closeMenu.addEventListener('click', showMenu);

function hideElement(el) {
    el.classList.toggle('hide-element');
}

const timeSwitch = document.querySelector('.time-switch');
timeSwitch.addEventListener('change', function () {
    timeHide = (this.checked) ? 1 : 0;
    const time = document.querySelector('.time');
    hideElement(time);    
});

const dateSwitch = document.querySelector('.date-switch');
dateSwitch.addEventListener('change', function () {
    dateHide = (this.checked) ? 1 : 0;
    const date = document.querySelector('.date');
    hideElement(date);
});

const greetingSwitch = document.querySelector('.greeting-switch');
greetingSwitch.addEventListener('change', function () {
    greetingHide = (this.checked) ? 1 : 0;
    const greeting = document.querySelector('.greeting-container');
    hideElement(greeting);
});

const quoteSwitch = document.querySelector('.quotes-switch');
quoteSwitch.addEventListener('change', function () {
    quoteHide = (this.checked) ? 1 : 0;
    const quote = document.querySelector('.quote-container');
    hideElement(quote);
    const changeQuote = document.querySelector('.change-quote');
    hideElement(changeQuote);
});

const weatherSwitch = document.querySelector('.weather-switch');
weatherSwitch.addEventListener('change', function () {
    weatherHide = (this.checked) ? 1 : 0;
    const weather = document.querySelector('.weather');
    hideElement(weather);
});

const audioSwitch = document.querySelector('.audio-switch');
audioSwitch.addEventListener('change', function () {
    audioHide = (this.checked) ? 1 : 0;
    const audio = document.querySelector('.player');
    hideElement(audio);
});

const todoSwitch = document.querySelector('.todo-switch');
todoSwitch.addEventListener('change', function () {
    todoHide = (this.checked) ? 1 : 0;
    const todo = document.querySelector('.todo-container');
    hideElement(todo);
});

function setAPI() {
    bgAPI = selAPI.selectedIndex;
    const tagAPI = document.querySelector('.tagAPI');
    switch (bgAPI) {
        case 0: tagAPI.classList.add('invisible');
            IMG_COUNT = 20;
            getRandomNum(IMG_COUNT);
            break;
        case 1: tagAPI.classList.remove('invisible');
            tags.value = unsplashTags;
            tagsForURL = unsplashTags;
            break;
        case 2: tagAPI.classList.remove('invisible');
            tags.value = flickrTags;
            IMG_COUNT = 100;
            getRandomNum(IMG_COUNT);
            tagsForURL = flickrTags;
            break;
    }
    loadTranslateData(lang);
    t = TOD;
    loadBg();
}

selAPI.addEventListener('change', setAPI);

function setTags() {
    switch (parseInt(bgAPI)) {
        case 1: unsplashTags = this.value;
            tagsForURL = unsplashTags;
            localStorage.setItem('unsplashTags', unsplashTags);
            break;
        case 2: flickrTags = this.value;
            getRandomNum(100);
            tagsForURL = flickrTags;
            localStorage.setItem('flickrTags', flickrTags);
            break;
    }
    loadTranslateData(lang);
    t = TOD;
    loadBg();
}

const tags = document.querySelector('#tags');
tags.addEventListener('change', setTags);
tags.addEventListener('blur', setTags);

//change language value in menu
function setLang() {
    lang = selLang.options[selLang.selectedIndex].value;
    loadTranslateData(lang);
}

selLang.addEventListener('change', setLang); //change select value

function hideToDoMenu(classMenu) {
    const todoMenu = document.querySelector(classMenu);
    if (todoMenu.classList.contains("todo-menu-active")) {
        todoMenu.classList.add('todo-menu-hide');
        todoMenu.addEventListener('animationend', (animationEvent) => {
            if (animationEvent.animationName === 'hide-menu') {
                todoMenu.classList.remove('todo-menu-hide');
                todoMenu.classList.remove('todo-menu-active');
            }
        });
    }
}

bodyBefore.addEventListener('click', () => {
    if (event.target.className == 'body-before-active') {
        menu.classList.remove('show-menu');
        hideToDoMenu('.todo-menu');
        const allSubMenu = document.querySelectorAll('.submenu');
        allSubMenu.forEach(el => {
            el.classList = 'submenu submenu-hide';
        });
        const todoMenu = document.querySelector('.todo-menu');
        todoMenu.classList.remove('todo-menu-before-active');
        bodyBefore.classList.remove('body-before-active');
    }
});