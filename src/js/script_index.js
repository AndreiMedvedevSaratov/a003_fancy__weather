/* eslint-disable no-mixed-operators */
/* eslint-disable radix */

import { dayOfWeekEN, shortDayOfWeekEN, monthsEN } from './english_words.js';
import { dayOfWeekRU, shortDayOfWeekRU, monthsRU } from './russian_words.js';
import { dayOfWeekBE, shortDayOfWeekBE, monthsBE } from './belorusian_words.js';
import { weatherIcons } from './weather_icons.js';
import { YANDEX_API_KEY, IPINFO_API_KEY, UNSPLASH_API_KEY, WEATHERAPI_API_KEY } from './api_keys.js';


// ----- Constants ----- //
const SEARCH_INPUT = document.querySelector('.search__input');
const BODY = document.getElementById('BODY');
const LANGUAGE = document.getElementById('LANGUAGE');

const LATITUDE = document.getElementById('LATITUDE');
const LONGITUDE = document.getElementById('LONGITUDE');
const IMAGE_MAP = document.getElementById('MAP__MAP');
const LOCATION = document.getElementById('LOCATION');
const DATE_TIME = document.getElementById('DATE_TIME');
const TEMPERATURE_TODAY = document.getElementById('TEMPERATURE_TODAY');
const FEELS_LIKE = document.getElementById('FEELS_LIKE');
const WIND = document.getElementById('WIND');
const HUMIDITY = document.getElementById('HUMIDITY');
const CONDITION = document.getElementById('CONDITION');
const S_I_B = document.getElementById('S_I_B');
const S_I = document.getElementById('S_I');

const ICON_1 = document.getElementById('ICON_1');
const ICON_2 = document.getElementById('ICON_2');
const ICON_3 = document.getElementById('ICON_3');
const ICON_4 = document.getElementById('ICON_4');
const FORECAST_DAY_1 = document.getElementById('FORECAST_DAY_1');
const FORECAST_DAY_2 = document.getElementById('FORECAST_DAY_2');
const FORECAST_DAY_3 = document.getElementById('FORECAST_DAY_3');
const FORECAST_DAY_1_TEMP = document.getElementById('FORECAST_DAY_1_TEMP');
const FORECAST_DAY_2_TEMP = document.getElementById('FORECAST_DAY_2_TEMP');
const FORECAST_DAY_3_TEMP = document.getElementById('FORECAST_DAY_3_TEMP');

const TICKER = document.getElementById('TICKER');
const SPINNER = document.getElementById('SPINNER');
const BUTTON__FAHRENHEIT = document.getElementById('BUTTON__FAHRENHEIT');
const BUTTON__CELSIUS = document.getElementById('BUTTON__CELSIUS');

const MICROPHONE = document.getElementById('MICROPHONE');
const SPEAKER = document.getElementById('SPEAKER');

let searchCity = '';
let isCelsius = true;
const storedLanguage = '';
const nowDate = new Date();
let currentLanguage = 'EN';
let forecast3days = '';


