document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // V4 API CONFIGURATION
    // =========================================================
    // The previous logic has been replaced with the modern API V4 fetch
    
    // ✅ Inserted your API Key
    const API_KEY = 'AIzaSyBRM0zxx-pH4lpFcZRfBvVOq9NbpozH3uk'; 
    
    // Your confirmed Sheet ID
    const SHEET_ID = '1oY_cs8JkXfKssTXqGo-RrKEO5EGpnas44fl91Gx5HCY';
    
    // Assuming your announcements are on a sheet named 'Announcements'
    // and data starts from row 2 (header in row 1)
    const RANGE = 'Announcements!A2:D'; 

    const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;


    // =========================================================
    // 1. DYNAMIC ANNOUNCEMENT LOADER (using API V4)
    // =========================================================

    function loadAllAnnouncementsV4() {
        
        const container = document.getElementById('announcement-list-container');
        
        // This map correctly connects the Sheet value to the Tailwind border class
        const categoryMap = {
            'Red': 'border-l-red-500',
            'Blue': 'border-l-blue-500',
            'Green': 'border-l-green-500',
            'Default': 'border-l-gray-400' 
        };

        // Updated loading message to reflect V4 API usage
        container.innerHTML = '<p class="text-center text-lg text-gray-500 py-10">Loading announcements using Google Sheets API V4...</p>';

        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    // Handles API errors (e.g., wrong key, permissions)
                    return response.json().then(errorData => {
                        console.error('API Error Response:', errorData);
                        throw new Error(errorData.error.message || 'Network response was not ok');
                    });
                }
                return response.json();
            })
            .then(data => {
                const entries = data.values; // V4 returns data in 'values' array
                container.innerHTML = ''; // Clear the loading message

                if (!entries || entries.length === 0) {
                    container.innerHTML = '<p class="text-center text-gray-500 py-10">No announcements posted in the sheet range.</p>';
                    return;
                }

                entries.forEach(row => {
                    // Data is mapped by column index: [0]=Title, [1]=Date, [2]=Details, [3]=Category
                    const title = row[0] || 'No Title';
                    const date = row[1] || 'N/A';
                    const details = row[2] || '';
                    const category = row[3] || 'Default';
                    
                    // 🔥 This line gets the correct CSS class (Red, Blue, Green, or Default border)
                    const categoryClass = categoryMap[category] || categoryMap['Default'];
                    
                    const cardHTML = `
                        <div class="announcement-card ${categoryClass}">
                            <div class="flex justify-between items-start">
                                <h2 class="text-2xl font-bold primary-text mb-1">${title}</h2>
                                ${category === 'Red' ? '<span class="text-xs font-semibold text-white px-3 py-1 rounded-full bg-red-500">URGENT</span>' : ''}
                            </div>
                            <p class="text-gray-500 text-sm mb-3">Posted: ${date}</p>
                            <p class="text-gray-700">${details}</p>
                        </div>
                    `;
                    container.insertAdjacentHTML('beforeend', cardHTML);
                });
            })
            .catch(error => {
                console.error('Fatal Fetch Error:', error);
                container.innerHTML = `<p class="text-center text-red-600 font-semibold py-10">
                    Data Load Error: Please check the API Key, Sheet Sharing, and the tab name in the script.
                </p>`;
            });
    }
    
    // =========================================================
    // 2. INITIALIZATION CALLS
    // =========================================================
    
    // ✅ Call the new V4 function
    loadAllAnnouncementsV4(); 

    // ... (Your existing dropdown/mobile menu logic will follow this block)
});