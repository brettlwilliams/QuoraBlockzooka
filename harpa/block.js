/**
 * HARPA AI Custom JS Step: Quora Profile Blocker
 * This script automates the 'Block' flow on a Quora profile page.
 */

const executeBlock = async () => {
    // 1. Locate the 'Overflow' menu button (the three dots)
    const specificButton = document.querySelector('button.puppeteer_test_overflow_menu[aria-haspopup="menu"]');

    if (!specificButton) {
        console.error('Overflow menu button not found. Ensure you are on a Quora profile page.');
        return;
    }

    // Open the menu
    specificButton.click();

    // 2. Wait for the popover menu to appear (using a Promise for cleaner HARPA execution)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find all menu items in the dropdown
    const menuItems = document.querySelectorAll('.puppeteer_test_popover_item');
    const blockOption = Array.from(menuItems).find(item => 
        item.textContent.trim() === 'Block' || 
        item.innerText.includes('Block')
    );

    if (blockOption) {
        blockOption.click();
        console.log('Block option selected.');

        // 3. Wait for the confirmation modal to render
        await new Promise(resolve => setTimeout(resolve, 500));

        // Locate and click the final 'Block' confirmation button
        const confirmBlockBtn = document.querySelector('button.puppeteer_test_modal_submit');

        if (confirmBlockBtn && confirmBlockBtn.textContent.includes('Block')) {
            confirmBlockBtn.click();
            console.log('User successfully blocked via HARPA.');
        } else {
            console.warn('Confirmation button not found in modal.');
        }
    } else {
        console.warn('Block option not found in the dropdown menu.');
    }
};

// Execute the function
executeBlock();
