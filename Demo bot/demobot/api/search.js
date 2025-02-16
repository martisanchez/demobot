import { searchFlights } from '../services/flight_search.js';
import { searchHotels } from '../services/booking_search_1.0.js';

export async function searchPackages(input) {
    try {
        console.log('Iniciando búsqueda de paquetes...');
        
        const [flightResults, hotelResults] = await Promise.all([
            searchFlights(input).catch(e => ({ success: false, error: e.message })),
            searchHotels(input).catch(e => ({ success: false, error: e.message }))
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
        console.error('Error in searchPackages:', error);
        return {
            success: false,
            error: error.message
        };
    }
}