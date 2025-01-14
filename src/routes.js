import { buildRoutePath } from "./utilities/build-route-path.js"
import { Database } from "./database.js"
import { SnowflakeID } from "./utilities/snowflakeID.js"

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const tasks = database.select('tasks')

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {

            const {title, description} = req.body
            
            if(!title){
                return res.end("campo title ausente")
            }
            if(!description){
                return res.end("campo description ausente")
            }

            const snowflake = new SnowflakeID();

            const idTask = snowflake.generateId()

            const currentDate = new Date

            const task = {
                id: idTask,
                title,
                description,
                created_at : currentDate,
                updated_at : currentDate,
                completed_at : null
            }

            const createTask = database.insert('tasks', task)
            
            if(createTask.success){
                return res.writeHead(201).end(JSON.stringify({
                    message : "Task criada com sucesso", 
                    id : idTask
                }))
            }

            return res.writeHead(500).end("Ops... tivemos um problema")
        }
    }
]