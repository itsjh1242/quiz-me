import { HashRouter, Route, Routes } from "react-router-dom";

// components
import Home from "./components/ui/home/page";
import CreateQuiz from "./components/ui/create/page";
import MyQuiz from "./components/ui/my-quiz/page";
import QuizDetail from "./components/ui/quiz-detail/page";
import Quizzes from "./components/ui/quizzes/page";
import ShareQuiz from "./components/ui/share/page";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateQuiz />} />
        <Route path="/my-quiz" element={<MyQuiz />} />
        <Route path="/my-quiz/detail/:uuid" element={<QuizDetail />} />
        <Route path="/quizzes/:uuid" element={<Quizzes />} />
        <Route path="/share/:uuid" element={<ShareQuiz />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
