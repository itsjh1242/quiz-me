import MyQuizPage from "./my-quiz";
import useAuth from "../../lib/useAuth";
import { NotUser } from "../Alert";

export default function MyQuiz() {
  if (!useAuth()) return <NotUser />;
  return <MyQuizPage />;
}
