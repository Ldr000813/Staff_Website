// src/components/EventDetail.tsx
import { useParams } from "react-router-dom";

export default function EventDetail() {
  const { title } = useParams(); // :date がここで取得できる
  return <div>{title} のイベント詳細ページ</div>;
}