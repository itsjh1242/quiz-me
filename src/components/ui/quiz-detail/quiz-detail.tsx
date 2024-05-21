import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// lib
import { GetQuizById, GetParticipantById, DisableQuizById } from "../../lib/quiz";
import { CopyClipBoard } from "../../../utils/default";
import { isLogin } from "../../../utils/firebase";

// ui
import { Badge } from "../Badge";
import { Button } from "../Button";

const QuizDetailPage = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  if (!isLogin()) {
    navigate("/");
  }

  const [quiz, setQuiz] = useState<{ [key: string]: any } | null>(null);
  const [participant, setParticipant] = useState<{ [key: string]: any } | null>(null);
  const [selectedQuiz, SetSelectedQuiz] = useState<{ [key: string]: any } | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (uuid) {
        // Quiz Data
        const quizData = await GetQuizById(uuid as string);
        setQuiz(quizData);
        SetSelectedQuiz(quizData);
        // Participants Data
        const participantData = await GetParticipantById(uuid as string);
        setParticipant(participantData);
      }
    };
    fetchData();
  }, [uuid]);

  const disableQuiz = async () => {
    const warningMsg = window.confirm("일단 비활성화하면 다시 활성화할 수 없습니다.");
    if (warningMsg) {
      await DisableQuizById(uuid as string);
      navigate(-1);
    }
  };

  useEffect(() => {
    if (participant && selectedParticipant !== "") {
      const filteredParticipants = participant.filter((participant: { participantName: string }) => participant.participantName === selectedParticipant);
      SetSelectedQuiz(filteredParticipants[0].quiz);
    }
  }, [participant, selectedParticipant]);

  console.log(selectedQuiz);

  if (!quiz || !selectedQuiz) return <div className="w-screen h-screen flex justify-center items-center">Loading...</div>;
  return (
    <div className="min-h-screen flex items-start justify-center py-12 max-sm:px-2">
      <div className="w-1/2 max-sm:w-full flex flex-col">
        <p className="text-3xl max-sm:text-xl font-bold">{quiz.quizTitle}</p>
        <div className="flex gap-3 my-3">
          {quiz.available ? (
            <Badge bg_color="bg-green-500">
              <p>활성화</p>
            </Badge>
          ) : (
            <Badge bg_color="bg-gray-500">
              <p>비활성화</p>
            </Badge>
          )}
          <Badge>{quiz.participant}명 참여</Badge>
          <div
            className="cursor-pointer"
            onClick={() => {
              CopyClipBoard(uuid as string);
            }}
          >
            <Badge bg_color="bg-gray-500">링크 복사하기</Badge>
          </div>
        </div>
        <div className="flex flex-col gap-3 my-3">
          <p className="text-2xl max-sm:text-base">{selectedParticipant !== "" ? selectedParticipant + "님의 답안" : "퀴즈 답안"}</p>
          <div className="space-y-4">
            {Object.keys(selectedQuiz.quiz).map((item, index) => {
              return (
                <div key={index} className="bg-white shadow-md rounded-lg p-6">
                  <p className="text-lg font-semibold mb-4">
                    Q{index + 1}. {selectedQuiz.quiz[item].question}
                  </p>
                  <div className="space-y-2">
                    {Object.keys(selectedQuiz.quiz[item].answer).map((ans, index) => {
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={item}
                            value={1}
                            checked={(selectedQuiz.quiz[item].selectedAnswer || parseInt(selectedQuiz.quiz[item].correct)) === index + 1}
                            disabled
                            className="form-radio text-indigo-600"
                          />
                          <p className="text-base text-gray-700 max-sm:text-xs">{selectedQuiz.quiz[item].answer[ans]}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-3 my-3">
          <p className="text-2xl max-sm:text-base">퀴즈 참가자</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {participant && Object.keys(participant).length > 0 ? (
              Object.keys(participant).map((key, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-4 flex items-center justify-center hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => {
                    setSelectedParticipant(participant[key].participantName);
                  }}
                >
                  <span className="text-xl font-semibold text-gray-800 overflow-hidden whitespace-nowrap text-ellipsis">
                    {participant[key].participantName}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xl font-semibold text-gray-800 whitespace-nowrap">아직 퀴즈에 참여한 사람이 없네요.</p>
            )}
          </div>
        </div>
        <Button
          bg_color="bg-red-500"
          className="hover:bg-red-600"
          method={() => {
            quiz.available ? disableQuiz() : alert("이미 비활성화 상태인 퀴즈입니다.");
          }}
        >
          퀴즈 비활성화 하기
        </Button>
      </div>
    </div>
  );
};

export default QuizDetailPage;
