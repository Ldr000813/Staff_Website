import type { Event } from "../types";

interface Props {
  event: Event;
}

export default function EventDetail({ event }: Props) {
  // 複数ファイル対応: カンマで分割
  const files = event.file_path ? event.file_path.split(",") : [];

  return (
    <div className="p-4">
      <h2>イベント詳細 (ID: {event.id})</h2>
      <p><strong>イベント名:</strong> {event.name}</p>
      <p><strong>主催者:</strong> {event.organizer}</p>
      <p><strong>日付:</strong> {event.date}</p>
      <p><strong>概要:</strong> {event.description}</p>
      <p><strong>コメント:</strong> {event.comment}</p>

      {files.length > 0 && (
        <div>
          <strong>添付ファイル:</strong>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                <a
                  href={`http://localhost:8000/files/${encodeURIComponent(file)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
