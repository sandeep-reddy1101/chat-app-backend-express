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
    const { phoneNo, password } = req.body;
    userMethods.verifyUserLogin(phoneNo, password).then((response) => {
        res.json(response)
    }).catch((err) => {
        res.json({flag: false, message: err.message})
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

module.exports = router;