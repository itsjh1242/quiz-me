import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../lib/useAuth";
import { useBeforeunload } from "react-beforeunload";

// lib
import { InitQuizContext, UploadQuiz } from "../../lib/quiz";
import { isLogin } from "../../../utils/firebase";

// ui
import { RoundedButton } from "../Button";
import { Input } from "../Input";

const MAX_CREATE_VALUE = 10;

const CreateQuizPage = () => {
  // 새로고침 시 경고창
  useBeforeunload((event) => event.preventDefault());

  const user = useAuth();
  const navigate = useNavigate();
  if (!isLogin()) {
    navigate("/");
  }

  const [quiz, setQuiz] = useState<{ [key: string]: { question: string; answer1: string; answer2: string; answer3: string; correct: number } }>({});
  const [quizCount, setQuizCount] = useState<number>(0);
  const [autoIncrement, setAutoIncrement] = useState<number>(0);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");

  const questionRef = useRef<HTMLInputElement>(null);
  const answer1Ref = useRef<HTMLInputElement>(null);
  const answer2Ref = useRef<HTMLInputElement>(null);
  const answer3Ref = useRef<HTMLInputElement>(null);
  const correct1Ref = useRef<HTMLInputElement>(null);
  const correct2Ref = useRef<HTMLInputElement>(null);
  const correct3Ref = useRef<HTMLInputElement>(null);

  // 퀴즈 추가
  const addQuiz = ({ q, a1, a2, a3, c }: { q: string; a1: string; a2: string; a3: string; c: number }) => {
    setQuiz((prev) => ({
      ...prev,
      [autoIncrement]: { question: q, answer1: a1, answer2: a2, answer3: a3, correct: c },
    }));
    setQuizCount(quizCount + 1);
    setAutoIncrement(autoIncrement + 1);
  };

  // 퀴즈 수정
  const editQuiz = ({ q, a1, a2, a3, c }: { q: string; a1: string; a2: string; a3: string; c: number }) => {
    setQuiz((prev) => ({
      ...prev,
      [selectedQuiz]: { question: q, answer1: a1, answer2: a2, answer3: a3, correct: c },
    }));
  };

  // 퀴즈 삭제
  const deleteQuiz = () => {
    const prev = { ...quiz };
    delete prev[selectedQuiz];
    setQuiz(prev);
    setQuizCount(quizCount - 1);

    initQuiz(true);
    setIsEditMode(false);
  };

  // 퀴즈 업로드
  const uploadQuiz = async () => {
    try {
      if (Object.keys(quiz).length >= 1) {
        const res = await UploadQuiz({ quiz, user });
        if (res !== null || res !== undefined) {
          navigate("/share/" + res);
        } else {
          alert("Error.");
        }
      } else {
        alert("퀴즈는 최소 1개 이상 만들어야 합니다.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 답안 초기화
  const initQuiz = (isInit: boolean) => {
    InitQuizContext({
      qRef: questionRef,
      a1Ref: answer1Ref,
      a2Ref: answer2Ref,
      a3Ref: answer3Ref,
      c1Ref: correct1Ref,
      c2Ref: correct2Ref,
      c3Ref: correct3Ref,
      quiz,
      selectedQuiz,
      isInit: isInit,
    });
  };

  useEffect(() => {
    console.log(quiz);
  }, [quiz]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold mb-8">새로운 퀴즈 만들기</h1>
      <div className="w-full sm:w-1/2 flex max-sm:flex-col justify-center items-start max-sm:items-center gap-4">
        {/* 퀴즈 추가 */}
        <AddQuizForm
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          quizCount={quizCount}
          addQuiz={(q, a1, a2, a3, c) => addQuiz({ q, a1, a2, a3, c })}
          editQuiz={(q, a1, a2, a3, c) => editQuiz({ q, a1, a2, a3, c })}
          deleteQuiz={() => {
            deleteQuiz();
          }}
          initQuiz={(isInit) => initQuiz(isInit)}
          qRef={questionRef}
          a1Ref={answer1Ref}
          a2Ref={answer2Ref}
          a3Ref={answer3Ref}
          c1Ref={correct1Ref}
          c2Ref={correct2Ref}
          c3Ref={correct3Ref}
        />
        {/* 퀴즈 목록 */}
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md max-sm:max-w-sm ">
          <h2 className="text-2xl font-bold mb-4">퀴즈 목록</h2>
          {Object.keys(quiz).map((key, index) => {
            return (
              <p
                key={index}
                className="mb-2 font-bold cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={() => {
                  setSelectedQuiz(key);
                  setIsEditMode(true);
                }}
              >
                {quiz[key].question}
              </p>
            );
          })}
        </div>
      </div>

      <RoundedButton
        className="fixed bottom-4 right-1/2 translate-x-1/2 w-1/2 max-sm:w-11/12 hover:bg-green-600"
        bg_color="bg-green-500"
        method={() => {
          uploadQuiz();
        }}
      >
        <p>퀴즈 생성</p>
      </RoundedButton>
    </div>
  );
};

const AddQuizForm = ({
  isEditMode,
  setIsEditMode,
  quizCount,
  addQuiz,
  editQuiz,
  deleteQuiz,
  initQuiz,
  qRef,
  a1Ref,
  a2Ref,
  a3Ref,
  c1Ref,
  c2Ref,
  c3Ref,
}: {
  isEditMode: boolean;
  setIsEditMode: any;
  quizCount: number;
  addQuiz: (q: string, a1: string, a2: string, a3: string, c: number) => void;
  editQuiz: (q: string, a1: string, a2: string, a3: string, c: number) => void;
  deleteQuiz: () => void;
  initQuiz: (isInit: boolean) => void;
  qRef: React.RefObject<HTMLInputElement>;
  a1Ref: React.RefObject<HTMLInputElement>;
  a2Ref: React.RefObject<HTMLInputElement>;
  a3Ref: React.RefObject<HTMLInputElement>;
  c1Ref: React.RefObject<HTMLInputElement>;
  c2Ref: React.RefObject<HTMLInputElement>;
  c3Ref: React.RefObject<HTMLInputElement>;
}) => {
  const [quizContext, setQuizContext] = useState({ q: null, a1: null, a2: null, a3: null, c: null });
  const AddQuizContext = (event: React.ChangeEvent<HTMLInputElement>, target: string) => {
    setQuizContext((prev) => ({
      ...prev,
      [target]: event.target.value,
    }));
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

    // 수정모드라면 수정모드 종료
    if (isEditMode) {
      editQuiz(quiz.q, quiz.a1, quiz.a2, quiz.a3, quiz.c);

      initQuiz(true);
      setIsEditMode(false);
      return null;
    } else {
      addQuiz(quiz.q, quiz.a1, quiz.a2, quiz.a3, quiz.c);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      initQuiz(false);
    }
  }, [initQuiz, isEditMode]);

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-sm:max-w-sm">
      <h2 className="text-2xl font-bold mb-4">{isEditMode ? "퀴즈 수정" : "퀴즈 추가"}</h2>
      <div className="mb-4">
        <Input
          prop_ref={qRef}
          label="질문"
          placeholder="질문을 입력하세요"
          method={(event: React.ChangeEvent<HTMLInputElement>, target) => {
            AddQuizContext(event, target);
          }}
          AddQuizContextTarget="q"
        />
      </div>
      <div className="mb-4">
        <Input
          prop_ref={a1Ref}
          label="답안 1"
          placeholder="첫 번째 답안을 입력하세요"
          method={(event: React.ChangeEvent<HTMLInputElement>, target) => {
            AddQuizContext(event, target);
          }}
          AddQuizContextTarget="a1"
        />
      </div>
      <div className="mb-4">
        <Input
          prop_ref={a2Ref}
          label="답안 2"
          placeholder="두 번째 답안을 입력하세요"
          method={(event: React.ChangeEvent<HTMLInputElement>, target) => {
            AddQuizContext(event, target);
          }}
          AddQuizContextTarget="a2"
        />
      </div>
      <div className="mb-4">
        <Input
          prop_ref={a3Ref}
          label="답안 3"
          placeholder="세 번째 답안을 입력하세요"
          method={(event: React.ChangeEvent<HTMLInputElement>, target) => {
            AddQuizContext(event, target);
          }}
          AddQuizContextTarget="a3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">정답은 몇 번인가요?</label>
        <div className="flex gap-4">
          <input
            ref={c1Ref}
            type="radio"
            name="correct"
            value={1}
            onChange={(event) => {
              AddQuizContext(event, "c");
            }}
          />
          1번
          <input
            ref={c2Ref}
            type="radio"
            name="correct"
            value={2}
            onChange={(event) => {
              AddQuizContext(event, "c");
            }}
          />
          2번
          <input
            ref={c3Ref}
            type="radio"
            name="correct"
            value={3}
            onChange={(event) => {
              AddQuizContext(event, "c");
            }}
          />
          3번
        </div>
      </div>
      <div className="flex gap-2">
        <RoundedButton
          className="w-1/2 hover:bg-blue-600"
          method={() => {
            SaveQuizContext();
          }}
        >
          저장
        </RoundedButton>
        {isEditMode ? (
          <RoundedButton
            className="w-1/2 hover:bg-red-600"
            bg_color="bg-red-500"
            method={() => {
              deleteQuiz();
            }}
          >
            삭제
          </RoundedButton>
        ) : null}
      </div>
    </div>
  );
};

export default CreateQuizPage;
