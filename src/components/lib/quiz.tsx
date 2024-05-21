import { collection, query, where, getDoc, getDocs, orderBy, doc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../utils/firebase_config";
import { v4 as uuidv4 } from "uuid";

export const GetQuizzesUUID = async () => {
  try {
    const quizzesRef = collection(db, "quizzes");
    const quizzesSnap = await getDocs(quizzesRef);
    const uuids = quizzesSnap.docs.map((doc) => doc.id);
    return uuids;
  } catch (e) {
    console.error(e);
  }
};

export const GetQuizzesByUserName = async (userName: string) => {
  try {
    const quizzesRef = collection(db, "quizzes");
    const q = query(quizzesRef, where("userName", "==", userName), orderBy("timestamp", "desc"));

    const querySnapshot = await getDocs(q);
    const quizzes: any = [];
    querySnapshot.forEach((doc) => {
      quizzes.push({ id: doc.id, ...doc.data() });
    });
    return quizzes;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};

export const GetQuizById = async (id: string) => {
  try {
    const docRef = doc(db, "quizzes", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...docSnap.data() };
    } else {
      // 데이터 없음
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const GetParticipantById = async (id: string) => {
  try {
    const participantRef = collection(db, `participants/participantsCollection/${id}`);
    const participantSnap = await getDocs(participantRef);
    const documents = participantSnap.docs.map((doc) => doc.data());
    return documents;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const DisableQuizById = async (id: string) => {
  try {
    const docRef = doc(db, "quizzes", id);
    await updateDoc(docRef, {
      available: false,
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

const IncrementParticipantCount = async (id: string) => {
  try {
    const docRef = doc(db, "quizzes", id);
    const docSnap = await getDoc(docRef);
    const participantData = docSnap.data();

    if (participantData && typeof participantData.participant === "number") {
      await updateDoc(docRef, {
        participant: participantData.participant + 1,
      });
    } else {
      console.log("데이터베이스 파일 구조 오류");
    }
  } catch (e) {
    console.error(e);
  }
};

const CalcQuizResult = (quiz: { [key: string]: any }) => {
  let correctAnswer = 0;
  const totalQuestion = Object.keys(quiz.quiz);
  totalQuestion.map((item) => {
    if (quiz.quiz[item].isCorrect) {
      correctAnswer += 1;
    }
    return null;
  });

  return { status: "success", totalQuestion: totalQuestion.length, correctAnswer: correctAnswer };
};

export const Enroll = async ({ quiz, participantName }: { quiz: { [key: string]: any }; participantName: string }) => {
  const result = CalcQuizResult(quiz);
  const enrollData = { quiz: { ...quiz }, participantName: participantName, result: result };

  try {
    // participantName이 이미 존재하는지 확인
    const participantDocRef = doc(db, `participants/participantsCollection/${quiz.id}/${participantName}`);
    const participantSnapshot = await getDoc(participantDocRef);
    console.log(participantSnapshot);
    if (participantSnapshot.exists()) {
      // 이미 존재할 경우
      return { status: "already_exists", totalQuestion: 0, correctAnswer: 0 };
    } else {
      // 존재하지 않을 경우에만 추가
      await setDoc(participantDocRef, enrollData);
      IncrementParticipantCount(quiz.id);
      return result;
    }
  } catch (e) {
    console.error(e);
    return { status: "failed", totalQuestion: 0, correctAnswer: 0 };
  }
};

// 퀴즈 생성 시 작업 처리
export const UploadQuiz = async ({
  quiz,
  user,
}: {
  quiz: { [key: string]: { question: string; answer1: string; answer2: string; answer3: string; correct: number } };
  user: any;
}) => {
  // 퀴즈 이름 설정
  const quizTitle: any = prompt("퀴즈 제목을 입력해주세요.");
  if (quizTitle) {
    // uuid 생성
    const uuid = uuidv4();
    // 데이터 전처리
    const data = { id: uuid, quiz: { ...quiz }, quizTitle: quizTitle, userName: user.displayName, available: true, timestamp: Timestamp.now(), participant: 0 };
    // Firebase에 추가
    // await addDoc(collection(db, "quizzes"), data);
    try {
      await setDoc(doc(db, "quizzes", uuid), data);
      return uuid;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
};

// 퀴즈 추가 입력 폼 초기화 함수
export const InitQuizContext = ({
  qRef,
  a1Ref,
  a2Ref,
  a3Ref,
  c1Ref,
  c2Ref,
  c3Ref,
  quiz,
  selectedQuiz,
  isInit,
}: {
  qRef: React.RefObject<HTMLInputElement>;
  a1Ref: React.RefObject<HTMLInputElement>;
  a2Ref: React.RefObject<HTMLInputElement>;
  a3Ref: React.RefObject<HTMLInputElement>;
  c1Ref: React.RefObject<HTMLInputElement>;
  c2Ref: React.RefObject<HTMLInputElement>;
  c3Ref: React.RefObject<HTMLInputElement>;
  quiz: { [key: string]: any };
  selectedQuiz: string;
  isInit: boolean;
}) => {
  const correct = quiz[selectedQuiz].correct.toString();
  if (qRef.current && a1Ref.current && a2Ref.current && a3Ref.current && c1Ref.current && c2Ref.current && c3Ref.current) {
    qRef.current.value = isInit ? "" : quiz[selectedQuiz].question;
    a1Ref.current.value = isInit ? "" : quiz[selectedQuiz].answer1;
    a2Ref.current.value = isInit ? "" : quiz[selectedQuiz].answer2;
    a3Ref.current.value = isInit ? "" : quiz[selectedQuiz].answer3;
    c1Ref.current.checked = isInit ? false : correct === "1";
    c2Ref.current.checked = isInit ? false : correct === "2";
    c3Ref.current.checked = isInit ? false : correct === "3";
  }
};
