import { $ } from "../utils/selectors";

$('#search-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const keyword = $('#to-search', e.target).value
    const url = 'https://www.linkedin.com/search/results/people/?keywords='+keyword
    const { id } = await chrome.tabs.create(
        {url}
    )
    const opcions= {
        target:{ tabId: tab.id },
        files: ["scripts/scrapCandidates.js"]
    }
    chrome.scripting.executeScript(opcions)
})