// ----- For the timer ----- //
// eslint-disable-next-line no-unused-vars
const timer = setInterval(() => {
	const date = new Date();
	document.getElementById('TIMER').innerHTML = (`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
}, 1000);


// ----- Getting forecast by WeatherApi API ----- //
async function getWeatherForecastFor3Days(city) {
	const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_API_KEY}&q=${city}&days=3`;
	try {
		const res = await fetch(url);
		const data = await res.json();
		return data;
	} catch (e) {
		console.log(e);
		SEARCH_INPUT.value = 'WeatherAPI.com error...';
	}
}


// ----- Getting photo by Unsplash API ----- //
async function getLinkToImage(searchString) {
	const date = new Date();
	const url = `https://api.unsplash.com/photos/random?query=${searchString}+${monthsEN[date.getMonth()]}&client_id=${UNSPLASH_API_KEY}`;
	try {
		const res = await fetch(url);
		const data = await res.json();
		return data.urls.regular;
	} catch (e) {
		console.log(e);
		SEARCH_INPUT.value = 'Unsplash.com API error...';
	}
}


// ----- Getting IP info by ipinfo.io API ----- //
async function getIpInfo() {
	const url = `https://ipinfo.io/json?token=${IPINFO_API_KEY}`;
	try {
		const res = await fetch(url);
		const data = await res.json();
		return data.city;
	} catch (e) {
		console.log(e);
		SEARCH_INPUT.value = 'IpInfo.io API error...';
	}
}

async function getCityOnPageLoad() {
	try {
		const result = await getIpInfo();
		return result;
	} catch (e) {
		console.log(e);
		SEARCH_INPUT.value = 'IpInfo.io API error...';
	}
}


// ----- Getting information by Yandex API ----- //
async function getWordTranslation(word) {
	const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${YANDEX_API_KEY}&text=${word}&lang=ru-en`;
	try {
		const res = await fetch(url);
		const data = await res.json();
		return data.text[0];
	} catch (e) {
		console.log(e);
		SEARCH_INPUT.value = 'Yandex translate API error...';
	}
}

async function translate(Info) {
	try {
		const result = await getWordTranslation(Info);
		return result;
	} catch (e) {
		console.log(e);
		SEARCH_INPUT.value = 'Yandex translate API error...';
	}
}

async function getWordTranslationEnRU(word) {
	const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${YANDEX_API_KEY}&text=${word}&lang=en-ru`;
	try {
		const res = await fetch(url);
		const data = await res.json();
		return data.text[0];
	} catch (e) {
		console.log(e);
		SEARCH_INPUT.value = 'Yandex translate API error...';
	}
}

async function getWordTranslationEnBE(word) {
	const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${YANDEX_API_KEY}&text=${word}&lang=en-be`;
	try {
		const res = await fetch(url);
		const data = await res.json();
		return data.text[0];
	} catch (e) {
		console.log(e);
		SEARCH_INPUT.value = 'Yandex translate API error...';
	}
}

async function ifRussianLanguageThenTranslate(city) {
	if (/[А-я]/i.test(city)) {
		searchCity = await translate(city);
	} else searchCity = city;
	return searchCity;
}


// ----- Rendering page ----- //
async function renderingPageEN(city) {
	searchCity = await ifRussianLanguageThenTranslate(city);

	const currentForecast = await getWeatherForecastFor3Days(searchCity);

	if (currentForecast.error === undefined) {
		const backgroundImage = await getLinkToImage(searchCity);
		BODY.style.backgroundImage = `url('${backgroundImage}')`;

		S_I_B.textContent = 'SEARCH';
		S_I.placeholder = 'Search city';
		LOCATION.innerText = `${currentForecast.location.name}, ${currentForecast.location.country}`;
		DATE_TIME.innerText = `${shortDayOfWeekEN[nowDate.getDay()]} ${nowDate.getDate()} ${monthsEN[nowDate.getMonth()]}`;

		LATITUDE.innerText = `Latitude ${parseInt(currentForecast.location.lat)}°${parseInt((currentForecast.location.lat - parseInt(currentForecast.location.lat)) * 100)}'`;
		LONGITUDE.innerText = `Longitude ${parseInt(currentForecast.location.lon)}°${parseInt((currentForecast.location.lon - parseInt(currentForecast.location.lon)) * 100)}'`;
		HUMIDITY.innerText = `Humidity: ${currentForecast.current.humidity}%`;
		CONDITION.innerHTML = currentForecast.current.condition.text;

		for (let i = 0; i < weatherIcons.length; i++) {
			if (weatherIcons[i].code === String(currentForecast.current.condition.code)) {
				ICON_1.src = `./assets/weather-icons/${weatherIcons[i].day}`;
			}
			if (weatherIcons[i].code === String(currentForecast.forecast.forecastday[0].day.condition.code)) {
				ICON_2.src = `./assets/weather-icons/${weatherIcons[i].day}`;
			}
			if (weatherIcons[i].code === String(currentForecast.forecast.forecastday[1].day.condition.code)) {
				ICON_3.src = `./assets/weather-icons/${weatherIcons[i].day}`;
			}
			if (weatherIcons[i].code === String(currentForecast.forecast.forecastday[2].day.condition.code)) {
				ICON_4.src = `./assets/weather-icons/${weatherIcons[i].day}`;
			}
		}

		FORECAST_DAY_1.innerText = dayOfWeekEN[nowDate.getDay() + 1];
		FORECAST_DAY_2.innerText = dayOfWeekEN[nowDate.getDay() + 2];
		FORECAST_DAY_3.innerText = dayOfWeekEN[nowDate.getDay() + 3];

		IMAGE_MAP.innerHTML = `<iframe id="MAP" width="400" height="400"
			src="https://maps.google.com/maps?width=400&amp;height=400&amp;hl=en&amp;q=${searchCity}
			&amp;ie=UTF8&amp;z=13&amp;output=embed"
			frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>`;

		if (isCelsius) {
			TEMPERATURE_TODAY.innerText = `${Math.round(currentForecast.current.temp_c)}`;
			FEELS_LIKE.innerText = `Feels like: ${Math.round(currentForecast.current.feelslike_c)}°`;
			WIND.innerText = `Wind: ${Math.round(currentForecast.current.wind_kph * 1000 / 3600)} m/s`;
			FORECAST_DAY_1_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[0].day.avgtemp_c)}°`;
			FORECAST_DAY_2_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[1].day.avgtemp_c)}°`;
			FORECAST_DAY_3_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[2].day.avgtemp_c)}°`;
		} else {
			TEMPERATURE_TODAY.innerText = `${Math.round(currentForecast.current.temp_f)}`;
			FEELS_LIKE.innerText = `Feels like: ${Math.round(currentForecast.current.feelslike_f)}°`;
			WIND.innerText = `Wind: ${Math.round(currentForecast.current.wind_mph)} mph`;
			FORECAST_DAY_1_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[0].day.avgtemp_f)}°`;
			FORECAST_DAY_2_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[1].day.avgtemp_f)}°`;
			FORECAST_DAY_3_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[2].day.avgtemp_f)}°`;
		}

		TICKER.innerText = `TODAY: ${TEMPERATURE_TODAY.innerText}°, ${FEELS_LIKE.innerText}, ${WIND.innerText}, ${HUMIDITY.innerText}`;
		forecast3days = `${FORECAST_DAY_1.innerText + FORECAST_DAY_1_TEMP.innerText},${currentForecast.forecast.forecastday[0].day.condition.text
			},${FORECAST_DAY_2.innerText}${FORECAST_DAY_2_TEMP.innerText},${currentForecast.forecast.forecastday[1].day.condition.text
			},${FORECAST_DAY_3.innerText}${FORECAST_DAY_3_TEMP.innerText},${currentForecast.forecast.forecastday[2].day.condition.text}`;
	} else {
		console.log('City not found...');
		SEARCH_INPUT.value = 'City not found...';
	}
}

