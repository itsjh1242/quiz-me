export const DEFAULT_COLOR = {
  bg_color: "bg-blue-500",
  text_color: "text-white",
};

export const CopyClipBoard = async (id: string) => {
  const shareLink = process.env.REACT_APP_URL_QUIZ + id;
  try {
    await navigator.clipboard.writeText(shareLink);
    alert("복사 완료");
  } catch (e) {
    alert("복사 실패, " + e);
  }
};
