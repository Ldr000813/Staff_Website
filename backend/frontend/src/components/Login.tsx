import { useState } from "react";
import { Form, Input, Button, Modal} from "antd";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);

  // ログイン処理
  const handleLogin = async (values: { username: string; password: string }) => {
    const { username, password } = values;
    if (!username || !password) return;
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        navigate("/app");
      } else {
        if(typeof data.detail==="string"){alert(data.detail);}
        else if (Array.isArray(data.detail)){
          alert("英数字のみで5から20文字以内で入力してください")
        }else{
          alert("ログインに失敗しました");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 新規ユーザー登録
  const handleRegisterSubmit = async (values: { username: string; password: string }) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok) {
        setRegisterVisible(false);
      } else {
        if(typeof data.detail==="string"){
          alert(data.detail);
        }else if (Array.isArray(data.detail)) {
          alert("英数字のみで5から20文字以内で入力してください")
        }
      }
    } catch (err) {
      console.error(err);
      alert("ユーザー登録に失敗しました");
    }
  };

  return (
    <>
      <Form
        name="login"
        onFinish={handleLogin}
        layout="vertical"
        style={{ maxWidth: 300, margin: "0 auto", marginTop: 50 }}
        initialValues={{ username: "default", password: "" }}
      >
        <Form.Item
          label="Username(英数字5~20)"
          name="username"
          rules={[{ required: true, message: "ユーザー名を入力してください" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          label="Password(英数字5~20)"
          name="password"
          rules={[{ required: true, message: "パスワードを入力してください" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="default" block onClick={() => setRegisterVisible(true)}>
            新規ユーザー登録
          </Button>
        </Form.Item>
      </Form>

      {/* 新規ユーザー登録モーダル */}
      <Modal
        title="新規ユーザー登録"
        open={registerVisible}
        onCancel={() => setRegisterVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleRegisterSubmit} 
        initialValues={{ username: "default", password: "" }}>
          <Form.Item
            label="Username(英数字5~20)"
            name="username"
            rules={[{ required: true, message: "ユーザー名を入力してください" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password(英数字5~20)"
            name="password"
            rules={[{ required: true, message: "パスワードを入力してください" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登録
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