async function renderingPageRU(city) {
	searchCity = await ifRussianLanguageThenTranslate(city);

	const currentForecast = await getWeatherForecastFor3Days(searchCity);

	if (currentForecast.error === undefined) {
		const backgroundImage = await getLinkToImage(searchCity);
		BODY.style.backgroundImage = `url('${backgroundImage}')`;

		S_I_B.textContent = 'ПОИСК';
		S_I.placeholder = 'Найти город';
		LOCATION.innerText = `${await getWordTranslationEnRU(currentForecast.location.name)}, ${await getWordTranslationEnRU(currentForecast.location.country)}`;
		DATE_TIME.innerText = `${shortDayOfWeekRU[nowDate.getDay()]} ${nowDate.getDate()} ${monthsRU[nowDate.getMonth()]}`;

		LATITUDE.innerText = `Широта ${parseInt(currentForecast.location.lat)}°${parseInt((currentForecast.location.lat - parseInt(currentForecast.location.lat)) * 100)}'`;
		LONGITUDE.innerText = `Долгота ${parseInt(currentForecast.location.lon)}°${parseInt((currentForecast.location.lon - parseInt(currentForecast.location.lon)) * 100)}'`;
		HUMIDITY.innerText = `Влажность: ${currentForecast.current.humidity}%`;
		CONDITION.innerHTML = await getWordTranslationEnRU(currentForecast.current.condition.text);

		for (let i = 0; i < weatherIcons.length; i++) {
			if (weatherIcons[i].code === String(currentForecast.current.condition.code)) {
				ICON_1.src = `./assets/weather-icons/${weatherIcons[i].day}`;
			}
			if (weatherIcons[i].code === String(currentForecast.forecast.forecastday[0].day.condition.code)) {
				ICON_2.src = `./assets/weather-icons/${weatherIcons[i].day}`;
			}
			if (weatherIcons[i].code === String(currentForecast.forecast.forecastday[1].day.condition.code)) {
				ICON_3.src = `./assets/weather-icons/${weatherIcons[i].day}`;
			}
			if (weatherIcons[i].code === String(currentForecast.forecast.forecastday[2].day.condition.code)) {
				ICON_4.src = `./assets/weather-icons/${weatherIcons[i].day}`;
			}
		}

		FORECAST_DAY_1.innerText = dayOfWeekRU[nowDate.getDay() + 1];
		FORECAST_DAY_2.innerText = dayOfWeekRU[nowDate.getDay() + 2];
		FORECAST_DAY_3.innerText = dayOfWeekRU[nowDate.getDay() + 3];

		IMAGE_MAP.innerHTML = `<iframe id="MAP" width="400" height="400"
			src="https://maps.google.com/maps?width=400&amp;height=400&amp;hl=ru&amp;q=${searchCity}
			&amp;ie=UTF8&amp;z=13&amp;output=embed"
			frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>`;

		if (isCelsius) {
			TEMPERATURE_TODAY.innerText = `${Math.round(currentForecast.current.temp_c)}`;
			FEELS_LIKE.innerText = `Ощущается как: ${Math.round(currentForecast.current.feelslike_c)}°`;
			WIND.innerText = `Ветер: ${Math.round(currentForecast.current.wind_kph * 1000 / 3600)} м/c`;
			FORECAST_DAY_1_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[0].day.avgtemp_c)}°`;
			FORECAST_DAY_2_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[1].day.avgtemp_c)}°`;
			FORECAST_DAY_3_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[2].day.avgtemp_c)}°`;
		} else {
			TEMPERATURE_TODAY.innerText = `${Math.round(currentForecast.current.temp_f)}`;
			FEELS_LIKE.innerText = `Ощущается как: ${Math.round(currentForecast.current.feelslike_f)}°`;
			WIND.innerText = `Ветер: ${Math.round(currentForecast.current.wind_mph)} mph`;
			FORECAST_DAY_1_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[0].day.avgtemp_f)}°`;
			FORECAST_DAY_2_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[1].day.avgtemp_f)}°`;
			FORECAST_DAY_3_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[2].day.avgtemp_f)}°`;
		}

		TICKER.innerText = `СЕГОДНЯ: ${TEMPERATURE_TODAY.innerText}°, ${FEELS_LIKE.innerText}, ${WIND.innerText}, ${HUMIDITY.innerText}`;
		forecast3days = `${FORECAST_DAY_1.innerText + FORECAST_DAY_1_TEMP.innerText},${currentForecast.forecast.forecastday[0].day.condition.text
			},${FORECAST_DAY_2.innerText}${FORECAST_DAY_2_TEMP.innerText},${currentForecast.forecast.forecastday[1].day.condition.text
			},${FORECAST_DAY_3.innerText}${FORECAST_DAY_3_TEMP.innerText},${currentForecast.forecast.forecastday[2].day.condition.text}`;
	} else {
		console.log('Город не найден...');
		SEARCH_INPUT.value = 'Город не найден...';
	}
}

