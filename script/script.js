import playList from './playList.js';
console.log(playList);


document.addEventListener('DOMContentLoaded', function () {

    const weatherIcon = document.querySelector('.weather-icon'),
        temperature = document.querySelector('.temperature'),
        weatherDescription = document.querySelector('.weather-description'),
        prev = document.querySelector('.slide-prev'),
        next = document.querySelector('.slide-next'),
        city = document.querySelector('.city'),
        windy = document.querySelector('.windy'),
        buttonChangeQuote = document.querySelector('.change-quote'),
        quote = document.querySelector('.quote'),
        quoteAuthor = document.querySelector('.author');

    //время и дата
    function showTime() {
        const time = document.querySelector('.time');
        const date = new Date();
        time.textContent = date.toLocaleTimeString();
        showDate();
        showGreeting();
        setTimeout(showTime, 1000);
    }

    showTime();

    function showDate() {
        const dateSelect = document.querySelector('.date');
        const date = new Date();
        const options = {weekday: "long", month: 'long', day: 'numeric', timeZone: 'UTC'};
        dateSelect.textContent = date.toLocaleDateString('en-US', options);
    }

//приветствие
    function showGreeting() {
        const greeting = document.querySelector('.greeting');
        const date = new Date();
        const hours = date.getHours();
        const timeOfDay = getTimeOfDay(hours);
        greeting.textContent = `Good ${timeOfDay}`;
    }

    function setLocalStorage() {
        const nameInput = document.querySelector('.name');
        localStorage.setItem('name', nameInput.value);
    }

    window.addEventListener('beforeunload', setLocalStorage);

    function getLocalStorage() {
        const nameInput = document.querySelector('.name');
        const nameFromLS = localStorage.getItem('name');

        if (nameFromLS !== null) {
            nameInput.value = nameFromLS;
        }
    }

    window.addEventListener('load', getLocalStorage);

    function getTimeOfDay(time) {
        if (time > 4 && time < 12) {
            return 'morning';
        }
        if (time > 11 && time < 17) {
            return 'afternoon';
        }
        if (time > 16 && time < 23) {
            return 'evening';
        }
        if (time > 0 && time < 4) {
            return 'night';
        }
    }

//слайдер
    function getRandomNum() {
        return Math.ceil(Math.random() * (20 - 1) + 1);
    }

    let bgNum = getRandomNum();
    let randomNum = bgNum.toString().padStart(2, '0');

    function setBg() {
        const img = new Image();
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const timeOfDay = getTimeOfDay(currentHour);
        const imageUrl = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${randomNum}.jpg`;

        img.onload = () => {
            document.body.style.backgroundImage = `url('${imageUrl}')`;
        };

        img.src = imageUrl;
    }

    function getSlideNext() {
        if (randomNum < 20) {
            randomNum++;
        } else {
            randomNum = 1;
        }
        setBg();
    }

    function getSlidePrev() {
        if (randomNum > 1) {
            randomNum--;
        } else {
            randomNum = 20;
        }
        setBg();
    }

    next.addEventListener('click', getSlideNext);
    prev.addEventListener('click', getSlidePrev);

//погода
    async function getWeather() {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=ru&appid=5dd9e15941a12bab29090d8f27499e34&units=metric`;
        const res = await fetch(url);
        const data = await res.json();

        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
        weatherDescription.textContent = data.weather[0].main;
        windy.textContent = data.wind.speed;
    }

    function setCity(event) {
        if (event.code === 'Enter') {
            getWeather();
            city.blur();
        }
    }

    document.addEventListener('DOMContentLoaded', getWeather);
    city.addEventListener('keypress', setCity);

//цитаты
    let index = 0;

    async function getQuotes() {
        const quotes = 'data.json';
        const res = await fetch(quotes);
        const data = await res.json();
        quote.textContent = data[index].text;
        quoteAuthor.textContent = data[index].author;
    }

    getQuotes()

    buttonChangeQuote.addEventListener('click', () => {
        index++
        getQuotes()
    });


// плеер
    const audio = new Audio();
    const prevAudio = document.querySelector('.play-prev');
    const nextAudio = document.querySelector('.play-next');
    const buttonPlayOrStopAudio = document.querySelector('.play');
    const playListContainer = document.querySelector('.play-list');

    let isPlay = false;
    let currentTrackIndex = 0;

    function playAudio() {
        if (playList[currentTrackIndex]) {
            audio.src = playList[currentTrackIndex].src;
            audio.currentTime = 0;
            audio.play();
        }
    }

    function pauseAudio() {
        audio.pause();
    }

    function playNext() {
        if (currentTrackIndex < playList.length - 1) {
            currentTrackIndex++;
            playAudio();
        }
    }

    function playPrev() {
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
            playAudio();
        }
    }

    buttonPlayOrStopAudio.addEventListener('click', () => {
        if (!isPlay) {
            playAudio();
            isPlay = true;
            buttonPlayOrStopAudio.classList.toggle('pause');
        } else {
            pauseAudio();
            isPlay = false;
            buttonPlayOrStopAudio.classList.toggle('pause');
        }
    });

    nextAudio.addEventListener('click', playNext);
    prevAudio.addEventListener('click', playPrev);



    function createListSong() {
        for(let i = 0; i < playList.length; i++) {
            const li = document.createElement('li')
            li.classList.add('play-item');
            li.textContent = playList[i].title;
            playListContainer.append(li)
        }
    }
    createListSong()




});
















