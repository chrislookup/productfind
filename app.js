document.getElementById('searchButton').addEventListener('click', () => {
    const searchText = document.getElementById('searchInput').value.trim();
    if (!searchText) {
        displayResult("Please enter a product code or description.");
        return;
    }

    // ScraperAPI token and target URL
    const apiToken = '2ea395e306711d632864b194b55d8b8f'; // Your ScraperAPI key
    const targetUrl = 'https://www.dropbox.com/scl/fi/09z657jywgobq8uj4mzdc/lookup_summary.csv?rlkey=8pqn25qptu3fj7t48xflabndh&dl=1';
    const proxyUrl = `https://api.scraperapi.com/?api_key=${apiToken}&url=${encodeURIComponent(targetUrl)}`;

    // Debugging log: Print the full URL being fetched
    console.log(`Fetching CSV from: ${proxyUrl}`);

    fetch(proxyUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            console.log('Raw CSV data fetched successfully:', data);

            if (!data || data.trim() === '') {
                console.error('Error: CSV data is empty or not fetched properly.');
                displayResult('Error: CSV data is empty or not fetched properly.');
                return;
            }

            parseCSV(data, searchText);
        })
        .catch(error => {
            console.error('Error fetching the CSV file:', error);
            displayResult('Error fetching the CSV file: ' + error.message);
        });
});

function parseCSV(data, searchText) {
    console.log('Parsing CSV data...');
    
    // Normalize line breaks and trim any extraneous whitespace
    const normalizedData = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    const lines = normalizedData.split('\n');
    const results = [];

    console.log(`Total lines in CSV after normalization: ${lines.length}`); // Debugging log

    for (let i = 1; i < lines.length; i++) { // Start from 1 to skip header
        const columns = lines[i].split(',');

        console.log(`Line ${i}: ${lines[i]}`); // Log the full line to debug line breaks

        if (columns.length > 9) { // Ensure there are enough columns
            const productCode = columns[0].trim().toUpperCase();
            const productDescription = columns[1].trim();
            const stockQuantity = parseInt(columns[9].trim(), 10);

            console.log(`Processing line ${i}:`, { productCode, productDescription, stockQuantity });

            if (
                productCode.includes(searchText.toUpperCase()) ||
                productDescription.toLowerCase().includes(searchText.toLowerCase())
            ) {
                results.push({
                    productCode,
                    productDescription,
                    stockQuantity
                });
            }
        } else {
            console.log(`Skipping line ${i} due to insufficient columns or malformed data`); // Debugging log
        }
    }

    displayResults(results);
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.textContent = 'No matching products found.';
        return;
    }

    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.innerHTML = `<strong>Code:</strong> ${result.productCode}, <strong>Description:</strong> ${result.productDescription}, <strong>Stock:</strong> ${result.stockQuantity}`;
        resultsDiv.appendChild(resultItem);
    });
}

function displayResult(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p>${message}</p>`;
}