async function renderingPageBE(city) {
	searchCity = await ifRussianLanguageThenTranslate(city);

	const currentForecast = await getWeatherForecastFor3Days(searchCity);

	if (currentForecast.error === undefined) {
		const backgroundImage = await getLinkToImage(searchCity);
		BODY.style.backgroundImage = `url('${backgroundImage}')`;

		S_I_B.textContent = 'ПОШУК';
		S_I.placeholder = 'Увядзіце горад';
		LOCATION.innerText = `${await getWordTranslationEnBE(currentForecast.location.name)}, ${await getWordTranslationEnBE(currentForecast.location.country)}`;
		DATE_TIME.innerText = `${shortDayOfWeekBE[nowDate.getDay()]} ${nowDate.getDate()} ${monthsBE[nowDate.getMonth()]}`;

		LATITUDE.innerText = `Шырата ${parseInt(currentForecast.location.lat)}°${parseInt((currentForecast.location.lat - parseInt(currentForecast.location.lat)) * 100)}'`;
		LONGITUDE.innerText = `Даўгата ${parseInt(currentForecast.location.lon)}°${parseInt((currentForecast.location.lon - parseInt(currentForecast.location.lon)) * 100)}'`;
		HUMIDITY.innerText = `Вільготнасць:: ${currentForecast.current.humidity}%`;
		CONDITION.innerHTML = await getWordTranslationEnBE(currentForecast.current.condition.text);

		for (let i = 0; i < weatherIcons.length; i++) {
			if (weatherIcons[i].code === String(currentForecast.current.condition.code)) {
				ICON_1.src = `./assets/weather-icons/${weatherIcons[i].day}`;
			}
			if (weatherIcons[i].code === String(currentForecast.forecast.forecastday[0].day.condition.code)) {
				ICON_2.src = `./assets/weather-icons/${weatherIcons[i].day}`;
			}
			if (weatherIcons[i].code === String(currentForecast.forecast.forecastday[1].day.condition.code)) {
				ICON_3.src = `./assets/weather-icons/${weatherIcons[i].day}`;
			}
			if (weatherIcons[i].code === String(currentForecast.forecast.forecastday[2].day.condition.code)) {
				ICON_4.src = `./assets/weather-icons/${weatherIcons[i].day}`;
			}
		}

		FORECAST_DAY_1.innerText = dayOfWeekBE[nowDate.getDay() + 1];
		FORECAST_DAY_2.innerText = dayOfWeekBE[nowDate.getDay() + 2];
		FORECAST_DAY_3.innerText = dayOfWeekBE[nowDate.getDay() + 3];

		IMAGE_MAP.innerHTML = `<iframe id="MAP" width="400" height="400"
			src="https://maps.google.com/maps?width=400&amp;height=400&amp;hl=be&amp;q=${searchCity}
			&amp;ie=UTF8&amp;z=13&amp;output=embed"
			frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>`;

		if (isCelsius) {
			TEMPERATURE_TODAY.innerText = `${Math.round(currentForecast.current.temp_c)}`;
			FEELS_LIKE.innerText = `Адчуваецца як: ${Math.round(currentForecast.current.feelslike_c)}°`;
			WIND.innerText = `Вецер: ${Math.round(currentForecast.current.wind_kph * 1000 / 3600)} м/с`;
			FORECAST_DAY_1_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[0].day.avgtemp_c)}°`;
			FORECAST_DAY_2_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[1].day.avgtemp_c)}°`;
			FORECAST_DAY_3_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[2].day.avgtemp_c)}°`;
		} else {
			TEMPERATURE_TODAY.innerText = `${Math.round(currentForecast.current.temp_f)}`;
			FEELS_LIKE.innerText = `Адчуваецца як: ${Math.round(currentForecast.current.feelslike_f)}°`;
			WIND.innerText = `Вецер: ${Math.round(currentForecast.current.wind_mph)} mph`;
			FORECAST_DAY_1_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[0].day.avgtemp_f)}°`;
			FORECAST_DAY_2_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[1].day.avgtemp_f)}°`;
			FORECAST_DAY_3_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[2].day.avgtemp_f)}°`;
		}

		TICKER.innerText = `СЁННЯ: ${TEMPERATURE_TODAY.innerText}°, ${FEELS_LIKE.innerText}, ${WIND.innerText}, ${HUMIDITY.innerText}`;
		forecast3days = `${FORECAST_DAY_1.innerText + FORECAST_DAY_1_TEMP.innerText},${currentForecast.forecast.forecastday[0].day.condition.text
			},${FORECAST_DAY_2.innerText}${FORECAST_DAY_2_TEMP.innerText},${currentForecast.forecast.forecastday[1].day.condition.text
			},${FORECAST_DAY_3.innerText}${FORECAST_DAY_3_TEMP.innerText},${currentForecast.forecast.forecastday[2].day.condition.text}`;
	} else {
		console.log('City not found...');
		SEARCH_INPUT.value = 'City not found...';
	}
}

