import useAuth from "../../lib/useAuth";
// ui
import { Button, LinkButton } from "../Button";
import { signInWithGoogle, signOut } from "../../../utils/firebase";

const HomePage = () => {
  const user = useAuth();

  const handleLogin = () => {
    signInWithGoogle();
  };
  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold mb-8">Quiz-Me</h1>
      <p className="text-lg mb-12">퀴즈를 만들고 친구들에게 공유하세요!</p>

      <div className="flex space-x-4">
        <LinkButton link="create" className="hover:bg-blue-600">
          퀴즈 만들기
        </LinkButton>
        <LinkButton link="my-quiz" bg_color="bg-green-500" className="hover:bg-green-600">
          내 퀴즈 보기
        </LinkButton>
      </div>
      <Button
        className="w-72 mt-4"
        method={() => {
          user ? handleLogout() : handleLogin();
        }}
      >
        {user ? "로그아웃" : "Google 로그인"}
      </Button>
    </div>
  );
};

export default HomePage;
