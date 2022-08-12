import axios from "axios"
import dayjs from "dayjs"
import { profileSelectors } from "../config/scrapperSelectos"
import { Profile } from "../models/profile"
import { getCookie } from "../utils/cookie"
import {$, $$} from "../utils/selectors"
import { waitForScroll, waitForSelector } from "../utils/waitFor"

async function getContactInfo(){
    try {
        const token = getCookie('JSESSIONID', document.cookie)

        const [contactInfoName] = $(profileSelectors.contactInfo).href.match(/in\/.+\/o/g) ?? []

        const contactInfoURL = `https://www.linkedin.com/voyager/api/identity/profiles${contactInfoName.slice(2,-2)}/profileContactInfo`

        const {data: {data}} = await axios.get(contactInfoURL, {
            headers:{
                accept: 'application/vnd.linkedin.normalized+json+2.1',
                'csrf-token': token
            }
        })

        return data
    } catch (error) {
        console.log("🚀 ~ file: scrapper.js ~ line 25 ~ getContacInfo ~ error", error)
        throw new Error('error al obtener info del contacto')
    }
    
}

function getEspecificInfo(selector){
    try {
        const elements = $$(selector)
    
        return elements.map((listItem) => {
            if(!$('.pvs-entity__path-node', listItem)){
                const [title, enterprise, dateStringInfo] = $$('span[aria-hidden]', listItem).map(element => element.textContent)
                const [parsedRawDate] = dateStringInfo.match(/.+·|\d{4} - \d{4}/) ?? []
                const [startDate, endDate] = (parsedRawDate?.replace(/\s|·/g,'').split('-') ?? []).map(rawDateElement => dayjs(rawDateElement).isValid() ? dayjs(rawDateElement).toDate():null)
                return({
                    title,
                    enterprise,
                    dateStringInfo,
                    startDate,
                    endDate
                })
            }
        })

    } catch (error) {
        console.log("🚀 ~ file: scrapper.js ~ line 51 ~ getContacInfo ~ error", error)
    }
}

async function scrap(){

    console.log('Inicio de Scrap')

    await waitForSelector('h1')

    await waitForScroll()

    const name = $(profileSelectors.name).textContent

    const experienceTitles = getEspecificInfo(profileSelectors.experiencesElements)

    const educationTitles = getEspecificInfo(profileSelectors.educationElements)

    const contactInfo = await getContactInfo()

    const profile = new Profile()
    profile.name = name
    profile.experiencesElement = experienceTitles
    profile.educationsElement = educationTitles
    profile.contactInfo = contactInfo

    console.log(profile)

    const port = chrome.runtime.connect({ name: 'secureChannelScrapProfile' })

    port.postMessage({ profile })
    //console.table(profile.name, profile.experiencesElement, profile.educationsElement, profile.contactInfo)
}

scrap()