async function selectorForRenderingPageByLanguage(languageCode) {
	if (languageCode === 'EN') renderingPageEN(searchCity);
	if (languageCode === 'RU') renderingPageRU(searchCity);
	if (languageCode === 'BE') renderingPageBE(searchCity);
}


// ----- Changing temperature only ----- //
async function changingTemperatureOnlyEN() {
	const currentForecast = await getWeatherForecastFor3Days(searchCity);

	if (isCelsius) {
		TEMPERATURE_TODAY.innerText = `${Math.round(currentForecast.current.temp_c)}`;
		FEELS_LIKE.innerText = `Feels like: ${Math.round(currentForecast.current.feelslike_c)}°`;
		WIND.innerText = `Wind: ${Math.round(currentForecast.current.wind_kph * 1000 / 3600)} m/s`;
		FORECAST_DAY_1_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[0].day.avgtemp_c)}°`;
		FORECAST_DAY_2_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[1].day.avgtemp_c)}°`;
		FORECAST_DAY_3_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[2].day.avgtemp_c)}°`;
	} else {
		TEMPERATURE_TODAY.innerText = `${Math.round(currentForecast.current.temp_f)}`;
		FEELS_LIKE.innerText = `Feels like: ${Math.round(currentForecast.current.feelslike_f)}°`;
		WIND.innerText = `Wind: ${Math.round(currentForecast.current.wind_mph)} mph`;
		FORECAST_DAY_1_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[0].day.avgtemp_f)}°`;
		FORECAST_DAY_2_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[1].day.avgtemp_f)}°`;
		FORECAST_DAY_3_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[2].day.avgtemp_f)}°`;
	}

	TICKER.innerText = `TODAY: ${TEMPERATURE_TODAY.innerText}°, ${FEELS_LIKE.innerText}, ${WIND.innerText}, ${HUMIDITY.innerText}`;
	forecast3days = `${FORECAST_DAY_1.innerText + FORECAST_DAY_1_TEMP.innerText},${currentForecast.forecast.forecastday[0].day.condition.text
		},${FORECAST_DAY_2.innerText}${FORECAST_DAY_2_TEMP.innerText},${currentForecast.forecast.forecastday[1].day.condition.text
		},${FORECAST_DAY_3.innerText}${FORECAST_DAY_3_TEMP.innerText},${currentForecast.forecast.forecastday[2].day.condition.text}`;
}

