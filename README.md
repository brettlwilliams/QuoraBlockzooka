# QuoraBlockzooka

A series of small utilities that help with curating your experience on Quora.

### The Underlying Assumptions
* People are lazy.
* Computers are dumb.
* Thus, they do the same dumb thing over and over again.

---

## 🛠 Tools


### [Followers](https://github.com/brettlwilliams/QuoraBlockzooka/blob/main/followerslist.js)
This bookmarklet automates the collection of profile links from a Quora user's followers list. When activated, it:
* **Opens the List:** Automatically finds and clicks the "Followers" button.
* **Auto-Scrolls:** Handles Quora's infinite scrolling, moving to the bottom until the entire list is loaded.
* **Extracts Profiles:** Scans the list for unique profile URLs.
* **Export:** Displays results in a clean pop-up window with a "Copy to Clipboard" button.

### [Contributors](https://github.com/brettlwilliams/QuoraBlockzooka/blob/main/contributorslist.js)
This bookmarklet automates the collection of profile links from Quora Contributors within a Space. When activated, it:
* **Locates Contributors:** Automatically finds and clicks the "View all" button in the Contributors area.
* **Smart Auto-Scroll:** Detects the scrollable window and scrolls to the bottom, pausing for content to load until the list is complete.
* **Extracts Profiles:** Scans the loaded list and extracts all unique Quora profile URLs.
* **Export:** Displays links in a pop-up overlay with a "Copy to Clipboard" button.

### [Block](https://github.com/brettlwilliams/QuoraBlockzooka/blob/main/block.js)
This bookmarklet streamlines blocking a Quora user by automating the multiple clicks usually required. When activated on a user's profile, it:
* **Opens the Menu:** Instantly finds and clicks the "More" (three dots) overflow menu.
* **Selects Block:** Locates the "Block" option within the pop-up menu and clicks it.
* **Confirms Action:** Detects the final confirmation prompt and clicks "Block" to finish the process.

### [Space Mute](https://github.com/brettlwilliams/QuoraBlockzooka/blob/main/spacemute.js)
This bookmarklet streamlines muting a space by automating the multiple clicks usually required. When activated on a space it:
* **Space Check:** Verifies that you are currently on a Quora Space subdomain to ensure the script targets the correct context.
* **Opens the Menu:** Automatically locates and triggers the "More" overflow menu (three dots) on the Space header.
* * **Selects Mute:** Identifies the "Mute" option within the popover menu and initiates the request.
* * **Confirms Action:** Detects the final confirmation prompt and clicks "Confirm".

### [Extract Space Reports](https://github.com/brettlwilliams/QuoraBlockzooka/blob/main/extractSpaceReports.js)
This bookmarklet is a profile scraper for Quora Space feeds. When activated, it:
* **Subdomain Check:** Ensures it is running on a Quora Space subdomain to prevent errors.
* **Customizable Depth:** Provides a menu to choose the number of "scrolls" (up to 50) to determine how deep to scrape.
* **Intelligent Scrolling:** Automatically scrolls and waits for content using a randomized "jitter" delay to mimic human behaviour.
* **Extraction & Cleanup:** Scans for profile URLs (specifically 'bubbled' shared URLs in post bodies), removes duplicates, and filters tracking data.
* **Manual Override:** Includes a "Force Stop & Show" button to end the process early and view collected links.

### [Mass Report Q](https://github.com/brettlwilliams/QuoraBlockzooka/blob/main/massReport.js)
This bookmarklet automates the reporting process for multiple items on a Quora user's "Questions" tab. When activated, it:
* **Page Verification:** Ensures you are on a valid `/questions` profile page before starting.
* **Custom Interface:** Provides a pop-up to specify how many questions to report (skipping the first to avoid accidental self-reports).
* **Reason Selection:** Allows you to choose between reporting for Spam or Child Safety (CSAM).
* **Automated Workflow:** Iterates through questions, opens the "More" menu, selects "Report," and submits based on your chosen reason.
* **Live Status:** Displays a real-time progress tracker (e.g., "Reporting 3 of 5...").

* ### [Mass Report A](https://github.com/brettlwilliams/QuoraBlockzooka/blob/main/massreport_a.js)

This bookmarklet automates the reporting process for multiple items on a Quora user's "Answers" profile tab. When activated, it performs the following:

* **Page Verification:** Uses a regex check to ensure the script is running on a valid Quora profile "Answers" page (e.g., `quora.com/profile/Name/answers`) before initializing.
* **Custom Interface:** Injects a stylized pop-up menu into the browser window, allowing the user to specify the number of answers to report.
* **Reason Selection:** Provides toggle options to select the specific reporting category, such as "Spam" or "CSAM (Child Safety)."
* **Automated Workflow:** Uses asynchronous functions to iterate through the page's overflow menus, automatically clicking through the "Report" dialogs and selecting the predefined reasons.
* **Live Status:** Includes a real-time status indicator within the UI that updates as it processes each report (e.g., "Reporting 2 of 10...") and closes automatically upon completion.


### [The Blockzooka](https://github.com/brettlwilliams/QuoraBlockzooka/blob/main/theBlockzooka.js)
*Note: Run this overnight or on a separate computer. It is slow for a reason.*
This bookmarklet allows you to paste a list of profile URLs and automates the blocking process for all of them. When activated, it:
* **Batch Processing:** Provides a text area to paste multiple Quora profile links.
* **Safety Filters:** Automatically skips profiles that are already blocked or users who follow you.
* **Smart Throttling:** Uses a randomized cooldown (4–9 seconds) to mimic human behavior and avoid anti-bot detection.
* **Automated Navigation:** Opens profiles in a small popup, performs the block actions, and closes the window automatically.
* **Progress Tracking:** Features a live progress bar and status updates (e.g., "Cooldown...", "3 of 50").

---

## ⚠️ Disclaimer & Safety Warning
**Use these tools at your own risk.** QuoraBlockzooka is a collection of automation scripts designed for moderation and curation, but they must be used responsibly.

* **Mass Reporting:** Automated reporting should only be used for content that clearly violates Quora's Terms of Service. Abuse of the reporting system can lead to your own account being flagged or banned.
* **Manual Verification:** Always verify profiles before initiating batch actions. Automation is a "force multiplier"—it makes mistakes happen faster.
* **Throttling:** While these scripts include cooldown timers, aggressive use can be detected by Quora’s anti-bot systems. Avoid running batches larger than 100 in a single sitting.
* **Account Safety:** These scripts are provided for educational use only. The developer is not responsible for account restrictions, bans, or data loss. Using these tools carries a risk of a Quora ban. This may or may not be a bad thing.

---

## 🚀 How to Install and Use
A bookmarklet is a tiny "app" that lives in your browser's bookmarks bar. The effects disappear if you refresh the page.

### Step 1: Show your Bookmarks Bar
* **Chrome/Edge:** `Ctrl + Shift + B` (Windows) or `Cmd + Shift + B` (Mac).
* **Firefox:** Right-click the toolbar > **Bookmarks Toolbar** > **Always Show**.

### Step 2: Create the Bookmarklet
1. Right-click an empty space on your **Bookmarks Bar**.
2. Select **Add Page** (or **New Bookmark**).
3. **Name:** Give it a clear name (e.g., "Blockzooka").
4. **URL:** Copy the entire code (starting with `javascript:`) from the relevant file in this repo and paste it here.
5. Click **Save**.

### Step 3: Run the Script
1. Navigate to the relevant Quora page (Space, Profile, or Questions tab).
2. Click the bookmark you created.
3. Follow any on-screen prompts or status updates.
