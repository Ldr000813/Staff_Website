import { Typography,Space,Input,Button,List,Card } from "antd";
import { useState } from "react";
import {searchEvents} from "../api/events";
import type{Event} from "../types";
const {Title,Text,Link} = Typography;

export default function Search(){
  const [keyword,setKeyword]=useState("");
  const [events,setEvents]=useState<Event[]>([]);

  const handleSearch=async ()=>{
    const result=await searchEvents(keyword);
    setEvents(result);
  };

  return(
    <>
    <Title level={3}>イベント検索</Title>
    <Space style={{ marginBottom: 16 }}>
      <Input 
      placeholder="(例:奈良or山)"
      value={keyword}
      onChange={(e)=>setKeyword(e.target.value)}
      />
      <Button type="primary" onClick={handleSearch}>
        検索
      </Button>
    </Space>

    {/*結果表示*/}
    <List
    dataSource={events}
    renderItem={(ev)=>{
      const files=ev.file_path?ev.file_path.split(","):[];
      return(
        <List.Item>
          <Card 
          title={`${ev.date} - ${ev.name} (${ev.organizer})`}
          style={{
                  backgroundColor: "#fafafa",
                  boxShadow: "0 8px 8px rgba(0,0,0,0.1)",
          }}
          >
            <Text>{ev.description}</Text>
            {files.length>0&&(
              <div>
                <Text>添付ファイル:</Text>
                <List
                dataSource={files}
                renderItem={(file)=>(
                  <List.Item>
                    <Link 
                    href={`/api/files/${encodeURIComponent(
                      file
                    )}`}
                    target="_blank"
                    >{file}
                    </Link>
                  </List.Item>
                )}
                />
              </div>
            )}
          </Card>
        </List.Item>
      )
    }}
    />
    </>
  )
}