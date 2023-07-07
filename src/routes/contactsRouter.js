const contactsMethods = require('../models/contacts');

const express = require("express");
const router = express.Router();

// router get method to fetch all the contacts of user, using userId
// The response is array of contacts or empty array if no contacts present
router.get("/get-user-contacts/:userId", (req,res) => {
    const userId = req.params.userId;
    contactsMethods.getAllContactsWithUserId(userId).then((response) => {
        if(response) {
            res.json({data: response, flag: true, message: "Fetched user contacts successfully"})
        }else {
            res.json({data: [], flag: false, message: "Contact list is empty"})
        }
    }).catch(err => {
        res.json({data: [], flag: false, message: err.message})
    })
})

// router post method to create a new contact for the user.
// req.body is {userId: 'aksdh', nickName: "ksjdhf", contactPhoneNo: "sldf"}
// The response is array of the contact created or empty array if contact creation failed
router.post("/create-contact", (req, res) => {
    const contactData = req.body
    contactsMethods.createNewContact(contactData).then((response) => {
        if(response) { 
            res.json({data: response, flag: true, message: "Contact created successfully"})
        }else {
            res.json({data: [], flag: false, message: "Can't create the contact"})
        }
    }).catch(err => {
        res.json({data: [], flag: false, message: err.message})
    })
})

module.exports = router;