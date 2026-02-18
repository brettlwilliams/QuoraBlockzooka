/**
 * Blockzooka Expanded Script
 * Functionality: Automates blocking users on Quora via a batch list of URLs.
 */
(async function() {
    const host = window.location.hostname;

    // --- SUBDOMAIN CHECK ---
    // Quora scripts often fail on subdomains (like hi.quora.com) due to DOM differences.
    if (host.includes('.') && host !== 'www.quora.com' && host !== 'quora.com') {
        const style = document.createElement('style');
        style.innerHTML = `
            #q-error-popup {
                position: fixed; top: 10%; left: 50%; transform: translateX(-50%);
                width: 400px; background: #fff; border: 1px solid #ff4b4b;
                box-shadow: 0 4px 15px rgba(255,0,0,0.2); z-index: 10001;
                padding: 20px; font-family: sans-serif; border-radius: 8px;
                display: flex; flex-direction: column; text-align: center;
            }
            #q-error-header { font-weight: bold; color: #ff4b4b; margin-bottom: 15px; font-size: 18px; }
            .q-error-text { font-size: 14px; color: #333; margin-bottom: 20px; line-height: 1.4; }
            .q-btn-error { background: #2e69ff; color: #fff; border: none; padding: 12px; border-radius: 4px; cursor: pointer; font-weight: bold; }
        `;
        document.head.appendChild(style);

        const errContainer = document.createElement('div');
        errContainer.id = 'q-error-popup';
        errContainer.innerHTML = `
            <div id="q-error-header">Action Required</div>
            <div class="q-error-text">
                Blockzooka cannot run on subdomains (<strong>${host}</strong>). 
                Please return to the main Quora site to continue.
            </div>
            <button class="q-btn-error" onclick="window.location.href='https://www.quora.com'">
                Go to www.quora.com
            </button>
        `;
        document.body.appendChild(errContainer);
        return;
    }

    // --- MAIN UI STYLING ---
    const style = document.createElement('style');
    style.innerHTML = `
        #q-blocker-popup {
            position: fixed; top: 10%; left: 50%; transform: translateX(-50%);
            width: 400px; background: #fff; border: 1px solid #ccc;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 10000;
            padding: 20px; font-family: sans-serif; border-radius: 8px;
            display: flex; flex-direction: column;
        }
        #q-blocker-header { display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center; }
        #q-blocker-header h3 { margin: 0; font-size: 16px; color: #333; }
        #q-blocker-close { cursor: pointer; font-weight: bold; color: #999; }
        #q-blocker-input { 
            width: 100%; height: 80px; border: 1px solid #ddd; border-radius: 4px; 
            padding: 10px; font-family: monospace; font-size: 12px; margin-bottom: 10px; 
            box-sizing: border-box; resize: none; background: #f4f4f4; 
        }
        .q-input-group { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; font-size: 13px; color: #444; }
        #q-limit-input { width: 60px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; text-align: center; }
        .q-btn-primary { background: #2e69ff; color: #fff; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold; text-align: center; }
        .q-btn-secondary { background: #666; color: #fff; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold; text-align: center; font-size: 12px; flex: 1; margin: 2px; }
        .q-controls-row { display: none; gap: 5px; margin-bottom: 10px; }
        #q-progress-container { display: none; margin-top: 10px; }
        #q-progress-bar { width: 100%; background: #eee; height: 8px; border-radius: 4px; overflow: hidden; }
        #q-progress-fill { width: 0%; background: #2e69ff; height: 100%; transition: width: 0.3s; }
        .status-text { font-size: 12px; color: #666; margin: 5px 0; }
    `;
    document.head.appendChild(style);

    // --- UI HTML STRUCTURE ---
    const container = document.createElement('div');
    container.id = 'q-blocker-popup';
    container.innerHTML = `
        <div id="q-blocker-header">
            <h3>Blockzooka</h3>
            <span id="q-blocker-close">✖</span>
        </div>
        <textarea id="q-blocker-input" placeholder="Paste URLs..."></textarea>
        <div class="q-input-group">
            <span>Limit blocking to:</span>
            <input type="number" id="q-limit-input" value="0" min="1">
        </div>
        <div id="q-blocker-footer">
            <button id="q-start-action" class="q-btn-primary" style="width:100%">Start Blocking</button>
            <div class="q-controls-row" id="q-controls">
                <button id="q-pause-btn" class="q-btn-secondary">Pause</button>
                <button id="q-add-more" class="q-btn-secondary">Queue URLs</button>
            </div>
            <div id="q-progress-container">
                <div class="status-text"><strong>Status:</strong> <span id="q-status">Waiting...</span></div>
                <div class="status-text"><strong>Progress:</strong> <span id="q-rem">0</span></div>
                <div id="q-progress-bar"><div id="q-progress-fill"></div></div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // --- SELECTORS & STATE ---
    const inputArea = document.getElementById('q-blocker-input');
    const limitInput = document.getElementById('q-limit-input');
    const addMoreBtn = document.getElementById('q-add-more');
    const pauseBtn = document.getElementById('q-pause-btn');
    const controls = document.getElementById('q-controls');
    const statusEl = document.getElementById('q-status');
    const remEl = document.getElementById('q-rem');
    const progressFill = document.getElementById('q-progress-fill');

    let urlsToProcess = [];
    let isPaused = false;

    // Detect URLs in real-time as user pastes
    inputArea.addEventListener('input', () => {
        const urls = inputArea.value.split(/[\s,]+/).filter(u => u.includes('/profile/'));
        limitInput.value = urls.length;
    });

    document.getElementById('q-blocker-close').onclick = () => container.remove();

    pauseBtn.onclick = () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? "Resume" : "Pause";
        pauseBtn.style.background = isPaused ? "#f8a100" : "#666";
    };

    // --- MAIN EXECUTION LOOP ---
    document.getElementById('q-start-action').onclick = async () => {
        const allUrls = inputArea.value.split(/[\s,]+/).filter(u => u.includes('/profile/'));
        const limit = parseInt(limitInput.value) || allUrls.length;
        urlsToProcess = allUrls.slice(0, limit);

        if (!urlsToProcess.length) return alert("No URLs found.");

        // UI Reset for processing mode
        inputArea.value = "";
        inputArea.placeholder = "Paste more URLs here to queue...";
        document.querySelector('.q-input-group').style.display = "none";
        document.getElementById('q-start-action').style.display = "none";
        controls.style.display = "flex";
        document.getElementById('q-progress-container').style.display = "block";

        // Logic for adding URLs while the script is already running
        addMoreBtn.onclick = () => {
            const newUrls = inputArea.value.split(/[\s,]+/).filter(u => u.includes('/profile/') && !urlsToProcess.includes(u));
            if (newUrls.length) {
                urlsToProcess.push(...newUrls);
                inputArea.value = "";
                const oldStatus = statusEl.textContent;
                statusEl.textContent = `Added ${newUrls.length} more to queue!`;
                statusEl.style.color = "#2e69ff";
                statusEl.style.fontWeight = "bold";
                setTimeout(() => {
                    statusEl.textContent = oldStatus;
                    statusEl.style.color = "";
                    statusEl.style.fontWeight = "";
                }, 3000);
            }
        };

        // Iterate through the list
        for (let i = 0; i < urlsToProcess.length; i++) {
            // Pause Check
            while (isPaused) {
                statusEl.textContent = "Paused...";
                await new Promise(r => setTimeout(r, 500));
            }

            const url = urlsToProcess[i];
            remEl.textContent = `${i + 1} of ${urlsToProcess.length}`;
            statusEl.textContent = "Loading...";

            // Open user profile in a small popup window
            const win = window.open(url, 'blockerWin', 'width=600,height=700');

            // --- WINDOW AUTOMATION LOGIC ---
            await new Promise(resolve => {
                const checkInterval = setInterval(() => {
                    try {
                        if (!win || win.closed) {
                            clearInterval(checkInterval);
                            resolve();
                            return;
                        }

                        const doc = win.document;
                        
                        // Check if user is already blocked (red background indicator in Quora UI)
                        const isBlocked = Array.from(doc.querySelectorAll('.qu-bg--red')).find(el => el.textContent.toLowerCase().includes('blocked'));
                        
                        // Check if user "Follows You" (common safety check to avoid accidental blocks)
                        const followsYou = Array.from(doc.querySelectorAll('.qu-color--gray')).find(el => el.textContent.toUpperCase() === 'FOLLOWS YOU');

                        if (isBlocked || followsYou) {
                            statusEl.textContent = isBlocked ? "Already Blocked. Skipping..." : "Follows You. Skipping...";
                            clearInterval(checkInterval);
                            setTimeout(() => { win.close(); resolve(); }, 1000);
                            return;
                        }

                        // Look for the "..." (Overflow Menu) button on profile
                        const menuBtn = doc.querySelector('button.puppeteer_test_overflow_menu');
                        if (menuBtn) {
                            clearInterval(checkInterval);
                            statusEl.textContent = "Blocking...";
                            menuBtn.click();

                            // Wait for menu items to appear
                            setTimeout(() => {
                                const items = doc.querySelectorAll('.puppeteer_test_popover_item');
                                const blockItem = Array.from(items).find(item => item.textContent.includes('Block'));
                                
                                if (blockItem) {
                                    blockItem.click();
                                    
                                    // Confirm the block in the modal
                                    setTimeout(() => {
                                        const confirmBtn = doc.querySelector('button.puppeteer_test_modal_submit');
                                        if (confirmBtn && confirmBtn.textContent.includes('Block')) {
                                            confirmBtn.click();
                                            statusEl.textContent = "Success!";
                                            setTimeout(() => { win.close(); resolve(); }, 1500);
                                        } else {
                                            win.close(); resolve();
                                        }
                                    }, 800);
                                } else {
                                    win.close(); resolve();
                                }
                            }, 600);
                        }
                    } catch (e) {
                        // Handle cross-origin errors if the page hasn't loaded yet
                    }
                }, 1000);

                // Safety timeout: close window if it hangs for 20 seconds
                setTimeout(() => {
                    if (win && !win.closed) {
                        win.close();
                        resolve();
                    }
                }, 20000);
            });

            // Update Progress UI
            progressFill.style.width = `${((i + 1) / urlsToProcess.length) * 100}%`;

            // --- COOLDOWN (Anti-Spam/Rate Limiting) ---
            if (i < urlsToProcess.length - 1) {
                // Generates a random delay between ~7 and ~12 seconds
                const delay = 3000 + (Math.floor(Math.random() * 5001) + 4000);
                let timer = Math.floor(delay / 1000);
                
                const timerInt = setInterval(() => {
                    if (!isPaused) {
                        timer--;
                        statusEl.textContent = `Cooldown: ${timer}s`;
                    }
                    if (timer <= 0) clearInterval(timerInt);
                }, 1000);

                await new Promise(r => setTimeout(r, delay));
            }
        }

        statusEl.textContent = "Batch Finished!";
        setTimeout(() => container.remove(), 6000);
    };
})();
