import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoadPath } from './utils/build-road-path.js'

const database = new Database()
export const routes = [
    {
        method: 'GET',
        path: buildRoadPath('/tasks'),
        handler: (request,response) => {
            const { search } = request.query
            const tasks = database.select('tasks',{
                title: search,
                description: search
            })
            return response.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoadPath('/tasks'),
        handler: (request,response) => {
            const { title,description } = request.body
            const date = new Date()
            const today = `${date.getDate()}/${(date.getMonth()+1)}/${date.getFullYear()}`
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: today,
                updated_at: today
            }
            database.insert('tasks',task)
            return response.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoadPath('/tasks/:id'),
        handler: (request,response) => {
            const { id } = request.params
            const { title,description } = request.body
            const date = new Date()
            const today = `${date.getDate()}/${(date.getMonth()+1)}/${date.getFullYear()}`
            database.update('tasks',id,{
               title,
               description,
               updated_at: today
            })
            return response.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoadPath('/tasks/:id/complete'),
        handler: (request,response) => {
            const { id } = request.params
            const [task] = database.select('tasks',{id})
            const date = new Date()
            const today = `${date.getDate()}/${(date.getMonth()+1)}/${date.getFullYear()}`
            const completed_at = !!task.completed_at ? null : today
            database.update('tasks',id,{completed_at})
            return response.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoadPath('/tasks/:id'),
        handler: (request,response) => {
            const { id } = request.params
            database.delete('tasks',id)
            return response.writeHead(204).end()
        }
    }
]