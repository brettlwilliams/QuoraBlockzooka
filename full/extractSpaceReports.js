(async function() {
    // 1. DOMAIN VALIDATION
    // Ensures the script only runs on Quora Space subdomains (e.g., "space-name.quora.com")
    const host = window.location.hostname;
    const isSubdomain = host.endsWith('.quora.com') && host !== 'www.quora.com';

    if (!isSubdomain) {
        // Injects error styles if the user is on the wrong page
        const style = document.createElement('style');
        style.innerHTML = `
            #q-error-popup{position:fixed;top:10%;left:50%;transform:translateX(-50%);width:320px;background:#fff;border:1px solid #ccc;box-shadow:0 4px 15px rgba(0,0,0,0.2);z-index:10001;padding:20px;font-family:sans-serif;border-radius:8px;display:flex;flex-direction:column;text-align:center}
            #q-error-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
            #q-error-title{font-size:14px;font-weight:bold;color:#333}
            #q-error-x{cursor:pointer;font-weight:bold;color:#999;font-size:18px}
            .q-error-msg{font-size:13px;color:#666;margin-top:5px}
        `;
        document.head.appendChild(style);

        const errContainer = document.createElement('div');
        errContainer.id = 'q-error-popup';
        errContainer.innerHTML = `
            <div id="q-error-header"><span id="q-error-title">Notice</span><span id="q-error-x" title="Close">✕</span></div>
            <div class="q-error-msg">Please run this on a Quora Space subdomain.</div>
        `;
        document.body.appendChild(errContainer);

        const closeErr = () => errContainer.remove();
        document.getElementById('q-error-x').onclick = closeErr;
        setTimeout(closeErr, 5000); // Auto-close error after 5 seconds
        return;
    }

    // 2. MAIN UI STYLING
    // Defines the look of the scraper control panel
    const style = document.createElement('style');
    style.innerHTML = `
        #q-extractor-popup{position:fixed;top:10%;left:50%;transform:translateX(-50%);width:480px;max-height:75%;background:#fff;border:1px solid #ccc;box-shadow:0 4px 15px rgba(0,0,0,0.3);z-index:10000;padding:20px;font-family:-apple-system,sans-serif;border-radius:8px;display:flex;flex-direction:column}
        #q-extractor-header{display:flex;justify-content:space-between;margin-bottom:12px;align-items:center}
        #q-extractor-header h3{margin:0;font-size:16px;color:#333;font-weight:bold}
        #q-extractor-close{cursor:pointer;font-weight:bold;color:#999;font-size:18px;padding:5px}
        #q-extractor-close:hover{color:#f44336}
        #q-extractor-input-area{margin:10px 0;padding:15px;background:#f0f2f5;border-radius:6px}
        #q-extractor-input-label{display:block;margin-bottom:8px;font-size:13px;color:#555}
        #scroll-num-input{width:80px;padding:8px;border:1px solid #ddd;border-radius:4px;font-size:14px;margin-right:10px}
        #q-extractor-output{background:#f7f7f8;padding:12px;border-radius:4px;overflow-y:auto;flex-grow:1;font-family:monospace;font-size:11px;white-space:pre-wrap;border:1px solid #e2e2e6;color:#222;line-height:1.5;display:none}
        #q-extractor-footer{margin-top:15px;display:flex;gap:10px}
        #q-extractor-copy,#q-start-btn{background:#2e69ff;color:#fff;border:none;padding:8px 15px;border-radius:4px;cursor:pointer;font-weight:bold;font-size:13px}
        #q-extractor-copy:active,#q-start-btn:active{background:#1a4fcc}
        #q-extractor-copy{display:none}
    `;
    document.head.appendChild(style);

    // 3. STATE MANAGEMENT
    let isRunning = false;
    let stopRequested = false;

    // 4. CREATE THE CONTROL PANEL
    const container = document.createElement('div');
    container.id = 'q-extractor-popup';
    container.innerHTML = `
        <div id="q-extractor-header">
            <h3 id="q-title">Profile Scraper</h3>
            <span id="q-extractor-close" title="Close and Stop Script">✕</span>
        </div>
        <div id="q-extractor-input-area">
            <label id="q-extractor-input-label" for="scroll-num-input">Number of scrolls (Max 50):</label>
            <input type="number" id="scroll-num-input" value="20" min="1" max="50">
            <button id="q-start-btn">Start Extraction</button>
        </div>
        <div id="q-extractor-output"></div>
        <div id="q-extractor-footer">
            <button id="q-extractor-copy">Copy to Clipboard</button>
        </div>
    `;
    document.body.appendChild(container);

    // DOM Elements for manipulation
    const startBtn = document.getElementById('q-start-btn');
    const closeBtn = document.getElementById('q-extractor-close');
    const copyBtn = document.getElementById('q-extractor-copy');
    const inputArea = document.getElementById('q-extractor-input-area');
    const outputArea = document.getElementById('q-extractor-output');
    const title = document.getElementById('q-title');

    // 5. STOP LOGIC
    closeBtn.onclick = () => {
        if (isRunning) stopRequested = true;
        container.remove();
    };

    // 6. UTILITY: COUNTDOWN TIMER
    // Updates the UI every 100ms so the user knows when the next scroll occurs
    const waitWithCountdown = async (ms, current, total) => {
        let remaining = ms;
        while (remaining > 0) {
            if (stopRequested) break;
            outputArea.innerText = `Scrolling... (${current}/${total})\nNext scroll in: ${(remaining / 1000).toFixed(1)}s\nClose to stop early.`;
            await new Promise(r => setTimeout(r, 100));
            remaining -= 100;
        }
    };

    // 7. START EXTRACTION LOGIC
    startBtn.onclick = async () => {
        let scrollCount = parseInt(document.getElementById('scroll-num-input').value);
        if (isNaN(scrollCount) || scrollCount <= 0) return;
        if (scrollCount > 50) scrollCount = 50; // Cap at 50 to prevent hangs

        isRunning = true;
        inputArea.style.display = 'none';
        outputArea.style.display = 'block';
        title.innerText = "Extracting...";

        // SCROLLING LOOP
        for (let i = 0; i < scrollCount; i++) {
            if (stopRequested) break;
            
            // Scroll to the bottom of the page to load more content
            window.scrollTo(0, document.body.scrollHeight);
            
            // Random jitter between 2-5 seconds to avoid bot detection
            const jitter = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
            const totalWait = 2000 + jitter; 
            
            await waitWithCountdown(totalWait, i + 1, scrollCount);
        }

        // 8. DATA EXTRACTION
        if (!stopRequested) {
            const profileSet = new Set();
            // Looks for specific Quora text containers often used for contributor links
            const linkContainers = document.querySelectorAll("div.q-text.qu-truncateLines--3.qu-bold.qu-color--gray_dark_dim.qu-wordBreak--break-word");
            
            linkContainers.forEach(el => {
                const text = el.innerText.trim();
                if (text.includes("quora.com/profile/")) {
                    // Match full URL via Regex
                    const match = text.match(/https?:\/\/[^\s]+\.quora\.com\/profile\/[^\s\n\?]+/);
                    if (match) {
                        profileSet.add(match[0]);
                    } else if (text.includes("/profile/")) {
                        // Fallback if regex misses but keywords exist
                        profileSet.add(text.split('?')[0]);
                    }
                }
            });

            // 9. DISPLAY RESULTS
            const finalLinks = [...profileSet];
            title.innerText = `Extracted Profiles (${finalLinks.length})`;
            outputArea.innerText = finalLinks.length > 0 ? finalLinks.join('\n') : "No links found in the text containers.";
            copyBtn.style.display = 'block';
            isRunning = false;

            // 10. CLIPBOARD LOGIC
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(finalLinks.join('\n'));
                copyBtn.innerText = 'Copied!';
                setTimeout(() => copyBtn.innerText = 'Copy to Clipboard', 2000);
            };
        }
    };
})();
