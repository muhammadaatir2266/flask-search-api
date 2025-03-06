// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const statusElement = document.getElementById('status');
    const resultsElement = document.getElementById('results');
    
    // Add event listeners
    searchButton.addEventListener('click', searchArticles);
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchArticles();
        }
    });
    
    // Search function
    function searchArticles() {
        const keyword = searchInput.value.trim();
        
        if (!keyword) {
            statusElement.textContent = "Please enter a keyword to search.";
            resultsElement.textContent = "";
            return;
        }
        
        statusElement.textContent = "Searching...";
        
        fetch('/search?keyword=' + encodeURIComponent(keyword))
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { 
                        throw new Error(err.message || "Error searching for articles");
                    });
                }
                return response.json();
            })
            .then(data => {
                statusElement.textContent = `Found ${data.length} article(s) matching "${keyword}"`;
                resultsElement.textContent = JSON.stringify(data, null, 4);
            })
            .catch(error => {
                statusElement.textContent = error.message;
                resultsElement.textContent = "";
                console.error('Error:', error);
            });
    }
});