async function changingTemperatureOnlyRU() {
	const currentForecast = await getWeatherForecastFor3Days(searchCity);

	if (isCelsius) {
		TEMPERATURE_TODAY.innerText = `${Math.round(currentForecast.current.temp_c)}`;
		FEELS_LIKE.innerText = `Ощущается как: ${Math.round(currentForecast.current.feelslike_c)}°`;
		WIND.innerText = `Ветер: ${Math.round(currentForecast.current.wind_kph * 1000 / 3600)} м/с`;
		FORECAST_DAY_1_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[0].day.avgtemp_c)}°`;
		FORECAST_DAY_2_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[1].day.avgtemp_c)}°`;
		FORECAST_DAY_3_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[2].day.avgtemp_c)}°`;
	} else {
		TEMPERATURE_TODAY.innerText = `${Math.round(currentForecast.current.temp_f)}`;
		FEELS_LIKE.innerText = `Ощущается как: ${Math.round(currentForecast.current.feelslike_f)}°`;
		WIND.innerText = `Ветер: ${Math.round(currentForecast.current.wind_mph)} mph`;
		FORECAST_DAY_1_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[0].day.avgtemp_f)}°`;
		FORECAST_DAY_2_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[1].day.avgtemp_f)}°`;
		FORECAST_DAY_3_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[2].day.avgtemp_f)}°`;
	}

	TICKER.innerText = `СЕГОДНЯ: ${TEMPERATURE_TODAY.innerText}°, ${FEELS_LIKE.innerText}, ${WIND.innerText}, ${HUMIDITY.innerText}`;
	forecast3days = `${FORECAST_DAY_1.innerText + FORECAST_DAY_1_TEMP.innerText},${currentForecast.forecast.forecastday[0].day.condition.text
		},${FORECAST_DAY_2.innerText}${FORECAST_DAY_2_TEMP.innerText},${currentForecast.forecast.forecastday[1].day.condition.text
		},${FORECAST_DAY_3.innerText}${FORECAST_DAY_3_TEMP.innerText},${currentForecast.forecast.forecastday[2].day.condition.text}`;
}

