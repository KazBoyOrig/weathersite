const OWM_KEY = '1656c878af9a66d75d398329d6b1d1a9';

async function fetchWeatherByCity(city) {
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=kk&appid=${OWM_KEY}`;
  const res = await fetch(endpoint);
  if (!res.ok) {
    const d = await res.json().catch(() => ({ message: 'Қате' }));
    throw new Error(d.message || 'Қате пайда болды');
  }
  return res.json();
}

function renderWeatherCard(data) {
  const card = document.createElement('div');
  card.className = 'weather-card card-glass';
  const iconCode = data.weather?.[0]?.icon;
  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : '';
  card.innerHTML = `
    <div class="card-left">
      <div class="icon-wrap"><img src="${iconUrl}" alt="${data.weather?.[0]?.description || ''}" style="width:56px;height:56px"/></div>
      <div class="weather-info">
        <div style="font-weight:800">${data.name}, ${data.sys?.country || ''}</div>
        <div class="label">${data.weather?.[0]?.description || ''}</div>
      </div>
    </div>
    <div class="card-right" style="text-align:right">
      <div style="font-size:22px;font-weight:800">${Math.round(data.main.temp)}°C</div>
      <div class="label">Ылғ: ${data.main.humidity}% · Жел: ${Math.round(data.wind.speed)} м/с</div>
    </div>
  `;
  return card;
}

async function updateHeroWeather(city = 'Almaty') {
  const tempEl = document.querySelector('.temp-big');
  const metaEl = document.querySelector('.meta');
  const airEl = document.querySelector('.mini div:nth-child(1) div');
  const humEl = document.querySelector('.mini div:nth-child(2) div');
  const windEl = document.querySelector('.mini div:nth-child(3) div');

  try {
    const data = await fetchWeatherByCity(city);

    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const hum = data.main.humidity;
    const wind = data.wind.speed;
    const time = new Date().toLocaleTimeString('kk-KZ', {
      hour: '2-digit',
      minute: '2-digit',
    });

    tempEl.textContent = `${temp}°`;
    metaEl.textContent = `${data.name} · ${desc} · ${time}`;
    humEl.textContent = `${hum}%`;
    windEl.textContent = `${wind} м/с`;
    airEl.textContent = temp > 30 ? 'Ыстық' : temp < 0 ? 'Суық' : 'Жайлы';
  } catch (err) {
    metaEl.textContent = 'Қате: деректер алынбады!';
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('weatherForm');
  const input = document.getElementById('cityInput');
  const resultArea = document.getElementById('resultArea');
  const chips = document.querySelectorAll('.chip');

  if (chips) {
    chips.forEach(c =>
      c.addEventListener('click', () => {
        input.value = c.textContent.trim();
        form.requestSubmit();
      })
    );
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const city = input.value.trim();
    if (!city) return;
    resultArea.innerHTML = '<div class="empty-state card-glass"><p>Жүктелуде...</p></div>';
    try {
      const data = await fetchWeatherByCity(city);
      resultArea.innerHTML = '';
      const card = renderWeatherCard(data);
      resultArea.appendChild(card);
      const details = document.createElement('div');
      details.className = 'card-glass content';
      details.innerHTML = `<h3>Толық мәлімет</h3>
        <p>Мин: ${Math.round(data.main.temp_min)}° · Макс: ${Math.round(data.main.temp_max)}°</p>
        <p>Басқа: қысым ${data.main.pressure} hPa</p>`;
      resultArea.appendChild(details);

      updateHeroWeather(city);
    } catch (err) {
      resultArea.innerHTML =
        '<div class="empty-state card-glass"><p style="color:#ef4444">Қате: ' +
        (err.message || 'Қате') +
        '</p></div>';
    }
  });
  updateHeroWeather('Almaty');
});
