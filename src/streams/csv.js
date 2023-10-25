import { parse } from 'csv-parse'
import fs from 'node:fs'
import { resolve } from 'node:path';

const csvPath = new URL('./multiple-tasks.csv',import.meta.url)

async function run() {
    const lines = fs.createReadStream(csvPath).pipe(parse({
        delimiter: ',',
        skipEmptyLines: true,
        fromLine: 2
    }))
    for await(const line of lines) {
        const [title,description] = line;
        await fetch('http://localhost:3336/tasks',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description
            })
        })
    }
}

run()
function wait(ms) {
      return new Promise(resolve=>setTimeout(resolve,ms))  
}