import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../lib/useAuth";

import { GetQuizzesByUserName } from "../../lib/quiz";
import { isLogin } from "../../../utils/firebase";

// ui
import { Badge } from "../Badge";

const MyQuizPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  if (!isLogin()) {
    navigate("/");
  }

  const displayName = user?.displayName || "";
  const [quizzes, setQuizzes] = useState<{ [key: string]: any }>([]);
  useEffect(() => {
    // 사용자 이름으로 퀴즈 가져오기
    const fetchQuizzes = async () => {
      const res = await GetQuizzesByUserName(displayName);
      const simplifiedQuizzes = res.map((quiz: any) => ({
        id: quiz.id,
        quiz: quiz.quiz,
        quizTitle: quiz.quizTitle,
        userName: quiz.userName,
        available: quiz.available,
        timestamp: quiz.timestamp,
      }));
      setQuizzes(simplifiedQuizzes);
    };

    if (displayName) {
      fetchQuizzes();
    }
  }, [displayName]);

  const handlerMoveToDetail = (quiz: any) => {
    navigate("/my-quiz/detail/" + quiz.id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 max-sm:px-3">
      <h1 className="text-4xl font-bold mb-8">내 퀴즈</h1>
      <div className="w-full max-w-md">
        {quizzes.map((quiz: any) => (
          <div
            key={quiz.id}
            className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center cursor-pointer hover:shadow-lg transition duration-300"
            onClick={() => {
              handlerMoveToDetail(quiz);
            }}
          >
            <p className="w-2/3 truncate">{quiz.quizTitle}</p>
            <Badge bg_color={quiz.available ? "bg-green-500" : "bg-gray-500"}>{quiz.available ? "활성화" : "비활성화"}</Badge>
          </div>
        ))}
        {quizzes.length === 0 && <p className="text-gray-500">퀴즈가 없습니다.</p>}
      </div>
    </div>
  );
};

export default MyQuizPage;
