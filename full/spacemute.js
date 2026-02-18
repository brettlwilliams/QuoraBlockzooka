(function() {
    // 1. Check if we are actually on a Quora Space subdomain
    const hostname = window.location.hostname;
    const isQuora = hostname.includes('.quora.com');
    const isMainQuora = hostname === 'www.quora.com' || hostname === 'quora.com';

    // If it's not a Quora subdomain (like 'space-name.quora.com'), stop execution
    if (!(isQuora && !isMainQuora)) {
        alert('Only works on Quora Space subdomains.');
        return;
    }

    // 2. Helper function to find a button based on its text content
    const findButtonByText = (text) => {
        return Array.from(document.querySelectorAll('button'))
            .find(btn => btn.textContent.trim().includes(text));
    };

    // 3. Locate the "More" / Overflow menu button (three dots)
    // Quora uses specific classes like 'puppeteer_test_overflow_menu' for their automated testing
    const menuButton = document.querySelector('button.puppeteer_test_overflow_menu[aria-haspopup="menu"]');

    if (menuButton) {
        // Open the menu
        menuButton.click();

        // 4. Wait for the popover menu to appear in the DOM
        setTimeout(() => {
            const menuItems = document.querySelectorAll('.puppeteer_test_popover_item');
            
            // Find the "Mute" option within the list of menu items
            let muteOption = Array.from(menuItems).find(item => item.textContent.includes('Mute'));

            if (muteOption) {
                muteOption.click();

                // 5. Wait for the confirmation dialog to appear
                setTimeout(() => {
                    // Find either the "Confirm" or the final "Mute" button in the modal
                    const confirmButton = findButtonByText('Confirm') || findButtonByText('Mute');
                    
                    if (confirmButton) {
                        confirmButton.click();
                    }
                }, 500); // 500ms delay for the confirmation modal
            }
        }, 400); // 400ms delay for the initial menu animation
    }
})();
