const userMethods = require('../models/user');

const express = require("express");
const router = express.Router();

router.get('/get-user-with-number/:phoneNo', (req, res) => {
    const userPhoneNo = req.params.phoneNo;
    userMethods.getUserWithPhoneNo(userPhoneNo).then((response) => {
        if(response) {
            res.json({data: response, message: "User found successfully", flag: true})
        }else{
            res.json({data: [], message: "User not found", flag: false})
        }
    }).catch((err) => {
        res.json({data: [], message: err.message, user: false})
    })
})

router.get('/get-user-with-userId/:userId', (req, res) => {
    const userId = req.params.userId;
    userMethods.getUserWithUserId(userId).then((response) => {
        if(response) {
            res.json({data: response, message: "User found successfully", flag: true})
        }else{
            res.json({data: [], message: "User not found", flag: false})
        }
    }).catch((err) => {
        res.json({data: [], message: err.message, user: false})
    })
})

router.get('/get-all-users', (req, res) => {
    userMethods.getAllUsers().then((response) => {
        if(response) {
            res.json({data: response, message: "Fetched all users successfully", flag: true})
        }else {
            res.json({data: [], message: "Database is empty", flag: false})   
        }
    }).catch((err) => {
        res.json({data: [], message: err.message, flag: false})
    })
})

router.post('/verify-user', (req, res) => {
    console.log("here", req.body)
    const { phoneNo, password } = req.body;
    userMethods.verifyUserLogin(phoneNo, password).then((response) => {
        res.json(response)
    }).catch((err) => {
        res.json({flag: false, message: err.message, data: []})
    })
})

router.post('/insert-user', (req, res) => {
    const userData = req.body;
    userMethods.addUser(userData).then((response) => {
        res.json(response)
    }).catch((err) => {
        res.json({message: err.message, flag: false})
    })
})

router.get('/get-user-chats/:userId', (req, res) => {
    const userId = req.params.userId;
    userMethods.getChatsOfUser(userId).then((response) => {
        if(response){
            res.json({data: response, flag: true})
        }else {
            res.json({data: [], flag: false})
        }
    }).catch((err) => {
        res.json({message: err.message, flag: false})
    })
})

router.post('/add-contact', (req, res) => {
    const userId = req.body.userId
    const contactObj = JSON.parse(req.body.contactObj);
    userMethods.createContact(userId, contactObj).then((response) => {
        if(response) {
            res.json({message: "Contact added successfully", flag: true})
        }else {
            res.json({message: "Some error occured in the backend", flag: false})
        }
    }).catch((err) => {
        res.json({message: err.message, flag: false})
    })
})

module.exports = router;