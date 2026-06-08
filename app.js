// Helper to remove Vietnamese diacritics for search matching
function removeAccents(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

document.addEventListener('DOMContentLoaded', () => {
    initStats();
    initTabs();
    initItinerary();
    initRecommendations();
});

// Category categorization helper for Itinerary stats & badge styling
function getCategoryInfo(categoryStr) {
    const cat = categoryStr.toLowerCase();
    if (cat.includes('cà phê') || cat.includes('cafe')) {
        return { name: 'Cà phê', class: 'cafe', color: 'var(--accent-teal)' };
    } else if (cat.includes('ăn uống') || cat.includes('ăn')) {
        return { name: 'Ăn uống', class: 'food', color: 'var(--accent-gold)' };
    } else if (cat.includes('check-in') || cat.includes('checkin')) {
        return { name: 'Check-in', class: 'checkin', color: 'var(--accent-rose)' };
    } else if (cat.includes('du lịch') || cat.includes('tâm linh')) {
        return { name: 'Du lịch', class: 'tour', color: 'var(--accent-purple)' };
    } else if (cat.includes('vui chơi') || cat.includes('giải trí')) {
        return { name: 'Vui chơi', class: 'travel', color: 'var(--accent-blue)' };
    } else if (cat.includes('sự kiện') || cat.includes('event')) {
        return { name: 'Sự kiện', class: 'event', color: 'var(--accent-rose)' };
    } else if (cat.includes('di chuyển')) {
        return { name: 'Di chuyển', class: 'travel', color: 'var(--accent-blue)' };
    } else {
        return { name: categoryStr, class: 'general', color: 'var(--text-muted)' };
    }
}

// 1. Statistics Initialization
function initStats() {
    // Dynamic Category Breakdown for Itinerary
    const counts = { 'Ăn uống': 0, 'Cà phê': 0, 'Du lịch': 0, 'Vui chơi / Khác': 0 };
    let totalItems = 0;

    ITINERARY.forEach(item => {
        const catInfo = getCategoryInfo(item.category);
        if (counts[catInfo.name] !== undefined) {
            counts[catInfo.name]++;
        } else {
            counts['Vui chơi / Khác']++;
        }
        totalItems++;
    });

    const progressBar = document.getElementById('category-progress');
    progressBar.innerHTML = '';

    const colors = {
        'Ăn uống': 'var(--accent-gold)',
        'Cà phê': 'var(--accent-teal)',
        'Du lịch': 'var(--accent-purple)',
        'Vui chơi / Khác': 'var(--accent-blue)'
    };

    Object.keys(counts).forEach(key => {
        const count = counts[key];
        if (count === 0) return;
        const percentage = (count / totalItems) * 100;
        
        const segment = document.createElement('div');
        segment.className = 'progress-segment';
        segment.style.width = `${percentage}%`;
        segment.style.backgroundColor = colors[key];
        segment.setAttribute('data-tooltip', `${key}: ${count} lần (${Math.round(percentage)}%)`);
        progressBar.appendChild(segment);
    });
}

// 2. Navigation Tabs
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// 3. Itinerary Timeline Rendering
function initItinerary() {
    const dayBtns = document.querySelectorAll('.day-btn');
    const timeline = document.getElementById('itinerary-timeline');

    function renderDay(selectedDay) {
        timeline.innerHTML = '';
        const dayEvents = ITINERARY.filter(item => item.date === selectedDay);

        dayEvents.sort((a, b) => a.stop_order - b.stop_order);

        dayEvents.forEach(event => {
            const catInfo = getCategoryInfo(event.category);
            
            const itemElement = document.createElement('div');
            itemElement.className = 'timeline-item';
            if (catInfo.class === 'event') {
                itemElement.className += ' event-timeline-item';
            }
            
            // Format Currency
            const costFormatted = event.cost_estimate > 0 
                ? new Intl.NumberFormat('vi-VN').format(event.cost_estimate) + ' VND' 
                : 'Miễn phí';

            // Format Duration
            const durationText = event.duration_minutes >= 60
                ? `${(event.duration_minutes / 60).toFixed(1).replace('.0', '')} giờ`
                : `${event.duration_minutes} phút`;

            // Google rating star if exists
            const ratingHtml = event.rating > 0
                ? `<span class="badge rating-badge"><i class="fa-solid fa-star"></i> ${event.rating.toFixed(1)}</span>`
                : '';

            // TikTok popularity badge
            const tiktokHtml = event.tiktok_popularity && event.tiktok_popularity !== 'Trung bình' && event.tiktok_popularity !== 'Không'
                ? `<span class="badge tiktok-hot-badge"><i class="fa-brands fa-tiktok"></i> ${event.tiktok_popularity}</span>`
                : '';

            // Distance to next info
            const distanceHtml = event.distance_to_next && event.distance_to_next !== '0 km' && event.distance_to_next !== '0 km (kết thúc)'
                ? `<div class="distance-text"><i class="fa-solid fa-route"></i> Kế tiếp: ${event.distance_to_next}</div>`
                : '';

            itemElement.innerHTML = `
                <div class="timeline-node"></div>
                <div class="timeline-card" onclick="window.open('${event.google_maps_url}', '_blank')">
                    <div class="time-badge-column">
                        <div class="time-slot-label">${event.time_slot}</div>
                        <div class="time-range">${event.start_time} - ${event.end_time}</div>
                    </div>
                    <div class="card-detail-column">
                        <div class="card-header-row">
                            <h3 class="location-title">
                                <span class="stop-number">#${event.stop_order}</span>
                                <i class="fa-solid fa-location-dot"></i> ${event.location_name}
                            </h3>
                        </div>
                        <div class="badge-row">
                            <span class="badge ${catInfo.class}">${event.category}</span>
                            <span class="badge general"><i class="fa-regular fa-clock"></i> ${durationText}</span>
                            ${ratingHtml}
                            ${tiktokHtml}
                        </div>
                        <p class="reason-text">${event.reason}</p>
                        <div class="address-text">
                            <i class="fa-solid fa-map-marked-alt"></i> ${event.address}
                        </div>
                        ${distanceHtml}
                    </div>
                    <div class="actions-column">
                        <div class="price-tag">
                            <i class="fa-solid fa-tags"></i> ${costFormatted}
                        </div>
                        <button class="btn-map" onclick="event.stopPropagation(); window.open('${event.google_maps_url}', '_blank')">
                            <i class="fa-solid fa-map-location-dot"></i> Bản đồ
                        </button>
                    </div>
                </div>
            `;
            timeline.appendChild(itemElement);
        });
    }

    // Bind Day Switch Click Events
    dayBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dayBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderDay(btn.getAttribute('data-day'));
        });
    });

    // Render initial day (Day 1)
    renderDay('25/06/2026');
}

