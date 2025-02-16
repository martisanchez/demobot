const express = require('express');
const { searchHotels } = require('./booking_search_1.0');
const { searchFlights } = require('../flight_search');

const app = express();
app.use(express.json());

app.post('/search-packages', async (req, res) => {
    try {
        const input = req.body;
        // ... resto de la lógica de búsqueda ...
        const results = // ... resultados actuales ...
        res.json(results);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 