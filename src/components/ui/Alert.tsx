import { LoginButton } from "./Button";

export const NotUser = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">로그인 후 이용가능합니다.</h1>
        <LoginButton className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">로그인</LoginButton>
      </div>
    </div>
  );
};

export const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">로딩중입니다...</h1>
      </div>
    </div>
  );
};

export const WrongAccess = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">잘못된 접근입니다...</h1>
      </div>
    </div>
  );
};
