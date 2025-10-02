import {Calendar,Badge} from "antd";
import { useNavigate } from "react-router-dom";
import locale from "antd/es/date-picker/locale/ja_JP";
import dayjs from "dayjs";

export default function CalendarView(){
  const navigate = useNavigate();
  const year=2025;
  
  type EventData = Record<string, { id: number; title: string }[]>;

  const events: EventData = {
    "2025-02-09": [{ id: 1, title: "企画会議" }],
    "2025-03-14": [{ id: 2, title: "新入留学生説明会" }],
    "2025-04-07": [{ id: 3, title: "新歓" }],
    "2025-04-08": [{ id: 4, title: "新歓" }],
    "2025-04-09": [{ id: 5, title: "新歓" }],
    "2025-04-21": [{ id: 6, title: "定例ミーティング初回" }],
    "2025-05-13": [{ id: 7, title: "Speak up英語版" }],
    "2025-05-15": [{ id: 8, title: "Speak up日本語版" }],
    "2025-08-15": [{ id: 9, title: "企画会議" }],
    "2025-09-16": [{ id: 10, title: "新入留学生説明会" }],
    "2025-11-09": [{ id: 11, title: "クローバー祭" }],
    "2025-11-10": [{ id: 12, title: "クローバー祭" }],
  };

  const dateCellRender=(value:dayjs.Dayjs)=>{
    const key=value.format("YYYY-MM-DD");
    const dayEvents=events[key] || [];
    return(
      <ul>
        {dayEvents.map((item)=>(
          <li 
          key={item.id}
          onClick={()=>navigate(`/datedetail/${item.title}`)}
          >
            <Badge status="success" text={item.title} />
          </li>
        ))}
      </ul>
    )
  }

  return(
    <>
    <h1>{year}年　年間カレンダー</h1>
    <div>
      {[...Array(12)].map((_, i)=>{
        const month=i+1;
        return(
          <div key={month}>
            <div>{month}月</div>
            <Calendar 
            fullscreen={false}
            locale={locale}
            value={dayjs(`${year}-${month}-01`)}
            dateCellRender={dateCellRender}
            />
          </div>
        )
      })}
    </div>
    </>
  )
}