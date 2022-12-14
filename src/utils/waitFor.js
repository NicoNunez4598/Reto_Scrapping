import { searchSelectors } from "../config/scrapperSelectos";
import { $ } from "./selectors";

export function waitForSelector (selector, intervalTime = 500, timeOut = 5000){
    new Promise((res, rej)=>{
        let count = 0
        const interval = setInterval(() => {
            count++
            if(count === timeOut/interval + 1){
                clearInterval(interval)
                rej(false)
            }
            if($(selector)){
                clearInterval(interval)
                res(true)
            }
        }, 500);
    })
}

export function waitForScroll(offset = 60, time = 500, timeOut = 10000){
    let y = 0
    return new Promise ((res, rej)=>{
        const interval = setInterval(()=>{
            if(y >= (document.body.scrollHeight - document.body.scrollTop)){
                clearInterval(interval)
                res(true)
            }

            y+=offset
            
            if(timeOut/time+1 > y/offset+2*offset){
                clearInterval(interval)
                rej(false)
            }
            window.scrollTo({top: y, behavior: 'smooth'})
        },time)
    })
}