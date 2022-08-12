import Dexie from "dexie";

export const db = new Dexie('myDataBase')
db.version(1).stores({
    urlCandidates: '++id, urls',
})

db.version(1).stores({
    profiles: '++id, name, experiencesElement, educationalsElement, contactInfo'
})