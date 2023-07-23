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
            console.log('Email already exists');
            req.flash("success", "Email already exists");
            return res.redirect('back');
        } else {
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
                return res.redirect('/');
            }).catch((err) => {
                console.log("Error in creating student:", err);
                return res.redirect('back');
            })
        }
    });
};

module.exports.deleteStudent = async function (req, res) {
    const { id } = req.params;
    Student.findById(id).then(async (student) => {
        if (student && student.interviews.length > 0) {
            for (let inter of student.interviews) {
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
        await Student.findByIdAndDelete(id);
        console.log
        return res.redirect('/');
    }).catch((err) => {
        console.log(err);
        return res.redirect('back');
    });

};