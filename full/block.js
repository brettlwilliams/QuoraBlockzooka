(function() {
    // 1. Locate the 'More' / Overflow menu button (three dots) 
    // Uses the specific Quora attribute 'puppeteer_test_overflow_menu'
    const specificButton = document.querySelector('button.puppeteer_test_overflow_menu[aria-haspopup="menu"]');

    if (specificButton) {
        // Open the dropdown menu
        specificButton.click();

        // 2. Wait 300ms for the dropdown menu to inject into the DOM and become visible
        setTimeout(() => {
            // Find all items within the newly opened popover menu
            const menuItems = document.querySelectorAll('.puppeteer_test_popover_item');
            
            // Look through the list of items to find the one labeled "Block"
            let blockOption = Array.from(menuItems).find(item => 
                item.textContent.trim() === 'Block' || 
                item.innerText.includes('Block')
            );

            if (blockOption) {
                // Click the "Block" option to trigger the confirmation modal
                blockOption.click();
                console.log('Initial Block option clicked.');

                // 3. Wait 400ms for the confirmation modal/popup to appear
                setTimeout(() => {
                    // Find the submit button in the confirmation modal
                    const confirmBlockBtn = document.querySelector('button.puppeteer_test_modal_submit');

                    // Double-check that this button is actually the "Block" confirmation
                    if (confirmBlockBtn && confirmBlockBtn.textContent.includes('Block')) {
                        confirmBlockBtn.click();
                        console.log('Final Block confirmation clicked.');
                    } else {
                        console.log('Confirmation Block button not found.');
                    }
                }, 400);

            } else {
                console.log('Block option not found in menu.');
            }
        }, 300);
        
    } else {
        console.log('Overflow menu button not found.');
    }
})();
