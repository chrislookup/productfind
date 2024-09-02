function parseCSV(data, searchText) {
    console.log('Parsing CSV data...');
    const lines = data.split('\n');
    const results = [];

    console.log(`Total lines in CSV: ${lines.length}`); // Debugging log

    for (let i = 1; i < lines.length; i++) { // Start from 1 to skip header
        const columns = lines[i].split(',');

        if (columns.length > 9) { // Ensure there are enough columns
            const productCode = columns[0].trim().toUpperCase();
            const productDescription = columns[1].trim();
            const stockQuantity = parseInt(columns[9].trim(), 10);

            console.log(`Processing line ${i}:`, { productCode, productDescription, stockQuantity }); // Debugging log

            if (productCode.includes(searchText.toUpperCase()) || productDescription.toLowerCase().includes(searchText.toLowerCase())) {
                results.push({
                    productCode,
                    productDescription,
                    stockQuantity
                });
            }
        } else {
            console.log(`Skipping line ${i} due to insufficient columns`); // Debugging log
        }
    }

    displayResults(results);
}
