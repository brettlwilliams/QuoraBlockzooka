javascript:(async function() {
    /* --- SECTION 1: STYLING --- */
    // Create a style element to house the CSS for the popup UI
    const style = document.createElement('style');
    style.innerHTML = `
        #q-extractor-popup {
            position: fixed; top: 10%; left: 50%; transform: translateX(-50%);
            width: 400px; max-height: 70%; background: #fff; border: 1px solid #ccc;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 10000; padding: 20px;
            font-family: sans-serif; border-radius: 8px; display: flex; flex-direction: column
        }
        #q-extractor-header { display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center }
        #q-extractor-header h3 { margin: 0; font-size: 16px; color: #333 }
        #q-extractor-close { cursor: pointer; font-weight: bold; color: #999 }
        #q-extractor-output {
            background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-y: auto;
            flex-grow: 1; font-family: monospace; font-size: 12px; white-space: pre-wrap; border: 1px solid #ddd
        }
        #q-extractor-footer { margin-top: 15px; display: flex; gap: 10px }
        #q-extractor-copy {
            background: #2e69ff; color: #fff; border: none; padding: 8px 15px;
            border-radius: 4px; cursor: pointer; font-weight: bold
        }
        #q-extractor-copy:active { background: #1a4fcc }
    `;
    document.head.appendChild(style);

    /* --- SECTION 2: UI RENDERING FUNCTION --- */
    // Function to build and display the results modal
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

        // UI Event Listeners
        document.getElementById('q-extractor-close').onclick = () => container.remove();
        document.getElementById('q-extractor-copy').onclick = () => {
            navigator.clipboard.writeText(urls.join('\n'));
            const btn = document.getElementById('q-extractor-copy');
            btn.innerText = 'Copied!';
            setTimeout(() => btn.innerText = 'Copy to Clipboard', 2000);
        }
    }

    /* --- SECTION 3: NAVIGATION --- */
    // Find the 'Followers' button by searching for text content and patterns
    const followersBtn = Array.from(document.querySelectorAll('div.q-click-wrapper'))
        .find(el => el.textContent.toLowerCase().includes('followers') && /\d+/.test(el.textContent));

    if (!followersBtn) return alert("Could not find the 'Followers' button.");
    followersBtn.click(); // Open the followers list modal

    /* --- SECTION 4: INITIALIZING SCROLL CONTAINER --- */
    // Wait for the Quora ScrollBox to appear in the DOM (polling up to 10 seconds)
    let scrollContainer = null;
    for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 500));
        scrollContainer = document.querySelector('div[class*="ScrollBox___StyledBox"]');
        if (scrollContainer) break;
    }

    if (!scrollContainer) return alert("Scroll container not found.");

    /* --- SECTION 5: AUTO-SCROLL LOGIC --- */
    // Logic to scroll to the bottom of the list until no new items load
    let lastHeight = scrollContainer.scrollHeight;
    let stagnantCount = 0;

    while (stagnantCount < 5) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        await new Promise(r => setTimeout(r, 2000)); // Wait for lazy loading

        if (scrollContainer.scrollHeight === lastHeight) {
            stagnantCount++;
            // Small "nudge" scroll to trigger Quora's scroll listeners if stuck
            scrollContainer.scrollBy(0, -300);
            await new Promise(r => setTimeout(r, 200));
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        } else {
            lastHeight = scrollContainer.scrollHeight;
            stagnantCount = 0; // Reset counter if new content loaded
        }
    }

    /* --- SECTION 6: DATA EXTRACTION --- */
    // Identify individual profile rows and filter for those we aren't following yet
    const profileRows = scrollContainer.querySelectorAll('.q-flex.qu-alignItems--center.qu-py--small');
    const filteredUrls = [];

    profileRows.forEach(row => {
        const button = row.querySelector('button');
        const link = row.querySelector('a[href*="/profile/"]');
        
        // Only grab profile links where the button says "Follow" (ignores "Following" or "Requested")
        if (button && button.innerText.trim() === "Follow" && link) {
            filteredUrls.push(link.href);
        }
    });

    // Remove duplicates and launch the popup
    const uniqueUrls = [...new Set(filteredUrls)];
    showPopup(uniqueUrls);
})();
