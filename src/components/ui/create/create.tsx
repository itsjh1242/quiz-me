import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../lib/useAuth";
import { useBeforeunload } from "react-beforeunload";

// lib
import { UploadQuiz } from "../../lib/quiz";

// ui
import { Button } from "../Button";
import { Input } from "../Input";

const MAX_CREATE_VALUE = 10;

const CreateQuizPage = () => {
  // 새로고침 시 경고창
  useBeforeunload((event) => event.preventDefault());

  const user = useAuth();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<{ [key: string]: any }>({});
  const [quizCount, setQuizCount] = useState<number>(0);
  const [autoIncrement, setAutoIncrement] = useState<number>(0);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);

  // 퀴즈 추가
  const addQuiz = ({ q, a, c }: { q: string; a: string[]; c: number }) => {
    setQuiz((prev) => ({
      ...prev,
      [autoIncrement]: { question: q, answer: a, correct: c },
    }));
    setQuizCount(quizCount + 1);
    setAutoIncrement(autoIncrement + 1);
  };

  // 퀴즈 수정
  const editQuiz = ({ q, a, c }: { q: string; a: string[]; c: number }) => {
    setQuiz((prev) => ({
      ...prev,
      [selectedQuiz || 0]: { question: q, answer: a, correct: c },
    }));
  };

  // 퀴즈 삭제
  const deleteQuiz = () => {
    const prev = { ...quiz };
    delete prev[selectedQuiz || 0];
    setQuiz(prev);
    setQuizCount(quizCount - 1);
    setSelectedQuiz(null);
    setIsEditMode(false);
  };

  // 퀴즈 업로드
  const uploadQuiz = async () => {
    try {
      if (Object.keys(quiz).length >= 1) {
        const res = await UploadQuiz({ quiz, user });
        if (res !== null && res !== undefined) {
          return navigate("/share/" + res);
        } else {
          return alert("퀴즈 제목은 입력해야합니다.");
        }
      } else {
        alert("퀴즈는 최소 1개 이상 만들어야 합니다.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 ">
      <h1 className="text-4xl font-bold mb-8">새로운 퀴즈 만들기</h1>
      <div className="w-full sm:w-1/2 flex max-sm:flex-col justify-center items-start max-sm:items-center gap-4">
        {/* 퀴즈 추가 */}
        <AddQuizForm
          quiz={quiz}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          setSelectedQuiz={setSelectedQuiz}
          selectedQuiz={selectedQuiz}
          quizCount={quizCount}
          addQuiz={(q, a, c) => addQuiz({ q, a, c })}
          editQuiz={(q, a, c) => editQuiz({ q, a, c })}
          deleteQuiz={() => {
            deleteQuiz();
          }}
        />
        {/* 퀴즈 목록 */}
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md max-sm:max-w-sm min-h-96">
          <h2 className="text-2xl font-bold mb-4">퀴즈 목록</h2>
          {Object.keys(quiz).map((key, index) => {
            return (
              <p
                key={index}
                className="mb-2 font-bold cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={() => {
                  setSelectedQuiz(parseInt(key));
                  setIsEditMode(true);
                }}
              >
                {quiz[key].question}
              </p>
            );
          })}
        </div>
      </div>

      <Button
        className="fixed bottom-4 right-1/2 translate-x-1/2 w-1/2 max-sm:w-11/12 hover:bg-green-600"
        bg_color="bg-green-500"
        method={() => {
          uploadQuiz();
        }}
      >
        <p>퀴즈 생성</p>
      </Button>
    </div>
  );
};

interface QuizContextType {
  question: string | null;
  answer: (string | null)[];
  correct: string | null;
}

