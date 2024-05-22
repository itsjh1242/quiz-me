import CreateQuizPage from "./create";
import { NotUser } from "../Alert";
import useAuth from "../../lib/useAuth";

export default function CreateQuiz() {
  if (!useAuth()) return <NotUser />;
  return <CreateQuizPage />;
}
