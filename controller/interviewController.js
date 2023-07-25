const Student = require('../models/students');
const Interview = require('../models/interview');

// display home page for employee
module.exports.home = async function (req, res) {
    Student.find({}).then((students) => {
        return res.render('interview_home', { students });
    }).catch((err) => {
        return res.redirect('back');
    })
};

// controller for render allocate interview page
module.exports.allocateInterview = function (req, res) {
    Student.find({}).then((students) => {
        return res.render('interview_allocation', { students });
    }).catch((err) => {
        console.log(err);
        return res.redirect('back');
    })
};

// controller for scheduling the interview
module.exports.scheduleInterview = async function (req, res) {
    // check if interview with given company exist
    Interview.findOne({ companyName: req.body.company }).then((existInterview) => {
        const studentObj = {
            id: req.body.id,
            date: req.body.date,
            result: 'Pending'
        };
        if (!existInterview) {
            // if not exist then create interview with company and student name
            Interview.create({ companyName: req.body.company, students: [] }).then((interview) => {
                interview.students.push(studentObj);
                interview.save();
            }).catch((err) => {
                console.log(err);
                return res.redirect('back');
            })
        } else {
            // if interview exist check for student
            for (let student of existInterview.students) {
                // if student id already exists
                if (student._id === req.body.id) {
                    req.flash("error", "Interview with this student already scheduled");
                    console.log('Interview with this student already scheduled');
                    return res.redirect('back');
                }
            }
            existInterview.students.push(studentObj);
            existInterview.save();
        }

        // find student and add allocated interview to their list
        Student.findById(req.body.id).then((student) => {
            const interview = {
                company: req.body.company,
                date: req.body.date,
                result: 'Pending',
            };
            student.interviews.push(interview);
            student.save();
        }).catch((err) => {
            console.log(err);
            return res.redirect('back');
        });
        // flash message
        req.flash("success", "Interview got scheduled");
        return res.redirect('/interview/home');
    });
};

module.exports.updateStatus = async function (req, res) {
    console.log(req.params);

    //update interview status for student
    Student.findById(req.params.id).then((student) => {
        if (student && student.interviews.length > 0) {
            for (let interview of student.interviews) {
                if (interview.company === req.body.companyName) {
                    interview.result = req.body.companyResult;
                    if (req.body.companyResult === 'Selected') {
                        student.placement = 'Placed';
                    }
                    student.save();
                    break;
                }
            }
        }
    }).catch((err) => {
        console.log(err);
        return res.redirect('back');
    });

    //update interview status for table
    Interview.findOne({ companyName: req.body.companyName }).then((interview) => {
        if (interview) {
            for (let std of interview.students) {
                /// compare student id and id passed in params
                if (std._id.toString() === req.params.id) {
                    std.result = req.body.companyResult;
                    interview.save();
                }
            }
        }
    }).catch((err) => {
        console.log(err);
        return res.redirect('back');
    });
    req.flash("success", "Status got Updated.");
    return res.redirect('back');
};