import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Row, Col, Card, Input, Button, Typography, Space, Popconfirm } from "antd";
import dayjs from "dayjs";

const { Title, Text, Link } = Typography;

export default function Update() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 入力フォーム用
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "", // YYYY-MM-DD形式の文字列
    organizer: "",
    comment: "",
    files: [] as File[],
  });

  // 現在のデータ表示用
  const [originalData, setOriginalData] = useState<any>(null);

  // 削除済みファイル管理用
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get(`/api/events/${id}`)
      .then((res) => {
        setFormData({ ...res.data, files: [] });
        setOriginalData(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, files: Array.from(e.target.files!) }));
    }
  };

  // ファイル削除ボタン（確認ダイアログ付き）
  const handleRemoveFile = (fileName: string) => {
    if (window.confirm(`"${fileName}" を削除してよろしいですか？`)) {
      setRemovedFiles((prev) => [...prev, fileName]);
    }
  };

  // 更新処理
 // 更新処理
const handleSubmit = async () => {
  // 必須項目チェック
  if (!formData.name.trim()) {
    alert("名前は必須です");
    return;
  }
  if (!formData.date) {
    alert("日付は必須です");
    return;
  }
  if (!formData.organizer.trim()) {
    alert("主催者は必須です");
    return;
  }

  const data = new FormData();
  const dateString = dayjs(formData.date).format("YYYY-MM-DD");

  data.append("name", formData.name);
  data.append("description", formData.description || "");
  data.append("date", dateString);
  data.append("organizer", formData.organizer);
  data.append("comment", formData.comment || "");

  // 新規アップロードファイル
  formData.files.forEach((file) => data.append("files", file));

  // 既存ファイルで残すものだけをサーバに渡す
  const remainingFiles = originalData.file_path
    ? originalData.file_path
        .split(",")
        .filter((f: string) => !removedFiles.includes(f))
    : [];
  data.append("existing_files", remainingFiles.join(","));

  await axios.put(`/api/events/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  navigate("/app");
};


  // 削除処理
  const handleDelete = async () => {
    if (!window.confirm("このイベントを削除してもよろしいですか？")) return;

    try {
      await axios.delete(`/api/events/${id}`);
      alert("イベントを削除しました");
      navigate("/app"); // 一覧画面へ戻す
    } catch (error) {
      console.error("削除失敗:", error);
      alert("削除に失敗しました");
    }
  };

  const renderFiles = (filePath: string | undefined) => {
    if (!filePath) return null;
    return filePath
      .split(",")
      .filter((f) => !removedFiles.includes(f))
      .map((file) => (
        <div
          key={file}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Link
            href={`/api/files/${encodeURIComponent(file)}`}
            target="_blank"
          >
            {file}
          </Link>
          <Button
            size="small"
            danger
            onClick={() => handleRemoveFile(file)}
          >
            削除
          </Button>
        </div>
      ));
  };

  if (!originalData) return <div>読み込み中...</div>;

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>イベント編集</Title>
      <Row gutter={24}>
        {/* 左側: 現在のデータ */}
        <Col span={12}>
          <Card title="現在のデータ" style={{ marginBottom: 16 }}>
            <Text strong>名前: </Text>
            <Text>{originalData.name}</Text>
            <br />
            <Text strong>説明: </Text>
            <Text>{originalData.description}</Text>
            <br />
            <Text strong>日付: </Text>
            <Text>{originalData.date}</Text>
            <br />
            <Text strong>主催者: </Text>
            <Text>{originalData.organizer}</Text>
            <br />
            <Text strong>コメント: </Text>
            <Text>{originalData.comment}</Text>
            <br />
            {originalData.file_path && (
              <>
                <Text strong>添付ファイル:</Text>
                {renderFiles(originalData.file_path)}
              </>
            )}
          </Card>
        </Col>

        {/* 右側: 編集フォーム */}
        <Col span={12}>
          <Card title="編集フォーム">
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text strong>名前</Text>
                <Input name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div>
                <Text strong>説明</Text>
                <Input.TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Text strong>日付</Text>
                <Input type="date" name="date" value={formData.date} onChange={handleChange} />
              </div>
              <div>
                <Text strong>主催者</Text>
                <Input name="organizer" value={formData.organizer} onChange={handleChange} />
              </div>
              <div>
                <Text strong>コメント</Text>
                <Input.TextArea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Text strong>ファイル</Text>
                <Input type="file" multiple onChange={handleFileChange} />
              </div>
              <Space style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <Button type="primary" onClick={handleSubmit}>
                  更新
                </Button>
                <Button danger onClick={handleDelete}>
                  イベント削除
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
