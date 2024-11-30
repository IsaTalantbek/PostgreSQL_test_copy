import {
    run,
    createData,
    fetchData,
    updateData,
    deleteData,
    pool,
} from '../project/index.js'
import { Router } from 'express'
import postController from './controllers/databaseControllers/post.js'
import getController from './controllers/databaseControllers/get.js'
import putController from './controllers/databaseControllers/put.js'
import deleteController from './controllers/databaseControllers/delete.js'
import deleteMessagesController from './controllers/databaseControllers/deleteMessages.js'

const dataRouter = Router()

dataRouter.post('/', postController)

dataRouter.get('/', getController)

dataRouter.put('/', putController)

dataRouter.delete('/:id', deleteController)

dataRouter.get('/delete', deleteMessagesController)

export default dataRouter
