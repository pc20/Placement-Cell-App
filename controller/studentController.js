const Student = require('../models/students');
const Interview = require('../models/interview');

// render add student page
module.exports.addStudentPage = async function (req, res) {
    return res.render('addStudent');
};

// create student
module.exports.addStudent = function (req, res) {
    Student.findOne({ email: req.body.email }).then((student) => {
        if (student) {
            // if student already exist
            console.log('Email already exists');
            req.flash("error", "Email already exists");
            return res.redirect('back');
        } else {
            // else create a student
            Student.create({
                name: req.body.name,
                email: req.body.email,
                college: req.body.college,
                batch: req.body.batch,
                placement: req.body.placement,
                contactNumber: req.body.contactNumber,
                dsa: req.body.dsa,
                webd: req.body.webd,
                react: req.body.react,
            }).then((student) => {
                // flash message and redirect back to home page
                req.flash("success", "Student Added Successfully.");
                return res.redirect('/');
            }).catch((err) => {
                console.log("Error in creating student:", err);
                return res.redirect('back');
            })
        }
    });
};

// controller for deleting the students
module.exports.deleteStudent = async function (req, res) {
    const { id } = req.params;
    // first delete all the allocated interview for given student.
    Student.findById(id).then(async (student) => {
        if (student && student.interviews.length > 0) {
            for (let inter of student.interviews) {
                // find inteview iterate over students list and delete the given student from that list
                Interview.findOne({ companyName: inter.company }).then((interview) => {
                    if (interview) {
                        for (let i = 0; i < interview.students.length; i++) {
                            if (interview.students[i]._id.toString() === id) {
                                interview.students.splice(i, 1);
                                interview.save();
                                break;
                            }
                        }
                    }
                })
            }
        }
        // once all allocated interview got deleted, delete the student also
        await Student.findByIdAndDelete(id);
        req.flash("success", "Student deleted.");
        return res.redirect('/');
    }).catch((err) => {
        console.log(err);
        return res.redirect('back');
    });

};