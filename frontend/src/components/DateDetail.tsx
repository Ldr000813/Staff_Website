import { useParams } from "react-router-dom";

export default function EventDetail() {
  const { title } = useParams();

  // 日本語タイトルから英数字のファイル名に変換
  let keyword = ""; 
  if (title === "企画会議") {
    keyword = "planning_meeting";
  } else if (title === "定例ミーティング初回") {
    keyword = "regular_meeting";
  } else if (title === "クローバー祭") {
    keyword = "clover_festival";
  } else if (title === "新歓") {
    keyword = "orientation_event";
  } else if (title === "Speakup日本語版"||title === "Speakup英語版") {
    keyword = "speakup";
  } else {
    keyword = "default"; // 安全策
  }

  return (
    <div>
      <iframe
        src={`/static/${keyword}.html`} // public 配下の HTML を指定
        style={{ width: "100%", height: "600px", border: "none" }}
        title="Event Detail"
      />
    </div>
  );
}