// Helper to extract numeric price for sorting
function parseMinPrice(priceStr) {
    if (!priceStr) return 0;
    const str = priceStr.toLowerCase();
    if (str.includes('miễn phí') || str.includes('free')) return 0;
    
    // Check for 'k' notation (e.g. 40k)
    const match = str.match(/(\d+)\s*k/);
    if (match) {
        return parseInt(match[1]) * 1000;
    }
    
    // Check for raw number
    const rawNumMatch = str.match(/(\d+[\d\.,]*)/);
    if (rawNumMatch) {
        let numStr = rawNumMatch[1].replace(/[\.,]/g, '');
        let val = parseInt(numStr);
        if (str.includes('k')) val *= 1000;
        return val;
    }
    return 0;
}

// 4. Recommendations List Rendering & Filtering
function initRecommendations() {
    const grid = document.getElementById('recommendations-grid');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input');
    const tiktokCheckbox = document.getElementById('tiktok-hot-checkbox');
    const sortSelect = document.getElementById('sort-select');
    const filterBtns = document.querySelectorAll('#category-filter-group .filter-btn');

    let currentCategory = 'All';

    function renderRecommendations() {
        const query = searchInput.value.toLowerCase().trim();
        const showTikTokOnly = tiktokCheckbox.checked;
        const sortBy = sortSelect.value;

        // Apply filters
        let filtered = RECOMMENDATIONS.filter(item => {
            // Category check
            if (currentCategory !== 'All' && item.category !== currentCategory) {
                return false;
            }
            
            // TikTok check
            if (showTikTokOnly && !item.tiktok_hot) {
                return false;
            }

            // Search query check
            if (query) {
                const cleanQuery = removeAccents(query);
                const nameMatch = removeAccents(item.name.toLowerCase()).includes(cleanQuery);
                const addressMatch = removeAccents(item.address.toLowerCase()).includes(cleanQuery);
                const reasonMatch = removeAccents(item.reason.toLowerCase()).includes(cleanQuery);
                return nameMatch || addressMatch || reasonMatch;
            }

            return true;
        });

        // Apply sorting
        if (sortBy === 'rating-desc') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'price-asc') {
            filtered.sort((a, b) => parseMinPrice(a.price_range) - parseMinPrice(b.price_range));
        } else if (sortBy === 'price-desc') {
            filtered.sort((a, b) => parseMinPrice(b.price_range) - parseMinPrice(a.price_range));
        }

        // Render HTML
        grid.innerHTML = '';
        if (filtered.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';

        filtered.forEach(place => {
            const card = document.createElement('div');
            card.className = 'place-card';
            card.onclick = () => window.open(place.maps_url, '_blank');

            // Render category badge
            const catInfo = getCategoryInfo(place.category);

            // Rating Stars
            let starsHtml = '';
            const ratingFloor = Math.floor(place.rating);
            for (let i = 0; i < 5; i++) {
                if (i < ratingFloor) {
                    starsHtml += '<i class="fa-solid fa-star"></i>';
                } else if (i === ratingFloor && place.rating % 1 !== 0) {
                    starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
                } else {
                    starsHtml += '<i class="fa-regular fa-star"></i>';
                }
            }

            card.innerHTML = `
                <div class="place-header">
                    <h3 class="place-title">${place.name}</h3>
                    <div class="rating-tag" title="Đánh giá: ${place.rating}">
                        <i class="fa-solid fa-star"></i> ${place.rating.toFixed(1)}
                    </div>
                </div>
                <div class="place-meta">
                    <span class="badge ${catInfo.class}">${place.category}</span>
                    ${place.tiktok_hot ? '<span class="badge tiktok-hot-badge"><i class="fa-brands fa-tiktok"></i> HOT</span>' : ''}
                </div>
                <p class="place-reason">${place.reason}</p>
                <div class="place-address">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>${place.address}</span>
                </div>
                <div class="place-footer">
                    <span class="price-range-label"><i class="fa-solid fa-coins"></i> ${place.price_range}</span>
                    <button class="btn-map" onclick="event.stopPropagation(); window.open('${place.maps_url}', '_blank')">
                        <i class="fa-solid fa-map-location-dot"></i> Bản đồ
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Event Listeners for Filters
    searchInput.addEventListener('input', renderRecommendations);
    tiktokCheckbox.addEventListener('change', renderRecommendations);
    sortSelect.addEventListener('change', renderRecommendations);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            renderRecommendations();
        });
    });

    // Render initial grid
    renderRecommendations();
}