const AddQuizForm = ({
  quiz,
  isEditMode,
  setIsEditMode,
  selectedQuiz,
  setSelectedQuiz,
  quizCount,
  addQuiz,
  editQuiz,
  deleteQuiz,
}: {
  quiz: { [key: string]: any };
  isEditMode: boolean;
  setIsEditMode: any;
  selectedQuiz: number | null;
  setSelectedQuiz: any;
  quizCount: number;
  addQuiz: (q: string, answer: string[], c: number) => void;
  editQuiz: (q: string, answer: string[], c: number) => void;
  deleteQuiz: () => void;
}) => {
  const [quizContext, setQuizContext] = useState<QuizContextType>({ question: null, answer: [], correct: null });

  const AddQuizContext = (event: React.ChangeEvent<HTMLInputElement>, target: string, isAnswer?: boolean, answerIndex?: number) => {
    if (isAnswer) {
      if (typeof answerIndex === "number") {
        setQuizContext((prev) => ({
          ...prev,
          answer: prev.answer.map((ans, index) => (index === answerIndex ? event.target.value : ans)),
        }));
      }
    } else {
      setQuizContext((prev) => ({
        ...prev,
        [target]: event.target.value,
      }));
    }
  };

  const SaveQuizContext = () => {
    if (quizCount >= MAX_CREATE_VALUE) {
      return alert("만들 수 있는 퀴즈는 " + MAX_CREATE_VALUE + "개 입니다.");
    }
    const quiz: any = { ...quizContext };

    for (const key in quiz) {
      if (quiz[key] === null) {
        return alert("모든 항목을 작성해주세요.");
      }
    }
    if (quiz.answer.length < 2) {
      return alert("퀴즈에는 최소 2개의 답변이 있어야 합니다.");
    }
    if (quiz.answer.includes("" || null)) {
      return alert("퀴즈 답변에 빈 항목이 있습니다.");
    }

    const cleanedQuestion = quizContext.question || "";
    const cleanedAnswers = quizContext.answer.map((answer) => answer || "");
    const cleanedCorrect = parseInt(quizContext.correct || "");

    if (isEditMode) {
      editQuiz(cleanedQuestion, cleanedAnswers, cleanedCorrect);
      setIsEditMode(false);
    } else {
      addQuiz(cleanedQuestion, cleanedAnswers, cleanedCorrect);
    }
    setSelectedQuiz(null);
  };

  const addAnswerForm = () => {
    setQuizContext((prev) => ({
      ...prev,
      answer: [...prev.answer, null],
    }));
  };

  const removeAnswerForm = (index: number) => {
    setQuizContext((prev) => ({
      ...prev,
      answer: prev.answer.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    if (selectedQuiz !== null) {
      setQuizContext(quiz[selectedQuiz]);
    } else {
      setQuizContext({ question: null, answer: [], correct: null });
    }
  }, [quiz, selectedQuiz]);

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-sm:max-w-sm min-h-96">
      <h2 className="text-2xl font-bold mb-4">{isEditMode ? "퀴즈 수정" : "퀴즈 추가"}</h2>
      <div className="mb-4">
        <Input
          label="질문"
          value={quizContext.question || null}
          placeholder="질문을 입력하세요"
          method={(event: React.ChangeEvent<HTMLInputElement>, target: string) => {
            AddQuizContext(event, target);
          }}
          AddQuizContextTarget="question"
        />
      </div>
      {Object.keys(quizContext.answer).map((item, index) => {
        return (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-gray-700">{`답안 ${index + 1}`}</label>
              <Button
                bg_color="bg-red-500"
                className="px-3 py-1 hover:bg-red-600"
                method={() => {
                  removeAnswerForm(index);
                }}
              >
                삭제
              </Button>
            </div>
            <Input
              value={quizContext.answer[index] || null}
              placeholder={isEditMode ? quizContext.answer[index] || "답안 " + (index + 1) + "을 입력하세요." : "답안 " + (index + 1) + "을 입력하세요."}
              method={(event: React.ChangeEvent<HTMLInputElement>) => {
                AddQuizContext(event, "", true, index);
              }}
            />
          </div>
        );
      })}
      <div className="mb-4">
        <Button
          className="w-full"
          method={() => {
            addAnswerForm();
          }}
        >
          답안 추가
        </Button>
      </div>
      <div className="mb-4">
        {quizContext.answer.length >= 1 && (
          <>
            <label className="block text-gray-700 mb-2">정답은 몇 번인가요?</label>
            <div className="flex gap-4">
              {Object.keys(quizContext.answer).map((item, index) => {
                return (
                  <div key={index} className="flex justify-center items-center gap-1">
                    <input
                      type="radio"
                      name="correct"
                      value={index + 1}
                      checked={Number(quizContext.correct) === index + 1}
                      onChange={(event) => {
                        AddQuizContext(event, "correct", false);
                      }}
                    />
                    <label className="text-gray-700">{`답안 ${index + 1}`}</label>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div className="flex gap-2">
        {quizContext.answer.length >= 1 && (
          <Button
            className="w-1/2 hover:bg-blue-600"
            method={() => {
              SaveQuizContext();
            }}
          >
            저장
          </Button>
        )}
        {isEditMode ? (
          <Button
            className="w-1/2 hover:bg-red-600"
            bg_color="bg-red-500"
            method={() => {
              deleteQuiz();
            }}
          >
            삭제
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default CreateQuizPage;
