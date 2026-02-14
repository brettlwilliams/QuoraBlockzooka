# QuoraBlockzooka
A series of small utilities that help with curating your experience on Quora.

The underlying assumptions
* People are lazy
* Computers are dumb
* Thus, they do the same dumb thing over and over again

## Followers
This bookmarklet automates the process of collecting profile links from a Quora profile. When you run it, the script:

* Opens the Followers list: Automatically finds and clicks the "Followers" button.
* Auto-Scrolls: Handles Quora's infinite scrolling for you, moving to the bottom until the entire list is loaded.
* Extracts Profiles: Scans the list for unique profile URLs.
* Export: Displays the results in a clean pop-up window with a "Copy to Clipboard" button for easy use.

## Contributors

This bookmarklet automates the collection of profile links from a Quora Contributors when run on a 
Quora space. When executed, it:

* Locates the Contributors: Automatically finds and clicks the "View all" button in the Contributors area.
* Smart Auto-Scroll: Detects the scrollable window and automatically scrolls to the bottom, pausing to let new profiles load until the entire list is reached.
* Extracts Profiles: Scans the loaded list and extracts all unique Quora profile URLs.
* Export: Displays the links in a pop-up overlay with a "Copy to Clipboard" button for easy copying.

## Block
This bookmarklet streamlines the process of blocking a Quora user by automating the multiple clicks usually required. When activated on a user's profile, it:

* Opens the Menu: Instantly finds and clicks the "More" (three dots) overflow menu.
* Selects Block: Locates the "Block" option within the pop-up menu and clicks it automatically.
* Confirms Action: Detects the final confirmation prompt and clicks "Block" to finish the process.

  ## Space Report Extract

  This bookmarklet is a  Profile Scraper for Quora report Spaces. It automates the extraction of profile links from Space feeds or member pages. When activated, it:

* Subdomain Check: Ensures it's running on a Quora Space (subdomain) to prevent errors.
* Customizable Depth: Provides a pop-up menu where you can choose the number of "scrolls" (up to 50) to determine how deep the scraper should go.
* Intelligent Scrolling: Automatically scrolls the page and waits for new content to load using a randomized "jitter" delay to mimic human behavior.
* Extraction & Cleanup: Scans the text for profile URLs, removes duplicates, and filters out unnecessary tracking data. Extraction only applies to the 'bubbled' shared URLs in the body of a post.
* Manual Override: Features a "Force Stop & Show" button that lets you end the process early and see the links collected up to that point.

## Mass Report
This bookmarklet automates the reporting process for multiple questions on a Quora user's profile. It is limited to running on the Questions tab of a profile. When activated, it:

* Page Verification: Checks to ensure you are on a valid /questions profile page before starting.
* Custom Volume: Provides a pop-up where you can specify exactly how many questions you want to report (skipping the first one to avoid accidental self-reporting).
* Reason Selection: Allows you to choose between reporting for Spam or Child Safety (CSAM).
* Full Automation: Iterates through the questions, automatically opens the "More" menu, selects "Report," chooses the specified reason, and submits the report.
* Live Status: Displays a real-time progress tracker (e.g., "Reporting 3 of 5...") so you know exactly where the process stands.

## The Blockzooka

