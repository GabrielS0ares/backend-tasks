import fs from 'node:fs/promises'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table) {
        let data = this.#database[table] ?? []

        return data
    }

    insert(table, data) {
        try {
            if (Array.isArray(this.#database[table])) {
                this.#database[table].push(data)
            } else {
                this.#database[table] = [data]
            }

            this.#persist()

            return { success: true }
        }
        catch {
            return { success: false }
        }
    }

    parcialUpdade(table, data, id) {

        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {


            const task = this.#database[table][rowIndex]

            const updateKeys = Object.keys(data)

            let updateTask = { ...task }

            updateKeys.forEach(key => {
                if (key == "completed_at") {
                    updateTask[key] = data[key] ? true : null
                    return
                }
                if (data[key]) {
                    updateTask[key] = data[key]
                    return
                }
            })

            this.#database[table][rowIndex] = updateTask

            this.#persist()

            return { success: true }
        }
        else {
            return { success: false }
        }


    }
}