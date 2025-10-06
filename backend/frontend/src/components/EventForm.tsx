import { Form, Input, Button, DatePicker, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

const ACCEPTED_TYPES = [
  ".doc", ".docx", ".xls", ".xlsx",
  ".jpg", ".jpeg", ".png", ".gif",
];

export default function EventForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [form] = Form.useForm();

  const handleBeforeUpload = (file: File) => {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      alert(`${ext} は許可されていないファイル形式です`);
      return Upload.LIST_IGNORE;
    }
    setFiles((prev) => [...prev, file]);
    return false;
  };

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("organizer", values.organizer);
    formData.append("date", values.date.format("YYYY-MM-DD"));
    formData.append("description", values.description || "");
    formData.append("comment", values.comment || "");

    files.forEach((file) => formData.append("files", file));

    const response = await fetch("https://staff-website-backend.onrender.com/api/events/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "イベント登録に失敗しました");
      return;
    }

    form.resetFields();
    setFiles([]);
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Form.Item
        label="イベント名"
        name="name"
        rules={[{ required: true, message: "イベント名は必須です" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="主催者名"
        name="organizer"
        rules={[{ required: true, message: "主催者名は必須です" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="日付"
        name="date"
        rules={[{ required: true, message: "日付は必須です" }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item label="概要" name="description">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item label="コメント" name="comment">
        <Input.TextArea rows={2} />
      </Form.Item>

      <Form.Item label="添付ファイル">
        <Upload
          multiple
          beforeUpload={handleBeforeUpload}
          onRemove={(file) => setFiles((prev) => prev.filter((f) => f.name !== file.name))}
          fileList={files.map((file) => ({
            uid: file.name,
            name: file.name,
          }))}
          accept={ACCEPTED_TYPES.join(",")}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          itemRender={(originNode, file) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: 8 }}>{file.name}</span>
              {originNode} {/* ×ボタン */}
            </div>
          )}
        >
          <Button icon={<UploadOutlined />}>ファイルを選択</Button>
        </Upload>
        <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
          対応形式: Word (.doc, .docx), Excel (.xls, .xlsx), 画像 (.jpg, .jpeg, .png, .gif)
        </div>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          登録
        </Button>
      </Form.Item>
    </Form>
  );
}
