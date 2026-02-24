javascript: (async function() {
    /* --- 1. UI STYLING --- */
    /* Create and inject a style element to format the popup interface */
    const style = document.createElement("style");
    style.innerHTML = `
        #q-extractor-popup {
            position: fixed;
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            width: 400px;
            max-height: 70%;
            background: #fff;
            border: 1px solid #ccc;
            box-shadow: 0 4px 15px rgba(0,0,0,.3);
            z-index: 10000;
            padding: 20px;
            font-family: sans-serif;
            border-radius: 8px;
            display: flex;
            flex-direction: column
        }
        #q-extractor-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            align-items: center
        }
        #q-extractor-header h3 {
            margin: 0;
            font-size: 16px;
            color: #333
        }
        #q-extractor-close {
            cursor: pointer;
            font-weight: bold;
            color: #999
        }
        #q-extractor-output {
            background: #f4f4f4;
            padding: 10px;
            border-radius: 4px;
            overflow-y: auto;
            flex-grow: 1;
            font-family: monospace;
            font-size: 12px;
            white-space: pre-wrap;
            border: 1px solid #ddd
        }
        #q-extractor-footer {
            margin-top: 15px;
            display: flex;
            gap: 10px
        }
        #q-extractor-copy {
            background: #2e69ff;
            color: #fff;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold
        }
    `;
    document.head.appendChild(style);

    /* --- 2. UTILITY FUNCTIONS --- */
    /* Simple sleep/delay function using Promises */
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    /* --- 3. TRIGGER LIST --- */
    /* Locate the "View all" or "Contributors" button to open the modal */
    let trigger = Array.from(document.querySelectorAll("div, span, button")).find(el => 
        (el.textContent.trim() === "View all" || el.textContent.includes("Contributors")) && 
        el.children.length === 0
    );

    if (!trigger) return alert("Could not find the contributors list trigger.");
    trigger.click();

    /* --- 4. FIND SCROLLABLE CONTAINER --- */
    /* Wait for the modal to appear and identify the scrollable element */
    let scrollContainer = null;
    for (let i = 0; i < 15; i++) {
        await sleep(500);
        scrollContainer = Array.from(document.querySelectorAll("div")).find(el => {
            const style = window.getComputedStyle(el);
            return (style.overflowY == "auto" || style.overflow == "auto") && 
                   el.scrollHeight > el.clientHeight;
        });
        if (scrollContainer) break;
    }

    if (!scrollContainer) return alert("Scrolling list not found.");

    /* --- 5. AUTOMATED SCROLLING --- */
    /* Scroll to the bottom repeatedly to trigger lazy-loading of the list */
    let lastHeight = 0;
    let stagnationCount = 0;
    
    while (stagnationCount < 4) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        /* Randomized delay to mimic human behavior and allow content to load */
        await sleep(1500 + 1000 * Math.random());

        if (scrollContainer.scrollHeight === lastHeight) {
            stagnationCount++;
            /* Nudge the scroll to try and trigger more loading if stuck */
            scrollContainer.scrollTop -= 300;
            await sleep(200);
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        } else {
            lastHeight = scrollContainer.scrollHeight;
            stagnationCount = 0;
        }
    }

    /* --- 6. DATA EXTRACTION --- */
    /* Identify all profile links within the list rows */
    const rows = scrollContainer.querySelectorAll('.q-flex.qu-alignItems--center.qu-py--small');
    const links = [];
    
    rows.forEach(row => {
        const followBtn = row.querySelector('button span[aria-label^="Follow"]');
        const profileLink = row.querySelector('a[href*="/profile/"]');
        if (followBtn && profileLink) {
            links.push(profileLink.href);
        }
    });

    /* Remove duplicates */
    const uniqueLinks = [...new Set(links)];

    /* --- 7. UI CONSTRUCTION & INJECTION --- */
    /* Build the final results popup */
    const popup = document.createElement("div");
    popup.id = "q-extractor-popup";
    popup.innerHTML = `
        <div id="q-extractor-header">
            <h3>Targeted Profiles (${uniqueLinks.length})</h3>
            <span id="q-extractor-close">✕</span>
        </div>
        <div id="q-extractor-output">${uniqueLinks.join("\n")}</div>
        <div id="q-extractor-footer">
            <button id="q-extractor-copy">Copy to Clipboard</button>
        </div>
    `;
    document.body.appendChild(popup);

    /* --- 8. UI EVENT HANDLERS --- */
    /* Handle closing the popup */
    document.getElementById("q-extractor-close").onclick = () => popup.remove();

    /* Handle copying results to clipboard */
    document.getElementById("q-extractor-copy").onclick = () => {
        navigator.clipboard.writeText(uniqueLinks.join("\n"));
        const copyBtn = document.getElementById("q-extractor-copy");
        copyBtn.innerText = "Copied!";
        setTimeout(() => {
            copyBtn.innerText = "Copy to Clipboard";
        }, 2000);
    };
})();
