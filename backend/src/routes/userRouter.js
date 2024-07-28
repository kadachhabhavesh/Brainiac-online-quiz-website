const express = require("express");
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const userModel = require("../model/UserModel");
const quizModel = require("../model/quizModel");
const playHistoryModel = require("../model/playHistoryModel");
const UserModel = require("../model/UserModel");
const playlistModel = require("../model/playListModel");

const router = express.Router();


router.get("/admin", async (req, res) => {
  try {
    let student = [], teacher = [];
    let users = await UserModel.find()

    await Promise.all(users.map(async (user) => {
      if (user.usertype === "student") {
        let totalmarks = 0, correctmarks = 0
        const results = await playHistoryModel.find({ studentid: user._id });
        for (let result of results) {
          for (let quizresult of result.queandans) {
            totalmarks += quizresult.marks
            if (quizresult.iscorrect)
              correctmarks += quizresult.marks
          }
        }
        user = { ...user._doc, totalquiz: results.length, totalmarks: totalmarks, correctmarks: correctmarks }
        student.push(user)
      } else if (user.usertype === "teacher") {
        let totalquizCreated = 0
        const result = await quizModel.find({ creator: user._id });

        for (let playForQuiz in result) {
          const demo = await playHistoryModel.find({ quizid: result[playForQuiz]._id })
          totalquizCreated += demo.length
        }
        user = { ...user._doc, totalquizcreated: result.length, totalplays: totalquizCreated }
        teacher.push(user);
      }
    }));

    res.json({
      student: student,
      teacher: teacher,
    })
  } catch (err) {
    console.error(`Error fetching profile: ${err}`);
    res.status(400).send(err);
  }
})

router.post("/signup", async (req, res) => {
  const newUser = new userModel({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    usertype: req.body.usertype
  });
  try {
    // email already exists or not
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
      const signUpRes = await newUser.save()
      res.status(201).json(signUpRes)
    } else {
      res.status(400).json({ msg: "email already exists" })
    }
  } catch (err) {
    res.status(400).send(err)
  }

})

router.get("/getuserbyjwt", auth, (req, res) => {
  res.status(201).send(req.userInfo)
}
)
router.get("/:userid", async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.params.userid })
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json(err)
  }

})

router.post("/login", async (req, res) => {
  try {
    const userInfo = await userModel.findOne({ email: req.body.email })
    console.log(userInfo);
    if (userInfo!=null && userInfo.password === req.body.password) {
      const token = jwt.sign({ _id: userInfo._id.toString() }, process.env.SECRET_KEY)
      res.cookie("jwt", token);
      if (userInfo.usertype === "admin")
        res.status(201).json({ msg: "login successfull", admin: true })
      else
        res.status(201).json({ msg: "login successfull", admin: false })
    } else {
      res.status(400).json({"msg":"incorrect email or password","incorrect":true})
    }
  } catch (err) {
    res.status(400).send(err);
  }
});


router.post("/forgotpass", async (req, res) => {
  try {
    const userInfo = await userModel.findOneAndUpdate({ email: req.body.email }, {
      password: req.body.password
    })
    if(userInfo==null)
      res.status(400).json({msg:"incorrect email"})
    else
      res.status(201).json({msg:"password change successfuly"})
    
  } catch (err) {
    res.status(400).send(err);
  }
});

// router.get("/" ,async (req,res) => {
//     const users = await userModel.find()
//     res.json(users)
// })

router.get("/profile/:userid", async (req, res) => {
  let createdQuiz,playlist;
  try {
    let user = await userModel.findOne({ _id: req.params.userid });
    let results = await playHistoryModel.find({ studentid: req.params.userid });
    

    createdQuiz = await quizModel.find({ creator: req.params.userid })

      results = await Promise.all(results.map(async (result) => {
        const resultObj = result.toObject(); 
        const quiz = await quizModel.findOne({ _id: result.quizid });
        resultObj.quizinfo = quiz;
        if(quiz) 
          return resultObj
      }));
      results = results.filter(resu => resu)

    if (user.usertype === "teacher") {  
      playlist = await playlistModel.find({creator:req.params.userid})
      playlist = await Promise.all(playlist.map(async pl=>{
        pl=pl._doc
        pl.quizziz = await Promise.all( pl.quizziz.map(async quiz=>{ 
          const quizForId = await quizModel.findOne({_id:quiz})
          return quizForId
        }))
        return{...pl}
      }))

      let totalplays=0
      await Promise.all(createdQuiz.map(async (quiz)=>{
         const results = await playHistoryModel.find({quizid:quiz._id})   
         totalplays+=results.length;
      }))



      user = {...user._doc,totalplays:totalplays}
    }

    const profile = {
      userinfo: user,
      results: results,
      createdquiz: user.usertype === "teacher" && createdQuiz,
      playlist: user.usertype === "teacher" && playlist
    };
    res.status(201).json(profile);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

router.delete('/:userid', async (req, res) => {
  try {
    console.log(req.params.id);
    const delUser = await UserModel.findByIdAndDelete({ _id: req.params.userid })
    console.log(delUser);
    res.status(201).json(delUser)
  } catch (err) {
    res.status(400).send(err);
  }
})

router.put("/:userId", async (req, res) => {
  try {
    const updateUser = await UserModel.findByIdAndUpdate({ _id: req.params.userId }, req.body)
    console.log(updateUser);
    res.status(201).json(updateUser)
  } catch (err) {
    res.status(400).send(err);
  }
})


module.exports = router