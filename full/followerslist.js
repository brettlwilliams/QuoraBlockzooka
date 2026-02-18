(async function() {
    // --- 1. UI STYLING ---
    // Create a style element to make the popup look clean and modern
    const style = document.createElement('style');
    style.innerHTML = `
        #q-extractor-popup {
            position: fixed; top: 10%; left: 50%; transform: translateX(-50%);
            width: 400px; max-height: 70%; background: #fff; border: 1px solid #ccc;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 10000; padding: 20px;
            font-family: sans-serif; border-radius: 8px; display: flex; flex-direction: column;
        }
        #q-extractor-header { display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center; }
        #q-extractor-header h3 { margin: 0; font-size: 16px; color: #333; }
        #q-extractor-close { cursor: pointer; font-weight: bold; color: #999; }
        #q-extractor-output { 
            background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-y: auto; 
            flex-grow: 1; font-family: monospace; font-size: 12px; white-space: pre-wrap; border: 1px solid #ddd; 
        }
        #q-extractor-footer { margin-top: 15px; display: flex; gap: 10px; }
        #q-extractor-copy { background: #2e69ff; color: #fff; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold; }
        #q-extractor-copy:active { background: #1a4fcc; }
    `;
    document.head.appendChild(style);

    // --- 2. POPUP RENDERER ---
    // Function to display the final list of URLs to the user
    function showPopup(urls) {
        const container = document.createElement('div');
        container.id = 'q-extractor-popup';
        container.innerHTML = `
            <div id="q-extractor-header">
                <h3>Extracted Profiles (${urls.length})</h3>
                <span id="q-extractor-close">✕</span>
            </div>
            <div id="q-extractor-output">${urls.join('\n')}</div>
            <div id="q-extractor-footer">
                <button id="q-extractor-copy">Copy to Clipboard</button>
            </div>
        `;
        document.body.appendChild(container);

        // Close button logic
        document.getElementById('q-extractor-close').onclick = () => container.remove();

        // Copy button logic with visual feedback ("Copied!")
        document.getElementById('q-extractor-copy').onclick = () => {
            navigator.clipboard.writeText(urls.join('\n'));
            const btn = document.getElementById('q-extractor-copy');
            const originalText = btn.innerText;
            btn.innerText = 'Copied!';
            setTimeout(() => btn.innerText = originalText, 2000);
        };
    }

    // --- 3. TRIGGER FOLLOWERS MODAL ---
    // Find Quora's "Followers" button by looking for text and numbers
    const allClickWrappers = Array.from(document.querySelectorAll('div.q-click-wrapper'));
    const followersBtn = allClickWrappers.find(el => 
        el.textContent.toLowerCase().includes('followers') && /\d+/.test(el.textContent)
    );

    if (!followersBtn) return alert("Could not find the 'Followers' button. Are you on a profile page?");
    followersBtn.click();

    // --- 4. FIND & WAIT FOR SCROLLBOX ---
    // Quora loads the list in a specific modal; we need to find that container
    let scrollContainer = null;
    for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 500)); // Wait 0.5s intervals
        scrollContainer = document.querySelector('div[class*="ScrollBox___StyledBox"]');
        if (scrollContainer) break;
    }

    if (!scrollContainer) return alert("Scroll container not found. The list didn't load in time.");

    // --- 5. AUTO-SCROLL LOGIC ---
    // Scroll to the bottom repeatedly until no new content loads
    let lastHeight = scrollContainer.scrollHeight;
    let stagnantCount = 0;

    while (stagnantCount < 5) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        await new Promise(r => setTimeout(r, 2000)); // Wait for lazy loading

        if (scrollContainer.scrollHeight === lastHeight) {
            // If height hasn't changed, try nudging it to trigger a load
            stagnantCount++;
            scrollContainer.scrollBy(0, -300);
            await new Promise(r => setTimeout(r, 200));
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        } else {
            lastHeight = scrollContainer.scrollHeight;
            stagnantCount = 0; // Reset counter if we successfully loaded more
        }
    }

    // --- 6. EXTRACTION ---
    // Find all profile links, extract the URLs, and remove duplicates using Set
    const links = Array.from(scrollContainer.querySelectorAll('a[href*="/profile/"]'));
    const profileURLs = [...new Set(links.map(a => a.href))];

    // Show the results!
    showPopup(profileURLs);
})();
