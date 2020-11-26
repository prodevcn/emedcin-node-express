const express = require('express');
const router=express.Router();
const User = require('../../models/User');
const Patient = require('../../models/Patient');
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');
const Connection = require('../../models/Connection');
const Activity = require('../../models/Activity');
router.get('/all', (req, res) => {
    const patients = [];
    const doctors = [];
    const institutes = [];
    const promise_patients = new Promise((resolve, reject) => {
        Patient.find().exec(
            function(err, users) {
                if(err) {
                    console.error(err);
                    reject(err);
                } else {
                    users.forEach(e => {
                        patients.push(e);
                    });
                    resolve(patients);
                }
            }
        );
    });
    const promise_doctors = new Promise((resolve, reject) => {
        Doctor.find().exec(
            function(err, users) {
                if(err) {
                    console.error(err);
                    reject(err);
                } else {
                    users.forEach(e => {
                        doctors.push(e);
                    });
                    resolve(doctors);
                }
            }
        );
    });
    Promise.all([promise_patients, promise_doctors]).then((value) => {
        const result = {patients: patients, doctors: doctors};
        res.status(200).json(result);
    }).catch((err) => {console.error(err); res.status(400).send(err)});
});
router.post('/set_connect', (req, res) => {
    let date = new Date();
    const newConnection = new Connection(req.body);
    newConnection.body = date;
    newConnection
        .save()
        .then(data => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err => {console.error(err); res.status(400).send(err)}));
});
router.post('/get_connections', (req, res) => {
    const patient_ids =[];
    const doctors_ids = [];
    const institutions_ids = [];
    const promise_sender = new Promise((resolve, reject) => {
        Connection.find({senderId: req.body._id}).exec(
            function(err, data) {
                if(err) {
                    console.error(err);
                    reject(err);
                } else {
                    data.forEach(e => {
                        if(e.receiverRole == 'patient') {
                            patient_ids.push(e.receiverId);
                        } else if (e.receiverRole == 'doctor') {
                            doctors_ids.push(e.receiverId);
                        } else {
                            institutions_ids.push(e.receiverId);
                        }
                    });
                    resolve();
                }
            }
        );
    });
    const promise_receiver = new Promise((resolve, reject) => {
        Connection.find({receiverId: req.body._id}).exec(
            function(err, data) {
                if(err) {
                    console.error(err);
                    reject(err);
                } else {
                    data.forEach(e => {
                        if(e.senderRole == 'patient') {
                            patient_ids.push(e.senderId);
                        } else {
                            doctors_ids.push(e.senderId);
                        }
                    });
                    resolve();
                }
            }
        );
    });
    Promise.all([promise_sender, promise_receiver]).then((value) => {
        const result = {con_patient_id: patient_ids, con_doctor_id: doctors_ids, con_institution_id: institutions_ids};
        res.status(200).json(result);
    }).catch((err) => {console.error(err); res.status(400).send(err);});
});
module.exports = router;