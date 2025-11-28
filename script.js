document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // 1. DYNAMIC ANNOUNCEMENT LOADER
    //    Fetches content from announcements.txt and injects it.
    // =========================================================

    function loadAnnouncements() {
        // Target area where announcements will be injected (from announcements.html)
        const announcementsList = document.getElementById('announcements-list');
        
        // Safety check: only run this function if the target div exists
        if (!announcementsList) {
            return;
        }

        // Display loading message
        announcementsList.innerHTML = '<p class="text-center text-lg text-gray-500">Loading announcements...</p>';

        fetch('announcements.txt')
            .then(response => {
                // Check for HTTP errors (e.g., 404 Not Found)
                if (!response.ok) {
                    throw new Error(`HTTP Error: Failed to load announcements. Status: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(plainText => {
                
                // Clear the loading message
                announcementsList.innerHTML = ''; 

                // Split the text file content using the triple hyphen separator
                const announcements = plainText
                    .split('---')
                    .map(item => item.trim())
                    .filter(item => item.length > 0);

                if (announcements.length === 0) {
                    announcementsList.innerHTML = '<p class="text-center text-lg text-gray-600">There are no active announcements at this time. Please check back later.</p>';
                    return;
                }

                // Generate HTML cards for each announcement
                announcements.forEach((announcementText) => {
                    const card = document.createElement('div');
                    card.className = 'announcement-card';
                    
                    // Convert newlines (\n) to <br> tags for correct display in HTML
                    const formattedText = announcementText.replace(/\n/g, '<br>');
                    
                    const cardHTML = `<p>${formattedText}</p>`;
                    
                    card.innerHTML = cardHTML;
                    announcementsList.appendChild(card);
                });
            })
            .catch(error => {
                // Display a detailed error message directly on the page for debugging
                console.error('Error loading announcements:', error);
                
                announcementsList.innerHTML = `
                    <div style="background-color: #ffe0e0; padding: 20px; border: 1px solid #f00; border-radius: 8px; text-align: center;">
                        <h3 style="color: #c00; margin-top: 0;">⚠️ Content Loading Error</h3>
                        <p>The system failed to load content from <strong>announcements.txt</strong>.</p>
                        <p><strong>Common Cause:</strong> This typically happens due to browser security restrictions when viewing the page from a local file (using <code>file://</code>).</p>
                        <p><strong>Actual Error:</strong> ${error.message}</p>
                        <p><strong>Solution:</strong> Please use a local web server (like VS Code's "Live Server" extension) to view the site using an <code>http://</code> address.</p>
                    </div>
                `;
            });
    }
    
    // =========================================================
    // 2. INITIALIZATION CALLS
    // =========================================================
    
    // Start the loading process for announcements when the page loads
    loadAnnouncements();


    // NOTE: Future features like member login logic, event filters, 
    // etc., will be added here.
});