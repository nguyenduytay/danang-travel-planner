const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'schedule.csv');
const outputPath = path.join(__dirname, 'data.js');

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
            // Optionally keep quotes or strip them. We strip them here.
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

try {
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split(/\r?\n/);
    
    const itinerary = [];
    const recommendations = [];
    
    let isItinerarySection = true;
    let itineraryHeaders = [];
    let recommendationHeaders = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const parsed = parseCSVLine(line);
        
        // Detect headers
        if (parsed[0] === 'date' && parsed[1] === 'time_slot') {
            itineraryHeaders = parsed;
            isItinerarySection = true;
            continue;
        }
        
        if (parsed[0] === 'name' && parsed[1] === 'category') {
            recommendationHeaders = parsed;
            isItinerarySection = false;
            continue;
        }
        
        if (isItinerarySection) {
            if (itineraryHeaders.length === 0) continue; // skip metadata
            const item = {};
            itineraryHeaders.forEach((header, index) => {
                let val = parsed[index] || '';
                if (header === 'cost_estimate') {
                    val = parseInt(val.replace(/[^0-9]/g, '')) || 0;
                }
                item[header] = val;
            });
            itinerary.push(item);
        } else {
            if (recommendationHeaders.length === 0) continue;
            const item = {};
            recommendationHeaders.forEach((header, index) => {
                let val = parsed[index] || '';
                if (header === 'rating') {
                    val = parseFloat(val) || 0;
                } else if (header === 'tiktok_hot') {
                    val = val.toLowerCase() === 'có' || val.toLowerCase() === 'yes';
                }
                item[header] = val;
            });
            recommendations.push(item);
        }
    }
    
    const outputContent = `// Auto-generated data from schedule.csv
const ITINERARY = ${JSON.stringify(itinerary, null, 2)};

const RECOMMENDATIONS = ${JSON.stringify(recommendations, null, 2)};
`;
    
    fs.writeFileSync(outputPath, outputContent, 'utf-8');
    console.log(`Successfully parsed CSV and wrote to data.js!`);
    console.log(`Itinerary items: ${itinerary.length}`);
    console.log(`Recommendation items: ${recommendations.length}`);
} catch (err) {
    console.error('Error parsing CSV:', err);
}
