(async function() {
    // 1. INJECT STYLES
    // Creates a <style> block to format the popup window that appears at the end.
    const style = document.createElement("style");
    style.innerHTML = `
        #q-extractor-popup {
            position: fixed; top: 10%; left: 50%; transform: translateX(-50%);
            width: 400px; max-height: 70%; background: #fff; border: 1px solid #ccc;
            box-shadow: 0 4px 15px rgba(0,0,0,.3); z-index: 10000; padding: 20px;
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
        #q-extractor-copy { 
            background: #2e69ff; color: #fff; border: none; padding: 8px 15px; 
            border-radius: 4px; cursor: pointer; font-weight: bold; 
        }
    `;
    document.head.appendChild(style);

    // 2. UTILITY: SLEEP FUNCTION
    // A helper to pause execution so Quora has time to load new content.
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 3. FIND AND CLICK "VIEW ALL"
    // Searches for a button/span/div that says "View all" to open the contributors modal.
    let viewAllBtn = Array.from(document.querySelectorAll("div, span, button"))
        .find(el => el.textContent.trim() === "View all" && el.children.length === 0);

    if (!viewAllBtn) {
        return alert("Could not find 'View all'. Make sure the Contributors section is visible.");
    }
    viewAllBtn.click();

    // 4. FIND THE SCROLLABLE CONTAINER
    // Looks for the modal div that has an active scrollbar.
    let scrollContainer = null;
    for (let i = 0; i < 15; i++) {
        await sleep(500); // Wait for modal to pop up
        scrollContainer = Array.from(document.querySelectorAll("div")).find(el => {
            const css = window.getComputedStyle(el);
            return (css.overflowY === "auto" || css.overflow === "auto") && el.scrollHeight > el.clientHeight;
        });
        if (scrollContainer) break;
    }

    if (!scrollContainer) return alert("Scrolling list not found.");

    // 5. AUTOMATED SCROLLING
    // Scrolls to the bottom repeatedly to trigger "infinite load" until no more profiles appear.
    let lastHeight = 0;
    let retries = 0;
    while (retries < 3) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        // Random delay between 1.5s and 2.5s to mimic human behavior
        await sleep(1500 + Math.random() * 1000);

        if (scrollContainer.scrollHeight === lastHeight) {
            retries++;
            // Try nudging the scroll to trigger lazy loading
            scrollContainer.scrollTop -= 200;
            await sleep(500);
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        } else {
            lastHeight = scrollContainer.scrollHeight;
            retries = 0;
        }
    }

    // 6. EXTRACT PROFILE LINKS
    // Finds all links containing "/profile/" and uses a Set to ensure uniqueness.
    const profileLinks = [...new Set(
        Array.from(scrollContainer.querySelectorAll('a[href*="/profile/"]'))
        .map(el => el.href)
    )];

    // 7. SHOW RESULTS POPUP
    // Dynamically builds the UI with the results and a copy button.
    const popup = document.createElement("div");
    popup.id = "q-extractor-popup";
    popup.innerHTML = `
        <div id="q-extractor-header">
            <h3>Extracted (${profileLinks.length})</h3>
            <span id="q-extractor-close">✕</span>
        </div>
        <div id="q-extractor-output">${profileLinks.join("\n")}</div>
        <div id="q-extractor-footer">
            <button id="q-extractor-copy">Copy to Clipboard</button>
        </div>
    `;
    document.body.appendChild(popup);

    // 8. POPUP EVENT LISTENERS
    // Setup logic for closing the popup and copying the list.
    document.getElementById("q-extractor-close").onclick = () => popup.remove();
    document.getElementById("q-extractor-copy").onclick = async () => {
        try {
            await navigator.clipboard.writeText(profileLinks.join("\n"));
            const btn = document.getElementById("q-extractor-copy");
            btn.innerText = "Copied!";
            setTimeout(() => btn.innerText = "Copy to Clipboard", 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };
})();
