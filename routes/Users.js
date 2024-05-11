const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const users_controller = require('../controller/users_controller')
const { generateRandomString } = require('../password_generator/generator')

router.post('/', async (req, res) => {
    try {
        const { email, idAdmin } = req.body

        const password = generateRandomString(6, 10)

        bcrypt.hash(password, 10).then(async (hash) => {
            await users_controller.createUser(
                { email, password: hash },
                idAdmin
            )

            res.json({
                status: 200,
                message: 'registration success',
                data: { email: email, password: password },
            })
        })
    } catch (error) {
        res.status(500)
        res.json({
            status: 500,
            message: 'Internal Server Error',
            error: error,
        })
    }
})
router.get('/', async (req, res) => {
    try {
        console.log({ dirname: __dirname })
        const contacts = await users_controller.getUsers()
        // res.json(contacts)
        res.json({ status: 200, contacts: contacts })
    } catch (error) {
        res.status(500)
        res.json({
            status: 500,
            message: 'Internal Server Error',
            error: error,
        })
    }
})

router.put('/password/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const { message, password } = req.body

        console.log({ message: message, password: password })

        bcrypt.hash(password, 10).then(async (hash) => {
            await users_controller.updateUserPassword(userId, hash, message)

            res.json({ status: 200, message: 'password changed successfully' })
        })
    } catch (error) {
        res.status(500)
        res.json({
            status: 500,
            message: 'Internal Server Error',
            error: error,
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await users_controller.findUser(email)

        if (!user) {
            res.status(404)
            res.json({ status: 404, error: 'user does not exist' })
            return
        }

        bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                res.status(404)
                res.json({
                    status: 404,
                    error: 'wrong email and password combination',
                })
                return
            }

            res.json({ status: 200, message: 'login success' })
        })
    } catch (error) {
        res.status(500)
        res.json({
            status: 500,
            message: 'Internal Server Error',
            error: error,
        })
    }
})


router.get('/logs/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const logs = await users_controller.getUserLogs(userId)

        // Kirim file sebagai respons JSON
        res.status(200).json({
            status: 200,
            logs,
        })
    } catch (error) {
        res.status(500)
        res.json({
            status: 500,
            message: 'Internal Server Error',
            error: error,
        })
    }
})

router.get('/histories/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const histories = await users_controller.getUserHistories(userId)

        // Kirim file sebagai respons JSON
        res.status(200).json({
            status: 200,
            histories,
        })
    } catch (error) {
        res.status(500)
        res.json({
            status: 500,
            message: 'Internal Server Error',
            error: error,
        })
    }
})

module.exports = router
