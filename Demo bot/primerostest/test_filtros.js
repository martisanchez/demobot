const { searchHotels } = require('./booking_search_1.0');
const { searchFlights } = require('../flight_search');

async function runTest() {
    const input = {
        origen: 'MAD',
        destino: 'MIA',
        fecha_salida: '2025-03-01',
        fecha_regreso: '2025-03-17',
        pasajeros: '2'
    };

    console.log('Iniciando búsqueda...');
    
    const [hotelsResult, flightsResult] = await Promise.all([
        searchHotels(input),
        searchFlights(input)
    ]);

    console.log('Resultados:', {
        hoteles: {
            total: hotelsResult.data.length,
            mejor_puntuado: hotelsResult.summary.best_rated
        },
        vuelos: {
            total: flightsResult.data.length,
            mejor_precio: flightsResult.data[0].price
        }
    });

    // Guardar resultados completos para el agente
    return {
        hoteles: hotelsResult.data,
        vuelos: flightsResult.data
    };
}

runTest(); 