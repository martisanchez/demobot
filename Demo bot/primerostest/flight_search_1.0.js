// Construir URL con filtros básicos
const searchURL = `https://www.google.com/travel/flights?q=Flights%20to%20${input.destino}%20from%20${input.origen}%20on%20${input.fecha_salida}%20through%20${input.fecha_regreso}&tfs=CAEQARoRCgoyMDI1LTAzLTAxGgJNSUEaEQoKMjAyNS0wMy0xNxoCTUFEcAGCAQsI____________AUABSAGYAQE&curr=EUR&hl=es&maxns=1`;
// Agregamos: máximo 1 escala (maxns=1) 

        const flights = await page.evaluate(() => {
            const flightElements = Array.from(document.querySelectorAll('div'))
                .filter(div => {
                    const text = div.innerText;
                    return text.includes('€') && 
                           text.includes('hr') && 
                           text.includes('MAD') && 
                           text.includes('MIA');
                });

            return flightElements.map(item => {
                const text = item.innerText;
                const lines = text.split('\n');
                
                // Extraer duración en minutos para filtrar
                const durationText = lines.find(line => line.includes('hr')) || '';
                const [hours, minutes] = durationText.match(/(\d+)\s*hr\s*(\d+)\s*min/)?.slice(1) || [0, 0];
                const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);

                const price = lines.find(line => line.includes('€'))?.replace('from ', '') || 'N/A';
                const airline = lines.find(line => 
                    line.includes('United') || 
                    line.includes('Iberia') || 
                    line.includes('Air Europa') ||
                    line.includes('American')
                )?.replace(/([A-Z])/g, ' $1').trim() || 'N/A';

                return {
                    price,
                    duration: durationText,
                    departure: lines.find(line => line.includes(':')) || 'N/A',
                    airline,
                    total_minutes: totalMinutes,
                    stops: text.includes('Nonstop') ? 0 : 1,
                    url: `https://www.google.com/travel/flights/booking?${new URLSearchParams({
                        flt: `${airline.split(' ')[0]}.MAD.MIA.${lines.find(l => l.includes(':'))?.split(' ')[0]}`
                    }).toString()}`
                };
            })
            .filter(flight => 
                flight.price !== 'N/A' && 
                flight.total_minutes <= 24 * 60 // Máximo 24 horas
            )
            .sort((a, b) => a.total_minutes - b.total_minutes); // Ordenar por duración
        });

        return {
            success: true,
            data: flights // Devolver todos los vuelos válidos
        }; 