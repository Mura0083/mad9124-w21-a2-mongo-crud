// Don't forget to use NPM to install Express and Mongoose.
// 'use strict'

import morgan from 'morgan'
import express from 'express'
import sanitizeMongo from 'express-mongo-sanitize'
import studentsRouter from './routes/students.js'
import coursesRouter from './routes/courses.js'



import connectDatabase from './startup/connectDatabase.js'
connectDatabase()

const app = express()

app.use(morgan('tiny'))
app.use(express.json())
app.use(sanitizeMongo())

// routes
app.use('/api/students', studentsRouter)
app.use('/api/courses', coursesRouter)

export default app