/* Quora Automated Profile 'Answers' Reporter 
   Targeting: Spam and CSAM
*/
javascript:(async function(){
    // Check if we are on a valid Quora profile answers page
    const profileAnswersRegex = /^https:\/\/www\.quora\.com\/profile\/[^\/]+(\/answers)?\/?$/;
    if(!profileAnswersRegex.test(window.location.href)){
        alert("This script only works on Quora 'Answers' profile pages.\nExample: https://www.quora.com/profile/Name/answers");
        return;
    }

    // Inject UI Styles
    const style = document.createElement('style');
    style.innerHTML = `
        #q-report-popup{position:fixed;top:15%;left:50%;transform:translateX(-50%);width:350px;background:#fff;border:1px solid #ccc;box-shadow:0 4px 15px rgba(0,0,0,0.3);z-index:10000;padding:20px;font-family:sans-serif;border-radius:8px}
        #q-report-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
        #q-report-header h3{margin:0;font-size:16px;color:#333}
        #q-report-close{cursor:pointer;font-weight:bold;color:#999}
        .q-option-group{margin:15px 0;display:flex;flex-direction:column;gap:8px;font-size:14px}
        .q-option-group label{cursor:pointer;display:flex;align-items:center;gap:8px}
        #q-report-input{width:100%;padding:8px;margin-bottom:15px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box}
        #q-report-start{background:#2e69ff;color:#fff;border:none;padding:10px 15px;border-radius:4px;cursor:pointer;font-weight:bold;width:100%}
        #q-report-status{margin-top:10px;font-size:12px;color:#666;text-align:center}
    `;
    document.head.appendChild(style);

    // Create the Popup Container
    const container = document.createElement('div');
    container.id = 'q-report-popup';
    container.innerHTML = `
        <div id="q-report-header"><h3>Automated Report (Answers)</h3><span id="q-report-close">✕</span></div>
        <label style="font-size:12px;color:#666;">Items to report (skipping first):</label>
        <input type="number" id="q-report-input" value="5" min="1">
        <div class="q-option-group">
            <strong>Select Reason:</strong>
            <label><input type="radio" name="reportReason" value="Spam" checked> Spam</label>
            <label><input type="radio" name="reportReason" value="CSAM"> CSAM (Child Safety)</label>
        </div>
        <button id="q-report-start">Start Reporting</button>
        <div id="q-report-status">Profile Link Verified</div>
    `;
    document.body.appendChild(container);

    // Close functionality
    document.getElementById('q-report-close').onclick = () => container.remove();

    // Main Execution Logic
    document.getElementById('q-report-start').onclick = async function(){
        const count = parseInt(document.getElementById('q-report-input').value);
        const reasonType = document.querySelector('input[name="reportReason"]\:checked').value;
        const status = document.getElementById('q-report-status');
        const startBtn = document.getElementById('q-report-start');
        
        // Find the "..." overflow menus
        const allButtons = Array.from(document.querySelectorAll('.puppeteer_test_overflow_menu'));
        const targetButtons = allButtons.slice(1, count + 1);

        if(targetButtons.length === 0){
            status.innerText = "No target buttons found!";
            return;
        }

        startBtn.disabled = true;
        startBtn.innerText = "Running...";

        for(let i = 0; i < targetButtons.length; i++){
            status.innerText = `Reporting ${i+1} of ${targetButtons.length}...`;
            
            // 1. Click the "..." button
            targetButtons[i].click();
            await new Promise(r => setTimeout(r, 800));

            // 2. Click "Report" in the dropdown
            const dropdownItems = Array.from(document.querySelectorAll('.q-text,[role="menuitem"]'));
            const reportOption = dropdownItems.find(el => el.innerText.trim() === 'Report');
            if(reportOption) reportOption.click();
            await new Promise(r => setTimeout(r, 1200));

            // 3. Select specific reason
            if(reasonType === "Spam"){
                const labels = Array.from(document.querySelectorAll('label'));
                const spamLabel = labels.find(l => l.innerText.includes('Spam') && l.innerText.includes('money scams'));
                if(spamLabel) spamLabel.click();
            } else {
                // CSAM logic
                const divs = Array.from(document.querySelectorAll('div.q-text.qu-bold'));
                const csamDiv = divs.find(d => d.innerText.includes('Sexual exploitation and abuse'));
                if(csamDiv) csamDiv.click();
            }

            await new Promise(r => setTimeout(r, 800));

            // 4. Submit the report
            const submitBtn = document.querySelector('.puppeteer_test_modal_submit');
            if(submitBtn) submitBtn.click();
            
            // Cooldown between reports
            await new Promise(r => setTimeout(r, 2000));
        }

        status.innerText = "All tasks complete!";
        setTimeout(() => container.remove(), 2000);
    }
})();
