class HistorySearchApp {
    constructor() {
        this.eventsList = document.getElementById('events-list');
        this.dayInput = document.getElementById('day-input');
        this.monthSelect = document.getElementById('month-select');
        this.searchBtn = document.getElementById('search-btn');
        this.eventsCount = document.getElementById('events-count');
        this.loading = document.getElementById('loading');
        this.noResults = document.getElementById('no-results');
        this.errorMessage = document.getElementById('error-message');
        this.resultsTitle = document.getElementById('results-title');

        this.init();
    }

    init() {
        this.populateDays();
        this.addEventListeners();
    }

    populateDays() {
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            this.dayInput.appendChild(option);
        }
    }

    addEventListeners() {
        this.searchBtn.addEventListener('click', () => this.searchEvents());
        this.dayInput.addEventListener('change', () => this.validateForm());
        this.monthSelect.addEventListener('change', () => this.validateForm());
    }

    validateForm() {
        const day = this.dayInput.value;
        const month = this.monthSelect.value;
        this.searchBtn.disabled = !day || !month;
    }

    async searchEvents() {
        const day = this.dayInput.value;
        const month = this.monthSelect.value;
        
        if (!day || !month) {
            this.showError('Пожалуйста, выберите день и месяц');
            return;
        }

        this.showLoading();
        this.hideError();
        this.hideNoResults();

        try {
            const events = await this.fetchEventsFromWikipedia(month, day);
            this.displayEvents(events, month, day);
        } catch (error) {
            console.error('Error fetching events:', error);
            this.showError('Не удалось загрузить данные. Попробуйте еще раз.');
        }
    }

    async fetchEventsFromWikipedia(month, day) {
        // Форматируем дату для Wikipedia API (например, "January_1")
        const monthNames = {
            '1': 'January', '2': 'February', '3': 'March', '4': 'April',
            '5': 'May', '6': 'June', '7': 'July', '8': 'August',
            '9': 'September', '10': 'October', '11': 'November', '12': 'December'
        };

        const monthName = monthNames[month];
        const dateString = `${monthName}_${day}`;

        // Используем Wikipedia API для получения событий
        const url = `https://ru.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.events || [];
    }

    displayEvents(events, month, day) {
        this.hideLoading();

        if (!events || events.length === 0) {
            this.showNoResults();
            this.eventsCount.textContent = '0';
            return;
        }

        this.hideNoResults();

        const monthNames = {
            '1': 'января', '2': 'февраля', '3': 'марта', '4': 'апреля',
            '5': 'мая', '6': 'июня', '7': 'июля', '8': 'августа',
            '9': 'сентября', '10': 'октября', '11': 'ноября', '12': 'декабря'
        };

        const eventsHTML = events.map(event => `
            <div class="event-card">
                <div class="event-year">${event.year} год</div>
                <h3 class="event-title">${this.cleanText(event.text)}</h3>
                ${event.pages && event.pages[0] ? `
                    <p class="event-description">${this.cleanText(event.pages[0].extract || 'Описание недоступно')}</p>
                    <a href="${event.pages[0].content_urls.desktop.page}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="event-link">
                        Читать подробнее в Wikipedia
                    </a>
                ` : '<p class="event-description">Подробное описание недоступно</p>'}
            </div>
        `).join('');

        this.eventsList.innerHTML = eventsHTML;
        this.eventsCount.textContent = events.length;
        this.resultsTitle.textContent = `События за ${day} ${monthNames[month]}`;
    }

    cleanText(text) {
        // Очищаем текст от HTML тегов и лишних пробелов
        return text
            .replace(/<[^>]*>/g, '')
            .replace(/\[\d+\]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.eventsList.classList.add('hidden');
        this.hideNoResults();
        this.hideError();
    }

    hideLoading() {
        this.loading.classList.add('hidden');
        this.eventsList.classList.remove('hidden');
    }

    showNoResults() {
        this.noResults.classList.remove('hidden');
        this.eventsList.classList.add('hidden');
    }

    hideNoResults() {
        this.noResults.classList.add('hidden');
    }

    showError(message) {
        this.errorMessage.querySelector('p').textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.eventsList.classList.add('hidden');
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new HistorySearchApp();
});

// Fallback для случаев, когда Wikipedia API недоступно
async function fetchWithFallback(month, day) {
    try {
        return await new HistorySearchApp().fetchEventsFromWikipedia(month, day);
    } catch (error) {
        console.warn('Wikipedia API failed, using fallback data');
        return getFallbackEvents(month, day);
    }
}

// Резервные данные на случай недоступности Wikipedia API
function getFallbackEvents(month, day) {
    const fallbackEvents = {
        '1-1': [
            {
                year: 1863,
                text: "Авраам Линкольн издал Прокламацию об освобождении рабов",
                pages: [{
                    extract: "Исторический документ, который изменил ход Гражданской войны в США",
                    content_urls: { desktop: { page: "https://wikipedia.org/wiki/Emancipation_Proclamation" } }
                }]
            }
        ],
        '1-4': [
            {
                year: 1643,
                text: "Родился Исаак Ньютон, английский физик и математик",
                pages: [{
                    extract: "Один из самых влиятельных ученых в истории, автор закона всемирного тяготения",
                    content_urls: { desktop: { page: "https://wikipedia.org/wiki/Isaac_Newton" } }
                }]
            }
        ]
    };
    
    return fallbackEvents[`${month}-${day}`] || [];
}
