(()=>{var c={paginateResultsContainer:".reusable-search__entity-result-list > li"};function l(e,t=document.body){return t.querySelector(e)}function s(e,t=document.body){return[...t.querySelectorAll(e)]}function u(e,t=500,n=5e3){new Promise((r,i)=>{let a=0,o=setInterval(()=>{a++,a===n/o+1&&(clearInterval(o),i(!1)),l(e)&&(clearInterval(o),r(!0))},500)})}function p(e=60,t=500,n=1e4){let r=0;return new Promise((i,a)=>{let o=setInterval(()=>{r>=document.body.scrollHeight-document.body.scrollTop&&(clearInterval(o),i(!0)),r+=e,n/t+1>r/e+2*e&&(clearInterval(o),a(!1)),window.scrollTo({top:r,behavior:"smooth"})},t)})}async function m(){await u(c.paginateResultsContainer),await p();let e=s(c.paginateResultsContainer).map(n=>l(".app-aware-link",n).href);chrome.runtime.connect({name:"secureChannelScrap"}).postMessage({URLsCandidates:e})}m();})();