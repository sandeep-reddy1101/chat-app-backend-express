const contactsMethods = require('../models/contacts');

const express = require("express");
const router = express.Router();

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