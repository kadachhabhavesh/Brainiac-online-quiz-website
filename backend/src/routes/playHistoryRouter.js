const express = require('express')
const playHistoryModel = require('../model/playHistoryModel')
const quizModel = require('../model/quizModel')
const { findOne } = require('../model/UserModel')
const UserModel = require('../model/UserModel')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const playHistorys = await playHistoryModel.find()
        res.status(201).json(playHistorys)
    } catch (err) {
        res.status(400).send(err);
    }
})

router.post('/', async (req, res) => {
    console.log(req.body);

    // update quiz plays    
    try {
        let quizData = await quizModel.findOne({ _id: req.body.quizid })
        quizData.plays += 1
        const update = await quizModel.findOneAndUpdate({ _id: req.body.quizid }, quizData)
    } catch (err) {
        console.log(err)
    }

    // count total marks
    let totalMarks = 0;
    req.body.queandans.forEach(ques => {
        if (ques.iscorrect)
            totalMarks += ques.marks
    })
    const newPlayHistory = new playHistoryModel({
        studentid: req.userInfo._id,
        quizid: req.body.quizid,
        starttime: req.body.starttime,
        quizcompletiontime: req.body.quizcompletiontime,
        queandans: req.body.queandans,
        totalmarks: totalMarks
    })

    // save played quiz data
    try {
        const newPlayHistoryRes = await newPlayHistory.save()
        res.status(201).json(newPlayHistoryRes)
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

router.get('/result/:playhistoryid', async (req, res) => {
    let result = {}, quizhistory, allStuPlaySameQuiz, studentData, quizData;
    try {
        quizhistory = await playHistoryModel.findOne({ _id: req.params.playhistoryid })
        allStuPlaySameQuiz = await playHistoryModel.find({ quizid: quizhistory.quizid })
        studentData = await UserModel.findOne({ _id: quizhistory.studentid })
        quizData = await quizModel.findOne({ _id: quizhistory.quizid })
    } catch (err) {
        res.status(400).json({ msg: "server error" })
    }


    let allStuPlaySameQuizWithStuInfo = await Promise.all(
        allStuPlaySameQuiz && allStuPlaySameQuiz.map(async (play) => {
            const studentDetail = await UserModel.findOne({ _id: play.studentid });
            if (studentDetail) {
                const playWithStudent = { ...play._doc, student: studentDetail };
                delete playWithStudent.studentid;
                return playWithStudent;
            }
        })
    );
    allStuPlaySameQuizWithStuInfo = allStuPlaySameQuizWithStuInfo.filter(stu => stu)
    allStuPlaySameQuizWithStuInfo.sort((a, b) => {
        // Compare totalmarks
        if (a.totalmarks !== b.totalmarks) {
          return b.totalmarks - a.totalmarks; // Higher marks first
        } else {
          // Convert quizcompletiontime to total seconds for comparison
          const timeA = a.quizcompletiontime.min * 60 + a.quizcompletiontime.sec;
          const timeB = b.quizcompletiontime.min * 60 + b.quizcompletiontime.sec;
          return timeA - timeB; // Less time first
        }
      });

    result.currentstudent = studentData
    result.currentstudentplayhistory = quizhistory
    result.quiz = quizData
    result.allstudents = allStuPlaySameQuizWithStuInfo
    res.status(201).json(result)
})


router.get('/quizdetail/:quizid', async (req, res) => {
    let quizdetail = {}
    try {
        const quizinfo = await quizModel.findOne({ _id: req.params.quizid })
        let allResults = await playHistoryModel.find({ quizid: req.params.quizid })


        for (let index in allResults) {
            const student = await UserModel.findOne({ _id: allResults[index].studentid })
            if (student)
                allResults[index] = { ...allResults[index]._doc, studentDetail: student }
            else
                allResults[index] = null
        }
        allResults = allResults.filter(allRes => allRes)
        allResults.sort((a, b) => {
            // Compare totalmarks
            if (a.totalmarks !== b.totalmarks) {
              return b.totalmarks - a.totalmarks; // Higher marks first
            } else {
              // Convert quizcompletiontime to total seconds for comparison
              const timeA = a.quizcompletiontime.min * 60 + a.quizcompletiontime.sec;
              const timeB = b.quizcompletiontime.min * 60 + b.quizcompletiontime.sec;
              return timeA - timeB; // Less time first
            }
          });
        res.status(201).json({ quizinfo: quizinfo, allResults: allResults })
    } catch (err) {
        console.log(err);
        res.status(201).json({ msg: "server error" })
    }
})

module.exports = router  