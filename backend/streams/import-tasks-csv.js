import { parse } from 'csv-parse'
import fs from 'node:fs'

const csvPath = new URL('./tasks.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const csvParce = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2
})

async function run() {
    const linesParse = stream.pipe(csvParce);

    for await (const line of linesParse){
        const [title, description] = line

        await fetch('http://localhost:9000/tasks', {
            method : 'POST',
            body : JSON.stringify({
                title,
                description
            })
        })

        await wait(1000)
    }
}

run()

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}