const { chromium } = require('playwright');
const { wrap, configure } = require('agentql');

// Configurar AgentQL con tu API key
configure({ apiKey: 'lIsq-ElH4M8tRhQqvssVkkDN6--xy3lFAPp5KIeCtIWAgOapcIRp2g' });

async function searchHotels(input) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await wrap(await context.newPage());

    try {
        console.log('1. Iniciando búsqueda en Booking...');
        
        // Construir URL con filtros básicos
        const searchURL = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(input.destino)}&checkin_year=${input.fecha_salida.split('-')[0]}&checkin_month=${input.fecha_salida.split('-')[1]}&checkin_monthday=${input.fecha_salida.split('-')[2]}&checkout_year=${input.fecha_regreso.split('-')[0]}&checkout_month=${input.fecha_regreso.split('-')[1]}&checkout_monthday=${input.fecha_regreso.split('-')[2]}&group_adults=${input.pasajeros}&nflt=class%3D4%3Bclass%3D5%3Bclass%3D3%3Breview_score%3D70`;
        
        await page.goto(searchURL);
        await page.waitForLoadState('networkidle');
        
        // Aceptar cookies si aparecen
        try {
            await page.click('button[id="onetrust-accept-btn-handler"]', { timeout: 5000 });
        } catch (e) {
            console.log('No se encontró diálogo de cookies');
        }

        console.log('2. Esperando resultados...');
        await page.waitForSelector('[data-testid="property-card"]');

        console.log('3. Extrayendo datos...');
        const results = await page.evaluate(() => {
            const hotels = Array.from(document.querySelectorAll('[data-testid="property-card"]'));
            return hotels.map(hotel => {
                const titleEl = hotel.querySelector('[data-testid="title"]');
                const priceEl = hotel.querySelector('[data-testid="price-and-discounted-price"]');
                const ratingEl = hotel.querySelector('[data-testid="review-score"]');
                const linkEl = hotel.querySelector('a[data-testid="title-link"]');
                const addressEl = hotel.querySelector('[data-testid="address"]');
                const amenitiesEl = hotel.querySelector('[data-testid="facility-list"]');

                const rating = ratingEl ? ratingEl.innerText.split('\n') : ['N/A'];
                const score = parseFloat(rating[0].replace('Scored ', '')) || 0;
                const reviews = rating[rating.length - 1] || 'No reviews';
                const price = priceEl ? parseFloat(priceEl.innerText.replace(/[^0-9,.]/g, '').replace(',', '.')) : 0;
                const amenities = amenitiesEl ? Array.from(amenitiesEl.querySelectorAll('span')).map(span => span.innerText) : [];

                return {
                    hotel_name: titleEl ? titleEl.innerText.trim() : 'N/A',
                    price: priceEl ? priceEl.innerText.replace(/[^0-9€,.]/g, '').trim() : 'N/A',
                    price_value: price,
                    score: score,
                    reviews: reviews,
                    location: addressEl ? addressEl.innerText.trim() : 'N/A',
                    hotel_link: linkEl ? linkEl.href.split('?')[0] : 'N/A',
                    amenities: amenities
                };
            })
            .filter(hotel => 
                hotel.hotel_name !== 'N/A' && 
                hotel.price !== 'N/A' && 
                hotel.score >= 7
            );
        });

        console.log(`Encontrados ${results.length} hoteles`);
        return {
            success: true,
            summary: {
                total_results: results.length,
                average_price: `€${Math.round(results.reduce((sum, hotel) => sum + hotel.price_value, 0) / results.length)}`,
                best_rated: results.sort((a, b) => b.score - a.score)[0].hotel_name,
                search_dates: {
                    check_in: input.fecha_salida,
                    check_out: input.fecha_regreso
                }
            },
            data: results // Devolver todos los resultados filtrados
        };

    } catch (error) {
        console.error('Error detallado:', error);
        return {
            success: false,
            error: error.message
        };
    } finally {
        await browser.close();
    }
}

module.exports = { searchHotels }; 