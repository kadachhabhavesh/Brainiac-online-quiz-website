import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from "./component/Home";
import Explore from "./component/Explore";
import PlayQuiz from "./component/PlayQuiz";
import CreateQuiz from "./component/CreateQuiz/CreateQuiz";
import Quiz from "./component/CreateQuiz/Quiz";
import Questions from "./component/CreateQuiz/Questions";
import Login from "./component/Login";
import SignUp from "./component/SignUp";
import QuizResult from "./component/QuizResult";
import Profile from "./component/Profile";
import PlayList from "./component/PlayList";
import AdminHome from "./component/admin/AdminHome";
import User from "./component/admin/User";
import Subject from "./component/admin/Subject";
import AdminQuiz from "./component/admin/Quiz";
import AdminPlayList from "./component/admin/PlayList";
import ForgotPass from "./component/ForgotPass";
import QuizDetail from "./component/QuizDetail";
import OTPConfirm from "./component/OTPConfirm";
import Students from "./component/admin/Students"
import Teachers from "./component/admin/Teachers"
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={ <Login/> } />
        <Route path="/OTPConfirm/:id" element={ <OTPConfirm /> } />
        <Route path="/signup" element={ <SignUp/> } />
        <Route path="/forgotpass" element={ <ForgotPass/> } />
        <Route path="/home" element={ <Home /> } >
          <Route index element={ <Explore /> }/>
          <Route path="createquiz/" element={ <CreateQuiz /> }/>
          <Route path="editquiz/:quizid" element={ <CreateQuiz /> }/>
          <Route path="playquiz/:quizid" element={ <PlayQuiz /> }/>
          <Route path="quizresult/:playhistoryid" element={ <QuizResult /> }/>
          <Route path="profile/:userid" element={ <Profile /> }/>
          <Route path="playlist" element={ <PlayList/> }/>
          <Route path="quizdetails/:quizid" element={ <QuizDetail/> }/>
        </Route>
        <Route path="/admin" element={ <AdminHome/> }>
          <Route index element={ <User/> } />
          <Route path="students" element={ <Students /> } />
          <Route path="teachers" element={ <Teachers /> } />
          <Route path="quiz" element={ <AdminQuiz/> } />
          <Route path="playlist" element={ <AdminPlayList/> } />
          <Route path="subject" element={ <Subject/> } />
          <Route path="userprofile/:userid" element={ <Profile /> } />
          <Route path="createquiz/" element={ <CreateQuiz /> }/>
          <Route path="editquiz/:quizid" element={ <CreateQuiz /> }/>
          <Route path="playquiz/:quizid" element={ <PlayQuiz /> }/>
          <Route path="quizdetails/:quizid" element={ <QuizDetail/> }/>
        </Route>

        {/* router result that access without login */}
        <Route path="/quizresult/:playhistoryid" element={ <QuizResult /> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
