import { buildRoutePath } from "./utilities/build-route-path.js"
import { Database } from "./database.js"
import { SnowflakeID } from "./utilities/snowflakeID.js"

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            let tasks = database.select('tasks')

            const { query } = req

            if (query) {
                tasks = tasks.filter(row => {
                    return Object.entries(query).some(([key, value]) => {
                        return row[key].toLowerCase().includes(value.toLowerCase())
                    })
                })
            }

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {

            const { title, description } = req.body

            if (!title) {
                return res.end("campo title ausente")
            }
            if (!description) {
                return res.end("campo description ausente")
            }

            const snowflake = new SnowflakeID();

            const idTask = snowflake.generateId()

            const currentDate = new Date

            const task = {
                id: idTask,
                title,
                description,
                created_at: currentDate,
                updated_at: currentDate,
                completed_at: null
            }

            const createTask = database.insert('tasks', task)

            if (createTask.success) {
                return res.writeHead(201).end(JSON.stringify({
                    message: "Task criada com sucesso",
                    id: idTask
                }))
            }

            return res.writeHead(500).end("Ops... tivemos um problema")
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const { id } = req.params

            let tasks = database.select('tasks')

            const idTaskExist = tasks.some(task => task.id === id)

            if (idTaskExist) {

                const { title, description, completed_at } = req.body

                if (completed_at || description || title) {

                    const currentDate = new Date
                    const newDataTask = {
                        updated_at: currentDate,
                        ...req.body
                    }

                    const updateTask = database.parcialUpdade('tasks', newDataTask, id)

                    return res.writeHead(204).end()
                }
                else {
                    return res.writeHead(400).end(JSON.stringify({ message: "Campos: completed_at(boolean), description(string) ou title(string), não foram informados" }))
                }
            }
            return res.writeHead(404).end(JSON.stringify({ message: `ID: ${id} não encontrado` }))
        }
    }
]