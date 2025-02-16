import { chromium } from 'playwright';
import { wrap, configure } from 'agentql';

configure({ apiKey: 'lIsq-ElH4M8tRhQqvssVkkDN6--xy3lFAPp5KIeCtIWAgOapcIRp2g' });

async function searchFlights(input) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await wrap(await context.newPage());

    try {
        // Código de búsqueda de vuelos...
        // [Aquí va todo el código de flight_search.js]
    } finally {
        await browser.close();
    }
}

async function searchHotels(input) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await wrap(await context.newPage());

    try {
        // Código de búsqueda de hoteles...
        // [Aquí va todo el código de booking_search_1.0.js]
    } finally {
        await browser.close();
    }
}

// Función principal que hace todo
export async function searchAll(input) {
    try {
        const [flightResults, hotelResults] = await Promise.all([
            searchFlights(input),
            searchHotels(input)
        ]);

        return {
            success: flightResults.success || hotelResults.success,
            flights: flightResults.success ? flightResults.data : [],
            hotels: hotelResults.success ? hotelResults.data : [],
            errors: {
                flights: flightResults.error,
                hotels: hotelResults.error
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
} 