import { db } from "./config/conexion_dexie"

async function inyectScript (tabId, path){
    const opcions= {
        target:{ tabId },
        files: [path]
    }
    return chrome.scripting.executeScript(opcions)
}

async function inyectScrapCandidates(tabId){
    return inyectScript(tabId, "scripts/scrapCandidates.js")
}

chrome.action.onClicked.addListener((tab)=>{
    inyectScrapCandidates(tab.id)
})

chrome.runtime.onConnect.addListener((port)=>{
    const secureChannels = ['secureChannelScrap', 'secureChannelScrapProfile']
    if(!secureChannels.includes(port.name))
        throw new Error('Not secure Channel')
    switch (port.name) {
        case secureChannels[0]:
            port.onMessage.addListener(async (msg, {sender:{tab:{id: tabId,url: tabURL}}}) => {
                console.log("🚀 ~ file: sw.js ~ line 13 ~ port.onMessage.addListener ~ msg", msg)
                const originalURL = new URLSearchParams(tabURL.match(/\?.+/)[0].replace('?',''))
                const page = originalURL.has('page') ? Number(originalURL.get('page'))+1: 2
                //await chrome.tabs.update(tabId, {url: tabURL + '&page='+page})
                db.urlCandidates.add({
                    urls: msg.URLsCandidates
                })
                const { id } = await chrome.tabs.create({url: msg.URLsCandidates[0]})
                inyectScript(id, 'scripts/scrapper.js')
                //inyectScrapCandidates(tabId)
            })
            break;
        case secureChannels[1]:
            port.onMessage.addListener(async ({profile}, {sender:{tab: {id: tabId}}})=>{
                db.profiles.add(profile)
                const [urlsRaw] = await db.urlCandidates.toArray()
                await chrome.tabs.update(tabId, {url: urlsRaw.urls[1]})
                inyectScript(tabId, 'scripts/scrapper.js')
            })
            break;
    
        default:
            break;
    }
})