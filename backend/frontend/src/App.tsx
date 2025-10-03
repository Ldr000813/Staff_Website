import { Typography,Space,Button } from "antd";
import { useNavigate } from "react-router-dom";
const {Title} = Typography;

export default function App(){
  const navigate=useNavigate();
  
  return(
    <div style={{padding:"24px"}}>
    <Title level={2}>イベント管理システム</Title>
    <Space>
      <Button type="primary" onClick={()=>navigate("/search")}>検索エンジンへ</Button>
      <Button onClick={()=>navigate("/eventform")}>新規登録</Button>
      <Button onClick={()=>navigate("/calenderview")}>年間カレンダー</Button>
      <Button onClick={()=>navigate("/eventlist")}>イベント一覧</Button>
    </Space>
    </div>
  )
}