import createDebug from 'debug'
import sanitizeBody from '../middleware/sanitizeBody.js'
import Course from '../models/Course.js'
import express from 'express'

const debug = createDebug('a2-mongo-crud:routes:courses')
const router = express.Router()

router.get('/', async (req, res) => {
  const schedule = await Course.find().populate('students')
  res.send({ data: formatResponseData(schedule) })
})

router.post('/', sanitizeBody, async (req, res) => {
  let newCourse = new Course(req.sanitizedBody)
  try {
    await newCourse.save()
    res.status(201).json({ data: formatResponseData(newCourse) })
  } catch (err) {
    debug(err)
    res.status(500).send({
      errors: [
        {
          status: '500',
          title: 'Server error',
          description: 'Problem saving document to the database.',
        },
      ],
    })
  }
})

router.get('/:id', async (req, res) => {
    try {
    const course = await Course.findById(req.params.id).populate('students')
    if (!course) throw new Error('Resource not found')
    res.json({ data: formatResponseData(course) })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})

const update =
  (overwrite = false) =>
  async (req, res) => {
    try {
      const course = await Course.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite,
          runValidators: true,
        }
      )
      if (!course) throw new Error('Resource not found')
      res.json({ data: formatResponseData(course) })
    } catch (err) {
      sendResourceNotFound(req, res)
    }
  }

router.patch('/:id', sanitizeBody, update(false) )
router.put('/:id', sanitizeBody, update(true) )

router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndRemove(req.params.id)
    if (!course) throw new Error('Resource not found')
    res.json({ data: formatResponseData(course) })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})


/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g. 'cars'
 * @param {Object | Object[]} payload An array or instance object from that collection
 * @returns
 */
function formatResponseData(payload, type = 'courses') {
  if (payload instanceof Array) {
    return payload.map((resource) => format(resource))
  } else {
    return format(payload)
  }

  function format(resource) {
    const { _id, ...attributes } = resource.toObject()
    return { type, id: _id, attributes }
  }
}

function sendResourceNotFound(req, res) {
  res.status(404).send({
    error: [
      {
        status: '404',
        title: 'Resource does not exist',
        description: `We could not find a course with id: ${req.params.id}`,
      },
    ],
  })
}

export default router
