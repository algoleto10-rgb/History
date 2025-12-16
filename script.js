// script.js
class HistorySearchApp {
    constructor() {
        this.eventsList = document.getElementById('events-list');
        this.dayInput = document.getElementById('day-input');
        this.monthSelect = document.getElementById('month-select');
        this.yearInput = document.getElementById('year-input');
        this.searchBtn = document.getElementById('search-btn');
        this.eventsCount = document.getElementById('events-count');
        this.loading = document.getElementById('loading');
        this.noResults = document.getElementById('no-results');
        this.errorMessage = document.getElementById('error-message');
        this.resultsTitle = document.getElementById('results-title');
        this.activeFilters = document.getElementById('active-filters');
        
        // Элементы фильтров
        this.countryFilter = document.getElementById('country-filter');
        this.categoryFilter = document.getElementById('category-filter');
        this.scaleFilter = document.getElementById('scale-filter');
        this.periodFilter = document.getElementById('period-filter');
        this.applyFiltersBtn = document.getElementById('apply-filters');
        this.resetFiltersBtn = document.getElementById('reset-filters');
        this.toggleFiltersBtn = document.getElementById('toggle-filters');
        this.filtersContainer = document.querySelector('.filters-container');
        this.sortSelect = document.getElementById('sort-select');
        
        // Текущие события и фильтры
        this.currentEvents = [];
        this.filteredEvents = [];
        this.currentFilters = {
            country: '',
            category: '',
            scale: '',
            period: ''
        };
        
        this.init();
    }

    init() {
        this.populateDays();
        this.populateYears();
        this.populateFilters();
        this.addEventListeners();
        this.loadFiltersState();
    }

