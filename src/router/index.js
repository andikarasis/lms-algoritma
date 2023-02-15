const express = require('express')
const router = express.Router()

// controller
const ModeratorController = require('../controllers/ModeratorController')
const AdminController = require('../controllers/AdminController')
const UserController = require('../controllers/UserController')
const BookController = require('../controllers/BookController')
const AlgoritmaController = require('../controllers/AlgoritmaController')

// middleware
const { checkModerator, checkAdmin, checkUser } = require('../middleware')

// moderator
router.post('/moderator/admin/create', ModeratorController.createAdmin)

// admin
router.post('/admin/login', AdminController.login)
router.get('/admin/users', checkAdmin, AdminController.listUser)
router.post('/admin/user/create', checkAdmin, AdminController.createUser)
router.post('/admin/user/penalty', checkAdmin, AdminController.userPenalty)
router.post('/admin/user/release-penalty', checkAdmin, AdminController.releaseUserPenalty)
router.get('/admin/profile', checkAdmin, AdminController.getProfile)
router.put('/admin/profile/update', checkAdmin, AdminController.updateProfile)
router.put('/admin/profile/password/update', checkAdmin, AdminController.changePassword)
router.post('/admin/book/add', checkAdmin, BookController.addingBook)
router.put('/admin/book/update', checkAdmin, BookController.updateBook)

// Mobile Action
router.post('/user/login', UserController.login)
router.get('/user/profile', checkUser, UserController.getProfile)

// book
router.get('/user/list-book', checkUser, BookController.getListBook)
router.get('/user/list-book-issue', checkUser, BookController.getListIssue)
router.post('/user/create-book-issue', checkUser, BookController.createIssue)
router.post('/user/book-return', checkUser, BookController.bookReturned)

// algoritma test
router.get('/reverse-alphabet', AlgoritmaController.reverseAlphabet)
router.post('/longest-string', AlgoritmaController.longestString)
router.post('/appearance', AlgoritmaController.appearance)
router.post('/matrix', AlgoritmaController.matrix)

module.exports = router
