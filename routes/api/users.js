const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateReset = require('../../validation/reset_password');
const validateUpdateUserInput = require('../../validation/updateUser');
const User = require('../../models/User');
const Patient = require('../../models/Patient');
const Doctor = require('../../models/Doctor');
const multer = require('multer');
const mkdirp = require('mkdirp');
// const Storage = multer.diskStorage({
//     destination(req, file, callback) {
//         callback(null, './images')
//     },
//     filename(req, file, callback) {
//         callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
//     },
// });

// const upload = multer({storage: Storage});

// router.post('/upload-image', upload.array('photo', 3), (req, res) => {
//     console.log(req.body.name,);
//     console.log('file', req.files)
//     console.log('body', req.body)
//     res.status(200).json({
//       message: 'success!',
//     })
//   })

router.post('/user-add', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        console.log(errors);
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: 'Email already exists' });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {
                            return res.status(200).json({message: 'User added successfully. Refreshing data...'})
                        }).catch(err => console.log(err));
                });
            });
        }
    });
});

router.post('/user-data', (req, res) => {
    User.find({}).select(['-password']).then(user => {
        if (user) {
            return res.status(200).send(user);
            console.log(user);
        }
    });
});

router.post('/user-delete', (req, res) => {
    console.log(req.body);
    User.deleteOne({ _id: req.body._id}).then(user => {
        if (user) {
            return res.status(200).json({message: 'User deleted successfully. Refreshing data...', success: true})
        }
    });
});

router.post('/user-update', (req, res) => {
    const { errors, isValid } = validateUpdateUserInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    console.log(req.body);

    User.findOne({ _id: req.body._id }).then(user => {
        console.log(req.body.password);
        if (user) {
            if (req.body.password) {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) throw err;
                        let update = req.body;
                        update.password = hash;
                        console.log(req.body);
                        User.updateOne({ _id: req.body._id}, {$set: req.body}, function(err, result) {
                            if (err) {
                                return res.status(400).json({ message: 'Unable to update user.' });
                            } else {
                                if(req.body.role == 'patient') {
                                    Patient.updateOne({_id: req.body._id}, {$set: update}, function(err, result1) {
                                        if (err) {
                                            return res.status(400).json({ msg: 'Unable to update user.' });
                                        } else {
                                            return res.status(200).json({ message: 'User updated successfully. Refreshing data...', success: true });
                                        }
                                    });
                                } else if (req.body.role == 'doctor') {
                                    Doctor.updateOne({_id: req.body._id}, {$set: req.body}, function(err, result1) {
                                        if (err) {
                                            return res.status(400).json({ msg: 'Unable to update user.' });
                                        } else {
                                            return res.status(200).json({ message: 'User updated successfully. Refreshing data...', success: true });
                                        }
                                    });
                                }
                            }
                        });
                    });
                });
            } else {
                User.updateOne({ _id: req.body._id}, {$set: req.body}, function(err, result) {
                    if (err) {
                        return res.status(400).json({ message: 'Unable to update user.' });
                    } else {
                        if(req.body.role == 'patient') {
                            Patient.updateOne({_id: req.body._id}, {$set: req.body}, function(err, result1) {
                                if (err) {
                                    return res.status(400).json({ msg: 'Unable to update user.' });
                                } else {
                                    return res.status(200).json({ message: 'User updated successfully. Refreshing data...', success: true });
                                }
                            });
                        } else if (req.body.role == 'doctor') {
                            Doctor.updateOne({_id: req.body._id}, {$set: req.body}, function(err, result1) {
                                if (err) {
                                    return res.status(400).json({ msg: 'Unable to update user.' });
                                } else {
                                    return res.status(200).json({ message: 'User updated successfully. Refreshing data...', success: true });
                                }
                            });
                        }
                    }
                });
            }
        } else {
            return res.status(400).json({ msg: 'Now user found to update.' });
        }
    });
});
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        console.error(errors);
        return res.json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.json({ msg: 'Email already exists' });
        } else {
            const newUser = new User(req.body);
            console.log('dfdfdfdfdfdfdfd', req.body);
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    console.log(newUser);
                    newUser
                        .save()
                        .then(user => {
                            if (user.role == 'patient') {
                                const userInfo = req.body;
                                userInfo._id = user._id;
                                userInfo.verified = user.verified;
                                const newPatient = new Patient(userInfo);
                                newPatient.save();
				                console.log(userInfo);
                                res.status(200).send(userInfo);
                            } else if (user.role == 'doctor') {
                                const userInfo = req.body;
                                userInfo._id = user._id;
                                console.log(userInfo);
                                const newDoctor = new Doctor(userInfo);
                                newDoctor.save();
				                console.log(userInfo);
                                res.status(200).send(userInfo);
                            }
                        }).catch(err => console.log(err));
                });
            });
        }
    });
});

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    console.log(req.body);
    if (!isValid) {
        console.log('validation error');
        return res.json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.json({ msg: 'Email not found' });
        }
        bcrypt.compare(req.body.password, user.password).then(isMatch => {
            if (isMatch) {
                let userInfo = JSON.parse(JSON.stringify(user));
                console.log(userInfo);
                if (userInfo.role === 'patient') {
                    Patient.findOne({_id: user._id}).exec(function(err, obj) {
                        if(err) {
                            console.error(err);
                        } else {
                            userInfo.firstname = obj.firstname;
                            userInfo.lastname = obj.lastname;
                            userInfo.homeaddress = obj.homeaddress;
                            userInfo.nationality = obj.nationality;
                            userInfo.occupation = obj.occupation;
                            userInfo.age = obj.age;
                            userInfo.phone = obj.phone;
                            userInfo.gender = obj.gender;
                            res.status(200).send(userInfo);
                        }
                    });
                } else if(userInfo.role === 'doctor') {
                    Doctor.findOne({_id:user._id}).exec(function(err, obj) {
                        if(err) {
                            console.error(err);
                        } else {
                            userInfo.firstname = obj.firstname;
                            userInfo.lastname = obj.lastname;
                            userInfo.homeaddress = obj.homeaddress;
                            userInfo.nationality = obj.nationality;
                            userInfo.mdcn = obj.mdcn;
                            userInfo.age = obj.age;
                            userInfo.phone = obj.phone;
                            userInfo.gender = obj.gender;
                            userInfo.type = obj.type;
                            userInfo.specialist = obj.specialist;
                            userInfo.area = obj.area;
                            userInfo.text = obj.text;
                            userInfo.rank = obj.rank;
                            res.status(200).send(userInfo);
                        }
                    });
                }
            } else {
                return res.json({ msg: 'Password incorrect' });
            }
        });
    });
});

