const contactsMethods = require('../models/contacts');

const express = require("express");
const router = express.Router();

router.post('/get-bulk-contacts', (req, res) => {
    const contactsIdsList = JSON.parse(req.body.contactsIdsList);
    contactsMethods.getBulkContactsWithIds(contactsIdsList).then((response) => {
        if(response){
            res.json({data: response, flag: true, message: "successfully fetched contacts"})
        }else {
            res.json({data: [], flag: false, message: "Contacts not found"})
        }
    }).catch(err => {
        res.json({data: [], flag: false, message: err.message})
    })
})

module.exports = router;