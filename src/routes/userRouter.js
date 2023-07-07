const userMethods = require('../models/user');

const express = require("express");
const router = express.Router();


// router get method to get the user details except the password, using user phoneNo.
// The response is user document or details without the password
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

// router get method to get the user details except the password, using userId
// The response is user document or details without the password
router.get('/get-user-with-userId/:userId', (req, res) => {
    const userId = req.params.userId;
    userMethods.getUserWithUserId(userId).then((response) => {
        if(response) {
            res.json({data: response, message: "User found successfully", flag: true})
        }else{
            res.json({data: null, message: "User not found", flag: false})
        }
    }).catch((err) => {
        res.json({data: null, message: err.message, user: false})
    })
})


// router get method to fetch all the users present in the database.
// The response is all user information in an array
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


// router post method to verify the user login
// req.body is an object with user login information from the client.
// body = {phoneNo: 134343, password: "adsjk"}
// The response we are sending to the client is json object with data, flag and message keys.
// EX: {data: [userDocument], message: "message", flag: true}. the data is null if user not verified
router.post('/verify-user', (req, res) => {
    const { phoneNo, password } = req.body;
    userMethods.verifyUserLogin(phoneNo, password).then((response) => {
        res.json(response)
    }).catch((err) => {
        res.json({flag: false, message: err.message, data: null})
    })
})


// router post method to insert the user in the database i.e., creating a user account
// req.body is an object with user information from client website.
// body = {firstName: "abcd", lastName: "abcd", phoneNo: 1334, password: "dasfk", profilePic: "imageURL"}
// The response we are sending to the user is a json object with flag and message keys. 
// EX: {flag: true, message: "akdsf"}
router.post('/insert-user', (req, res) => {
    const userData = req.body;
    userMethods.createNewUser(userData).then((response) => {
        res.json(response)
    }).catch((err) => {
        res.json({message: err.message, flag: false})
    })
})

module.exports = router;