async function changingTemperatureOnlyBE() {
	const currentForecast = await getWeatherForecastFor3Days(searchCity);

	if (isCelsius) {
		TEMPERATURE_TODAY.innerText = `${Math.round(currentForecast.current.temp_c)}`;
		FEELS_LIKE.innerText = `Адчуваецца як: ${Math.round(currentForecast.current.feelslike_c)}°`;
		WIND.innerText = `Вецер: ${Math.round(currentForecast.current.wind_kph * 1000 / 3600)} м/с`;
		FORECAST_DAY_1_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[0].day.avgtemp_c)}°`;
		FORECAST_DAY_2_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[1].day.avgtemp_c)}°`;
		FORECAST_DAY_3_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[2].day.avgtemp_c)}°`;
	} else {
		TEMPERATURE_TODAY.innerText = `${Math.round(currentForecast.current.temp_f)}`;
		FEELS_LIKE.innerText = `Адчуваецца як: ${Math.round(currentForecast.current.feelslike_f)}°`;
		WIND.innerText = `Вецер: ${Math.round(currentForecast.current.wind_mph)} mph`;
		FORECAST_DAY_1_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[0].day.avgtemp_f)}°`;
		FORECAST_DAY_2_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[1].day.avgtemp_f)}°`;
		FORECAST_DAY_3_TEMP.innerText = `${Math.round(currentForecast.forecast.forecastday[2].day.avgtemp_f)}°`;
	}

	TICKER.innerText = `СЁННЯ: ${TEMPERATURE_TODAY.innerText}°, ${FEELS_LIKE.innerText}, ${WIND.innerText}, ${HUMIDITY.innerText}`;
	forecast3days = `${FORECAST_DAY_1.innerText + FORECAST_DAY_1_TEMP.innerText},${currentForecast.forecast.forecastday[0].day.condition.text
		},${FORECAST_DAY_2.innerText}${FORECAST_DAY_2_TEMP.innerText},${currentForecast.forecast.forecastday[1].day.condition.text
		},${FORECAST_DAY_3.innerText}${FORECAST_DAY_3_TEMP.innerText},${currentForecast.forecast.forecastday[2].day.condition.text}`;
}

async function selectorForChangingTemperatureOnly(languageCode) {
	if (languageCode === 'EN') changingTemperatureOnlyEN();
	if (languageCode === 'RU') changingTemperatureOnlyRU();
	if (languageCode === 'BE') changingTemperatureOnlyBE();
}

// ----- Button Celsius Pressed ----- //
BUTTON__CELSIUS.addEventListener('click', () => {
	BUTTON__CELSIUS.classList.add('active');
	BUTTON__FAHRENHEIT.classList.remove('active');
	isCelsius = true;
	localStorage.setItem('isCelsius', 'true');
	selectorForChangingTemperatureOnly(currentLanguage);
});


// ----- Button Fahrenheit Pressed ----- //
BUTTON__FAHRENHEIT.addEventListener('click', () => {
	BUTTON__FAHRENHEIT.classList.add('active');
	BUTTON__CELSIUS.classList.remove('active');
	isCelsius = false;
	localStorage.setItem('isCelsius', 'false');
	selectorForChangingTemperatureOnly(currentLanguage);
});


// ----- Button animation for pressed button ----- //
BODY.addEventListener('mousedown', (event) => {
	if (event.target.classList.contains('button')) {
		event.target.classList.add('Button_Pressed');
	}
});

BODY.addEventListener('mouseup', (event) => {
	if (event.target.classList.contains('button')) {
		event.target.classList.remove('Button_Pressed');
	}
});


// ----- Button Renew background image pressed ----- //
document.getElementById('BUTTON_UPDATE').addEventListener('click', async () => {
	SPINNER.classList.add('active');
	const backgroundImage = await getLinkToImage(searchCity);
	BODY.style.backgroundImage = `url('${backgroundImage}')`;
	SPINNER.classList.remove('active');
});


// ----- Button Search pressed ----- //
document.querySelector('.search-input__button').addEventListener('click', () => {
	searchCity = SEARCH_INPUT.value;
	if (searchCity === '') SEARCH_INPUT.value = 'Incorrect data...';
	else {
		selectorForRenderingPageByLanguage(currentLanguage);
	}
});


// ----- Enter pressed ----- //
BODY.addEventListener('keydown', (event) => {
	if (event.keyCode === 13) {
		searchCity = SEARCH_INPUT.value;
		if (searchCity === '') SEARCH_INPUT.value = 'Incorrect data...';
		else {
			selectorForRenderingPageByLanguage(currentLanguage);
		}
	}
});


// ----- Language Selector change ----- //
LANGUAGE.addEventListener('change', () => {
	currentLanguage = LANGUAGE.options[LANGUAGE.selectedIndex].text;
	selectorForRenderingPageByLanguage(currentLanguage);
	localStorage.setItem('storedLanguage', currentLanguage);
});


// ----- Button Speaker Pressed ----- //
function speak(text) {
	const message = new SpeechSynthesisUtterance();
	if (currentLanguage === 'EN') message.lang = 'en-EN';
	if (currentLanguage === 'RU') message.lang = 'ru-RU';
	if (currentLanguage === 'BE') message.lang = 'be-BE';
	message.rate = 1;
	message.text = text;
	window.speechSynthesis.speak(message);
}

SPEAKER.addEventListener('click', () => {
	if (SPEAKER.classList.contains('active')) {
		SPEAKER.classList.remove('active');
		window.speechSynthesis.cancel();
	} else {
		SPEAKER.classList.add('active');
		speak(TICKER.innerText);
	}
});


// ----- Button Microphone Pressed ----- //
const recognizer = new (window.speechRecognition || window.webkitSpeechRecognition)();

MICROPHONE.addEventListener('click', () => {
	if (currentLanguage === 'EN') recognizer.lang = 'en-EN';
	if (currentLanguage === 'RU') recognizer.lang = 'ru-RU';
	if (currentLanguage === 'BE') recognizer.lang = 'be-BE';
	recognizer.interimResults = true;

	recognizer.onresult = function (event) {
		const result = event.results[event.resultIndex];
		if (result.isFinal) {
			if (result[0].transcript === 'forecast' || result[0].transcript === 'прогноз') {
				speak(forecast3days);
			} else if (result[0].transcript === 'weather' || result[0].transcript === 'погода') {
				speak(TICKER.innerText);
			} else if (result[0].transcript === 'louder' || result[0].transcript === 'громче') {
				recognizer.volume += 0.1; // not working yet
			} else if (result[0].transcript === 'quieter' || result[0].transcript === 'тише') {
				recognizer.volume -= 0.1; // not working yet
			} else {
				SEARCH_INPUT.value = result[0].transcript;

				searchCity = SEARCH_INPUT.value;

				selectorForRenderingPageByLanguage(currentLanguage);
			}
			MICROPHONE.classList.remove('active');
		} else {
			console.log('Промежуточный результат: ', result[0].transcript);
		}
	};

	if (MICROPHONE.classList.contains('active')) {
		MICROPHONE.classList.remove('active');
		recognizer.stop();
	} else {
		MICROPHONE.classList.add('active');
		recognizer.start();
	}
});


// ----- On page load, I load information about city of user ----- //
window.addEventListener('DOMContentLoaded', async () => {
	searchCity = await getCityOnPageLoad();

	const backgroundImage = await getLinkToImage(searchCity);
	BODY.style.backgroundImage = `url('${backgroundImage}')`;

	if (localStorage.getItem('storedLanguage') !== null && localStorage.getItem('storedLanguage') !== undefined) {
		currentLanguage = localStorage.getItem('storedLanguage');
	}
	if (localStorage.getItem('isCelsius') !== null && localStorage.getItem('isCelsius') !== undefined) {
		isCelsius = localStorage.getItem('isCelsius');
	}

	if (isCelsius === 'false') {
		isCelsius = false;
		BUTTON__FAHRENHEIT.classList.add('active');
		BUTTON__CELSIUS.classList.remove('active');
	}
	if (currentLanguage === 'EN') {
		renderingPageEN(searchCity);
	}
	if (currentLanguage === 'RU') {
		renderingPageRU(searchCity);
		LANGUAGE[1].selected = true;
	}
	if (currentLanguage === 'BE') {
		renderingPageBE(searchCity);
		LANGUAGE[2].selected = true;
	}
});
