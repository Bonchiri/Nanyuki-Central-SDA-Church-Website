document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // V4 API CONFIGURATION (NO CHANGES HERE)
    // =========================================================
    // This logic fetches announcement data directly from Google Sheets API V4.
    // NOTE: This API Key should be restricted to prevent unauthorized use.
    
    const API_KEY = 'AIzaSyBRM0zxx-pH4lpFcZRfBvVOq9NbpozH3uk'; 
    const SHEET_ID = '1oY_cs8JkXfKssTXqGo-RrKEO5EGpnas44fl91Gx5HCY';
    
    // Assuming announcements are on a sheet named 'Announcements' and data starts from row 2
    // Columns: A=Title, B=Date, C=Details, D=Category
    const RANGE = 'Announcements!A2:D'; 

    const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;


    // =========================================================
    // 1. DYNAMIC ANNOUNCEMENT LOADER (NO CHANGES HERE)
    // =========================================================

    /**
     * Fetches announcement data from Google Sheets API V4 and renders them to the DOM.
     */
    function loadAllAnnouncementsV4() {
        
        const container = document.getElementById('announcement-list-container');
        
        // Maps the text Category from the sheet (Col D) to a Tailwind CSS border class
        const categoryMap = {
            'Red': 'border-l-red-500',
            'Blue': 'border-l-blue-500',
            'Green': 'border-l-green-500',
            'Default': 'border-l-gray-400' 
        };

        // Show a loading state
        if (container) {
            container.innerHTML = '<p class="text-center text-lg text-gray-500 py-10">Loading announcements using Google Sheets API V4...</p>';
        } else {
            // Early exit if the container doesn't exist on the current page (like about.html)
            return; 
        }

        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    // Handle API errors (e.g., wrong key, sheet not public)
                    return response.json().then(errorData => {
                        console.error('API Error Response:', errorData);
                        // Using 'new Error' instead of 'new new Error'
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
                    // Data mapping: [0]=Title, [1]=Date, [2]=Details, [3]=Category
                    const title = row[0] || 'No Title';
                    const date = row[1] || 'N/A';
                    const details = row[2] || '';
                    const category = row[3] || 'Default';
                    
                    // Get the correct border class
                    const categoryClass = categoryMap[category] || categoryMap['Default'];
                    
                    const cardHTML = `
                        <div class="announcement-card bg-white p-6 mb-4 rounded-lg shadow-md border-l-4 ${categoryClass}">
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
                    Data Load Error: ${error.message}. Please check the API Key, Sheet Sharing, and the tab name in the script.
                </p>`;
            });
    }
    
    // =========================================================
    // 2. NAVIGATION LOGIC (Dropdown and Mobile Menu)
    // =========================================================

    // Desktop Dropdown Logic (NO CHANGES HERE)
    const dropdownBtn = document.getElementById('community-dropdown-btn');
    const dropdownMenu = document.getElementById('community-dropdown-menu');
    const dropdownIcon = dropdownBtn ? dropdownBtn.querySelector('i[data-lucide="chevron-down"]') : null;

    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', () => {
            const isExpanded = dropdownBtn.getAttribute('aria-expanded') === 'true';
            dropdownBtn.setAttribute('aria-expanded', !isExpanded);
            dropdownMenu.classList.toggle('hidden');

            if (dropdownIcon) {
                dropdownIcon.classList.toggle('rotate-180', !isExpanded);
            }
        });

        document.addEventListener('click', (event) => {
            if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownBtn.setAttribute('aria-expanded', 'false');
                dropdownMenu.classList.add('hidden');
                if (dropdownIcon) {
                    dropdownIcon.classList.remove('rotate-180');
                }
            }
        });
    }


    // 🆕 NEW Mobile Dropdown Logic
    // Use the mobile-toggle button (the hamburger icon) to open the mobile-dropdown element
    const mobileDropdownBtn = document.querySelector('.mobile-toggle'); // The button to click
    const mobileDropdown = document.getElementById('mobile-dropdown'); // The menu to show/hide

    if (mobileDropdownBtn && mobileDropdown) {
        
        mobileDropdownBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents the document click listener from firing immediately
            mobileDropdown.classList.toggle('hidden');
        });

        // Close the menu if the user clicks anywhere else on the screen (outside the button/menu)
        document.addEventListener('click', (event) => {
            if (!mobileDropdown.contains(event.target) && !mobileDropdownBtn.contains(event.target)) {
                mobileDropdown.classList.add('hidden');
            }
        });
    }


    // =========================================================
    // 3. INITIALIZATION CALLS (NO CHANGES HERE)
    // =========================================================
    
    // Only call the announcements loader if we are on the page where the container exists
    if (document.getElementById('announcement-list-container')) {
        loadAllAnnouncementsV4();
    }
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
});