    populateDays() {
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            this.dayInput.appendChild(option);
        }
    }

    populateYears() {
        const currentYear = new Date().getFullYear();
        const startYear = 1000;
        
        for (let i = currentYear; i >= startYear; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            this.yearInput.appendChild(option);
        }
    }

    populateFilters() {
        // Страны
        const countries = [
            'Россия', 'США', 'Китай', 'Германия', 'Франция', 'Великобритания',
            'Япония', 'Италия', 'Испания', 'Индия', 'Канада', 'Австралия',
            'Бразилия', 'Мексика', 'Южная Корея', 'Турция', 'Польша',
            'Нидерланды', 'Бельгия', 'Швейцария', 'Швеция', 'Норвегия',
            'Дания', 'Финляндия', 'Австрия', 'Португалия', 'Греция',
            'Ирландия', 'Чехия', 'Венгрия', 'Румыния', 'Украина', 'Беларусь',
            'Казахстан', 'Израиль', 'Саудовская Аравия', 'ОАЭ', 'ЮАР',
            'Египет', 'Аргентина', 'Чили', 'Колумбия', 'Перу', 'Венесуэла',
            'Индонезия', 'Малайзия', 'Филиппины', 'Вьетнам', 'Таиланд'
        ];
        
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.toLowerCase();
            option.textContent = country;
            this.countryFilter.appendChild(option);
        });
        
        // Тематики
        const categories = [
            'Политика', 'Война', 'Наука', 'Технологии', 'Искусство',
            'Литература', 'Музыка', 'Кино', 'Театр', 'Спорт',
            'Экономика', 'Медицина', 'Философия', 'Религия',
            'География', 'Архитектура', 'Мода', 'Кулинария',
            'Образование', 'Право', 'Социология', 'Психология',
            'Астрономия', 'Физика', 'Химия', 'Биология',
            'Математика', 'Инженерия', 'Транспорт', 'Связь'
        ];
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.toLowerCase();
            option.textContent = category;
            this.categoryFilter.appendChild(option);
        });
    }

    addEventListeners() {
        this.searchBtn.addEventListener('click', () => this.searchEvents());
        this.dayInput.addEventListener('change', () => this.validateForm());
        this.monthSelect.addEventListener('change', () => this.validateForm());
        this.yearInput.addEventListener('change', () => this.validateForm());
        
        // Фильтры
        this.applyFiltersBtn.addEventListener('click', () => this.applyFilters());
        this.resetFiltersBtn.addEventListener('click', () => this.resetFilters());
        this.toggleFiltersBtn.addEventListener('click', () => this.toggleFilters());
        this.sortSelect.addEventListener('change', () => this.sortEvents());
        
        // Сохранение состояния фильтров при изменении
        this.countryFilter.addEventListener('change', () => this.saveFiltersState());
        this.categoryFilter.addEventListener('change', () => this.saveFiltersState());
        this.scaleFilter.addEventListener('change', () => this.saveFiltersState());
        this.periodFilter.addEventListener('change', () => this.saveFiltersState());
        
        // Сохранение состояния при закрытии страницы
        window.addEventListener('beforeunload', () => this.saveFiltersState());
    }

    validateForm() {
        const day = this.dayInput.value;
        const month = this.monthSelect.value;
        const year = this.yearInput.value;
        
        if (year) {
            this.searchBtn.disabled = !day || !month;
        } else {
            this.searchBtn.disabled = !day || !month;
        }
    }

    async searchEvents() {
        const day = this.dayInput.value;
        const month = this.monthSelect.value;
        const year = this.yearInput.value;
        
        if (!day || !month) {
            this.showError('Пожалуйста, выберите день и месяц');
            return;
        }

        this.showLoading();
        this.hideError();
        this.hideNoResults();

        try {
            const events = await this.fetchEventsFromWikipedia(month, day, year);
            this.currentEvents = this.enrichEventsWithMetadata(events);
            this.filteredEvents = [...this.currentEvents];
            this.applyFilters(true);
            this.saveFiltersState();
        } catch (error) {
            console.error('Error fetching events:', error);
            this.showError('Не удалось загрузить данные. Проверьте подключение к интернету и попробуйте еще раз.');
        }
    }

    enrichEventsWithMetadata(events) {
        return events.map(event => {
            // Определяем категорию события на основе текста
            const text = event.text.toLowerCase();
            let category = 'другое';
            let country = 'неизвестно';
            let scale = this.determineEventScale(event);
            let period = this.determineEventPeriod(event.year);
            let importance = this.calculateEventImportance(event);
            
            // Определяем страну (упрощенный анализ)
            const countryKeywords = {
                'россия': ['россия', 'русск', 'москва', 'петербург', 'ссср'],
                'сша': ['сша', 'америк', 'вашингтон', 'нью-йорк'],
                'франция': ['франция', 'париж', 'француз'],
                'германия': ['германия', 'берлин', 'немецк'],
                'великобритания': ['англия', 'лондон', 'британ', 'великобритания'],
                'китай': ['китай', 'пекин', 'китайск'],
                'япония': ['япония', 'токио', 'японск']
            };
            
            for (const [countryName, keywords] of Object.entries(countryKeywords)) {
                if (keywords.some(keyword => text.includes(keyword))) {
                    country = countryName;
                    break;
                }
            }
            
            // Определяем категорию
            const categoryKeywords = {
                'война': ['война', 'битва', 'сражение', 'воен', 'конфликт'],
                'политика': ['правитель', 'президент', 'король', 'королева', 'монарх', 'парламент', 'закон'],
                'наука': ['наука', 'ученый', 'открытие', 'изобретение', 'нобелевск'],
                'искусство': ['искусство', 'художник', 'картина', 'скульпт', 'выставка'],
                'литература': ['литература', 'писатель', 'поэт', 'роман', 'книга'],
                'музыка': ['музыка', 'композитор', 'симфония', 'концерт', 'опера'],
                'спорт': ['спорт', 'чемпионат', 'олимпийск', 'футбол', 'баскетбол']
            };
            
            for (const [catName, keywords] of Object.entries(categoryKeywords)) {
                if (keywords.some(keyword => text.includes(keyword))) {
                    category = catName;
                    break;
                }
            }
            
            return {
                ...event,
                metadata: {
                    category,
                    country,
                    scale,
                    period,
                    importance
                }
            };
        });
    }

    determineEventScale(event) {
        const text = event.text.toLowerCase();
        const year = parseInt(event.year);
        
        // Ключевые слова для определения масштаба
        const globalKeywords = ['миров', 'глобаль', 'всемирн', 'международ', 'оон', 'нато'];
        const regionalKeywords = ['европ', 'азиат', 'африкан', 'американ', 'регион'];
        const nationalKeywords = ['националь', 'государств', 'страна', 'республик'];
        
        if (globalKeywords.some(keyword => text.includes(keyword))) {
            return 'global';
        }
        
        if (regionalKeywords.some(keyword => text.includes(keyword))) {
            return 'regional';
        }
        
        if (nationalKeywords.some(keyword => text.includes(keyword))) {
            return 'national';
        }
        
        // Определяем по важности события
        if (Math.abs(year - new Date().getFullYear()) <= 100) {
            return Math.random() > 0.7 ? 'global' : 'national';
        }
        
        return Math.random() > 0.5 ? 'regional' : 'local';
    }

    determineEventPeriod(year) {
        if (year < 476) return 'ancient';
        if (year < 1453) return 'medieval';
        if (year < 1789) return 'renaissance';
        if (year < 1914) return 'modern';
        return 'contemporary';
    }

    calculateEventImportance(event) {
        // Упрощенный расчет важности события
        let importance = 1;
        const text = event.text.toLowerCase();
        
        // Ключевые слова, указывающие на важность
        const importantKeywords = [
            'перв', 'велик', 'важн', 'знамен', 'историч',
            'революц', 'война', 'мир', 'открытие', 'изобретение'
        ];
        
        importantKeywords.forEach(keyword => {
            if (text.includes(keyword)) {
                importance += 0.5;
            }
        });
        
        // Важность в зависимости от давности
        const currentYear = new Date().getFullYear();
        const age = currentYear - parseInt(event.year);
        
        if (age <= 100) importance += 1;
        else if (age <= 500) importance += 0.5;
        
        // Ограничиваем от 1 до 5
        return Math.min(5, Math.max(1, Math.round(importance)));
    }

    applyFilters(updateDisplay = false) {
        // Сохраняем текущие фильтры
        this.currentFilters = {
            country: this.countryFilter.value,
            category: this.categoryFilter.value,
            scale: this.scaleFilter.value,
            period: this.periodFilter.value
        };
        
        // Фильтруем события
        this.filteredEvents = this.currentEvents.filter(event => {
            const meta = event.metadata;
            
            // Проверяем каждый фильтр
            if (this.currentFilters.country && 
                meta.country.toLowerCase() !== this.currentFilters.country) {
                return false;
            }
            
            if (this.currentFilters.category && 
                meta.category.toLowerCase() !== this.currentFilters.category) {
                return false;
            }
            
            if (this.currentFilters.scale && 
                meta.scale !== this.currentFilters.scale) {
                return false;
            }
            
            if (this.currentFilters.period && 
                meta.period !== this.currentFilters.period) {
                return false;
            }
            
            return true;
        });
        
        // Сортируем события
        this.sortEvents();
        
        // Обновляем отображение
        if (updateDisplay) {
            this.updateActiveFilters();
            this.displayEvents(this.filteredEvents);
        }
    }

    resetFilters() {
        this.countryFilter.value = '';
        this.categoryFilter.value = '';
        this.scaleFilter.value = '';
        this.periodFilter.value = '';
        
        this.applyFilters(true);
    }

    toggleFilters() {
        this.filtersContainer.classList.toggle('collapsed');
        const icon = this.toggleFiltersBtn.querySelector('i');
        
        if (this.filtersContainer.classList.contains('collapsed')) {
            icon.className = 'fas fa-sliders-h';
            this.toggleFiltersBtn.title = 'Показать фильтры';
        } else {
            icon.className = 'fas fa-chevron-up';
            this.toggleFiltersBtn.title = 'Скрыть фильтры';
        }
        
        this.saveFiltersState();
    }

    updateActiveFilters() {
        this.activeFilters.innerHTML = '';
        
        Object.entries(this.currentFilters).forEach(([key, value]) => {
            if (value) {
                const filterNames = {
                    country: 'Страна',
                    category: 'Тематика',
                    scale: 'Масштаб',
                    period: 'Период'
                };
                
                const filterValues = {
                    global: 'Мировой',
                    regional: 'Региональный',
                    national: 'Национальный',
                    local: 'Локальный',
                    ancient: 'Древний мир',
                    medieval: 'Средневековье',
                    renaissance: 'Возрождение',
                    modern: 'Новое время',
                    contemporary: 'Новейшее время'
                };
                
                const displayValue = filterValues[value] || 
                    (value.charAt(0).toUpperCase() + value.slice(1));
                
                const tag = document.createElement('div');
                tag.className = 'filter-tag';
                tag.innerHTML = `
                    <span>${filterNames[key]}: ${displayValue}</span>
                    <i class="fas fa-times" data-filter="${key}"></i>
                `;
                
                tag.querySelector('i').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.clearFilter(key);
                });
                
                this.activeFilters.appendChild(tag);
            }
        });
    }

    clearFilter(filterName) {
        switch(filterName) {
            case 'country':
                this.countryFilter.value = '';
                break;
            case 'category':
                this.categoryFilter.value = '';
                break;
            case 'scale':
                this.scaleFilter.value = '';
                break;
            case 'period':
                this.periodFilter.value = '';
                break;
        }
        
        this.applyFilters(true);
    }

    sortEvents() {
        const sortValue = this.sortSelect.value;
        
        switch(sortValue) {
            case 'year-asc':
                this.filteredEvents.sort((a, b) => parseInt(a.year) - parseInt(b.year));
                break;
            case 'year-desc':
                this.filteredEvents.sort((a, b) => parseInt(b.year) - parseInt(a.year));
                break;
            case 'relevance':
                this.filteredEvents.sort((a, b) => b.metadata.importance - a.metadata.importance);
                break;
        }
        
        this.displayEvents(this.filteredEvents);
    }

    async fetchEventsFromWikipedia(month, day, year) {
        if (year) {
            return await this.fetchEventsByYear(month, day, year);
        } else {
            const url = `https://ru.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.events || [];
        }
    }

    async fetchEventsByYear(month, day, year) {
        const url = `https://ru.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        if (data.events) {
            return data.events.filter(event => event.year == year);
        }
        
        return [];
    }

    displayEvents(events) {
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

        const scaleNames = {
            'global': 'Мировой',
            'regional': 'Региональный',
            'national': 'Национальный',
            'local': 'Локальный'
        };

        const periodNames = {
            'ancient': 'Древний мир',
            'medieval': 'Средневековье',
            'renaissance': 'Возрождение',
            'modern': 'Новое время',
            'contemporary': 'Новейшее время'
        };

        const eventsHTML = events.map(event => {
            const meta = event.metadata;
            const scaleName = scaleNames[meta.scale] || meta.scale;
            const periodName = periodNames[meta.period] || meta.period;
            
            return `
                <div class="event-card">
                    <div class="event-header">
                        <div class="event-year">${event.year} год</div>
                        <div class="event-tags">
                            <span class="event-tag country">${meta.country}</span>
                            <span class="event-tag category">${meta.category}</span>
                            <span class="event-tag scale">${scaleName}</span>
                            <span class="event-tag period">${periodName}</span>
                        </div>
                    </div>
                    <h3 class="event-title">${this.cleanText(event.text)}</h3>
                    <p class="event-description">${this.cleanText(event.pages?.[0]?.extract || 'Описание недоступно')}</p>
                    <div class="event-footer">
                        ${event.pages && event.pages[0] ? `
                            <a href="${event.pages[0].content_urls.desktop.page}" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               class="event-link">
                                <i class="fab fa-wikipedia-w"></i>
                                Читать подробнее в Wikipedia
                            </a>
                        ` : ''}
                        <div class="event-importance">
                            <span>Важность:</span>
                            <div class="importance-stars">
                                ${'★'.repeat(meta.importance)}${'☆'.repeat(5 - meta.importance)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.eventsList.innerHTML = eventsHTML;
        this.eventsCount.textContent = events.length;
        
        const day = this.dayInput.value;
        const month = this.monthSelect.value;
        const year = this.yearInput.value;
        
        if (year) {
            this.resultsTitle.textContent = `События за ${day} ${monthNames[month]} ${year} года`;
        } else {
            this.resultsTitle.textContent = `События за ${day} ${monthNames[month]}`;
        }
    }

    saveFiltersState() {
        const state = {
            day: this.dayInput.value,
            month: this.monthSelect.value,
            year: this.yearInput.value,
            filters: this.currentFilters,
            filtersCollapsed: this.filtersContainer.classList.contains('collapsed'),
            sort: this.sortSelect.value
        };
        
        localStorage.setItem('historySearchAppState', JSON.stringify(state));
    }

    loadFiltersState() {
        const savedState = localStorage.getItem('historySearchAppState');
        
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                
                if (state.day) this.dayInput.value = state.day;
                if (state.month) this.monthSelect.value = state.month;
                if (state.year) this.yearInput.value = state.year;
                if (state.sort) this.sortSelect.value = state.sort;
                
                if (state.filters) {
                    this.currentFilters = state.filters;
                    this.countryFilter.value = state.filters.country || '';
                    this.categoryFilter.value = state.filters.category || '';
                    this.scaleFilter.value = state.filters.scale || '';
                    this.periodFilter.value = state.filters.period || '';
                }
                
                if (state.filtersCollapsed) {
                    this.filtersContainer.classList.add('collapsed');
                    const icon = this.toggleFiltersBtn.querySelector('i');
                    icon.className = 'fas fa-sliders-h';
                    this.toggleFiltersBtn.title = 'Показать фильтры';
                }
                
                this.validateForm();
            } catch (e) {
                console.error('Error loading saved state:', e);
            }
        }
    }

    cleanText(text) {
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

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new HistorySearchApp();
});

// Резервные данные
function getFallbackEvents(month, day, year) {
    const fallbackEvents = {
        '1-1': [
            {
                year: "1863",
                text: "Авраам Линкольн издал Прокламацию об освобождении рабов",
                pages: [{
                    extract: "Исторический документ, который изменил ход Гражданской войны в США",
                    content_urls: { desktop: { page: "https://wikipedia.org/wiki/Emancipation_Proclamation" } }
                }]
            },
            {
                year: "1942",
                text: "Подписана Декларация Объединенных Наций в Вашингтоне",
                pages: [{
                    extract: "Документ, заложивший основы создания ООН",
                    content_urls: { desktop: { page: "https://wikipedia.org/wiki/Declaration_by_United_Nations" } }
                }]
            }
        ],
        '1-4': [
            {
                year: "1643",
                text: "Родился Исаак Ньютон, английский физик и математик",
                pages: [{
                    extract: "Один из самых влиятельных ученых в истории, автор закона всемирного тяготения",
                    content_urls: { desktop: { page: "https://wikipedia.org/wiki/Isaac_Newton" } }
                }]
            },
            {
                year: "1809",
                text: "Родился Луи Брайль, создатель шрифта для слепых",
                pages: [{
                    extract: "Французский педагог, разработавший шрифт Брайля",
                    content_urls: { desktop: { page: "https://wikipedia.org/wiki/Louis_Braille" } }
                }]
            }
        ]
    };
    
    const key = `${month}-${day}`;
    let events = fallbackEvents[key] || [];
    
    if (year) {
        events = events.filter(event => event.year == year);
    }
    
    return events;
}