router.post('/upload-avatar', function (req, res) {
    const filter = {_id: req.body._id};
    User.updateOne({_id: req.body._id}, {$set: req.body}, function(err, result){
        if (err) {
            res.status(400).json({msg: 'error'});
        } else {
            console.log(req.body);
            console.log(result);
            res.status(200).json(result);
        }
    });
});
// router.post('/update-patient', function (req, res) {
//     const 
// });

router.post('/reset-password', (req, res) => {
    const { errors, isValid } = validateReset(req.body);
    if (!isValid) {
        console.log('there is no user');
        console.log(errors);
        return res.status(200).json(errors);
    }
    const email = req.body.email;
    User.findOne({ email }).then(user => {
        if (!user) {
            // console.log('+++++ reset +++++');
            return res.status(404).json({ email: 'Email not found' });
        }
        console.log('hades is hell');
        return res.status(200).send(user);
    });
});
router.post('/add-image', (req, res) => {
    console.log(req.boy);
    res.status(200).send({"email": "email"})
});

router.get('/get-doctorlist', (req, res) => {
    console.log(req.body);
    Doctor.find().exec(
        function(err, users) {
            if(err) {
                console.error(err);
                res.status(400).send(error);
            } else {
                console.log(users);
                res.status(200).send(users);
            }
        }
    );
});

router.get('/doctors', (req, res) => {
    console.log(req.body)
    Doctor.find().exec(
        function(err, users) {
            if(err) {
                console.error(err);
                res.status(400).send(error);
            } else {
                console.log(users);
                res.status(200).send(users);
            }
        }
    );
});

module.exports = router;
