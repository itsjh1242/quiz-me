import QuizDetailPage from "./quiz-detail";
import useAuth from "../../lib/useAuth";
import { NotUser } from "../Alert";

export default function QuizDetail() {
  if (!useAuth()) return <NotUser />;
  return <QuizDetailPage />;
}
