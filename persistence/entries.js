import PouchDB from 'pouchdb'

export const db = new PouchDB('timelapse')

export function getEntryForDate(date) {
  return db.get(date)
}

export async function setEntryForDate(date, entryCopy, revision = null) {
  let rev = null
  try {
    const doc = await getEntryForDate(date)
    rev = doc._rev
  } catch (err) {
    // Doc not created yet
  }
  
  return db.put({
    _id: date,
    _rev: rev,
    entryCopy
  })
}
