const User = require("../models/user");
const Student = require('../models/students');
const fs = require('fs');
const fastcsv = require('fast-csv');

// check if user exist then render the page
module.exports.profile = async function (req, res) {
    try {
        let user = await User.findById(req.user.id);
        if (user) {
            return res.render('profile', {
                id: req.user.id,
                currUser: user
            })
        } else {
            console.log("User not found");
            return res.redirect("/users/sign-in");
        }
    } catch (error) {
        console.log(error);
        return res.redirect("/users/sign-in");
    }
}

// add user if not exist
module.exports.register = async function (req, res) {
    console.log('registering new user');
    console.log(req.body);
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        if (req.body.password != req.body.confirmPass) {
            req.flash('error', 'The password and confirmation password do not match.')
            return res.redirect("/users/sign-up");
        }
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: User.generateHash(req.body.password),
        });
        if (user) {
            req.flash("success", "User registered");
            return res.redirect("/users/sign-in");
        } else {
            console.log("There is an error in creating the user");
            return res.redirect("/users/sign-up");
        }
    } else {
        // user already exist
        req.flash('error', 'User already registered.')
        return res.redirect("/users/sign-up");
    }
}

// redirect to logIn page on signOut
module.exports.signOut = function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash("success", "You have logged out");
        res.redirect('/users/sign-in');
    });
};

// render logIn page
module.exports.signIn = function (req, res) {
    return res.render('login', {
        error: req.query.error,
    });

};

//  render signUp page
module.exports.signUp = function (req, res) {
    return res.render('signUp')
}

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
    return res.redirect('/');
}

//download CSV
module.exports.downloadCsv = async function (req, res) {
    try {
        //  find students
        const students = await Student.find({});

        let data = '';
        let no = 1;
        // columns heading
        let csv = 'S.No, Name, Email, College, Placemnt, Contact Number, Batch, DSA Score, WebDev Score, React Score, Interview, Date, Result';

        // prepare data
        for (let student of students) {
            data =
                no +
                ',' +
                student.name +
                ',' +
                student.email +
                ',' +
                student.college +
                ',' +
                student.placement +
                ',' +
                student.contactNumber +
                ',' +
                student.batch +
                ',' +
                student.dsa +
                ',' +
                student.webd +
                ',' +
                student.react;

            if (student.interviews.length > 0) {
                for (let interview of student.interviews) {
                    data += ',' + interview.company + ',' + interview.date.toString() + ',' + interview.result;
                }
            }
            no++;
            csv += '\n' + data;
        }

        // add file to csv folder
        const dataFile = fs.writeFile('csv/data.csv', csv, function (error, data) {
            if (error) {
                console.log(error);
                return res.redirect('back');
            }
            //  make the file downloadble.
            console.log('Report generated successfully');
            return res.download('csv/data.csv');
        });
    } catch (error) {
        console.log(`Error in downloading file: ${error}`);
        return res.redirect('back');
    }
};