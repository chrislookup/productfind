document.getElementById('searchButton').addEventListener('click', () => {
    const searchText = document.getElementById('searchInput').value.trim();
    if (!searchText) {
        displayResult("Please enter a product code or description.");
        return;
    }

    // Use an alternative CORS proxy service to fetch the CSV data
    const csvUrl = 'https://www.dropbox.com/scl/fi/09z657jywgobq8uj4mzdc/lookup_summary.csv?rlkey=8pqn25qptu3fj7t48xflabndh&st=bom7dlvs&dl=1';
    const proxyUrl = 'https://corsproxy.io/?'; // Alternative CORS proxy

    fetch(proxyUrl + encodeURIComponent(csvUrl))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            console.log('CSV data fetched successfully');
            parseCSV(data, searchText);
        })
        .catch(error => {
            console.error('Error fetching the CSV file:', error);
            displayResult('Error fetching the CSV file: ' + error.message);
        });
});

function parseCSV(data, searchText) {
    console.log('Parsing CSV data...');
    const lines = data.split('\n');
    const results = [];
    
    for (let i = 1; i < lines.length; i++) { // Start from 1 to skip header
        const columns = lines[i].split(',');

        if (columns.length > 9) { // Ensure there are enough columns
            const productCode = columns[0].trim().toUpperCase();
            const productDescription = columns[1].trim();
            const stockQuantity = parseInt(columns[9].trim(), 10);
            
            if (productCode.includes(searchText.toUpperCase()) || productDescription.toLowerCase().includes(searchText.toLowerCase())) {
                results.push({
                    productCode,
                    productDescription,
                    stockQuantity
                });
            }
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
