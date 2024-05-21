import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// lib
import { GetQuizResultByName } from "../../lib/quiz";

// ui
import { Button } from "../Button";
import { Badge } from "../Badge";

const QuizResultPage = () => {
  const { uuid, user } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState<{ [key: string]: any } | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (uuid && user) {
        const resultData = await GetQuizResultByName(uuid, user);
        setResult(resultData);
      }
    };
    fetchResult();
  }, [uuid, user]);

  if (!uuid || !user) return <div>잘못된 접근입니다.</div>;
  if (!result || result === null) return <div>로딩중...</div>;
  return (
    <div className="min-h-screen flex items-start justify-center py-12 max-sm:px-2">
      <div className="w-1/2 max-sm:w-full flex flex-col gap-2">
        <p className="text-3xl max-sm:text-xl font-bold">{result.participantName}님의 퀴즈 결과</p>
        <div className="flex flex-col gap-1">
          <div className="flex justify-start items-center gap-2">
            <Badge className="w-fit">퀴즈 명</Badge>
            <p className="text-xl max-sm:text-xl font-bold">{result.quiz.quizTitle}</p>
          </div>
          <div className="flex justify-start items-center gap-2">
            <Badge className="w-fit">퀴즈 제작자</Badge>
            <p className="text-xl max-sm:text-xl font-bold">{result.quiz.userName}</p>
          </div>
          <div className="flex justify-start items-center gap-2">
            <Badge className="w-fit">당신의 점수</Badge>
            <p className="text-xl max-sm:text-xl font-bold">{Math.floor((result.result.correctAnswer / result.result.totalQuestion) * 100)}점</p>
          </div>
          <div className="flex justify-between items-center"></div>
        </div>

        {Object.keys(result.quiz.quiz).map((item, index) => {
          return (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 my-4">
              <p className="text-lg font-semibold mb-4 max-sm:text-base">
                Q{index + 1}. {result.quiz.quiz[item].question}
              </p>
              <div className="space-y-3">
                {result.quiz.quiz[item].answer.map((ans: string, index: number) => {
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={result.quiz.quiz[item].question}
                        checked={result.quiz.quiz[item].selectedAnswer === index + 1 ? true : false}
                        value={index + 1}
                        className="form-radio text-indigo-600"
                        disabled
                      />
                      <p
                        className={`text-base text-gray-700 max-sm:text-xs ${
                          result.quiz.quiz[item].correct === index + 1
                            ? "font-bold text-green-600"
                            : result.quiz.quiz[item].selectedAnswer === index + 1
                            ? "font-bold text-red-500"
                            : ""
                        }`}
                      >
                        {ans}{" "}
                        {result.quiz.quiz[item].correct === index + 1 ? "(정답)" : result.quiz.quiz[item].selectedAnswer === index + 1 ? "(내가 고른 답)" : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <Button
          className="hover:bg-blue-600"
          method={() => {
            navigate("/");
          }}
        >
          나도 퀴즈 만들고 공유하기
        </Button>
      </div>
    </div>
  );
};

export default QuizResultPage;
