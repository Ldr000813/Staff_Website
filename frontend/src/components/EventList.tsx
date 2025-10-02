import {Collapse,Button} from "antd";
import type {Event} from "../types";
import { fetchEvents } from "../api/events";
import {useState,useEffect} from "react";

const {Panel} = Collapse;

export default function EventList(){
  const [events,setEvents] =useState<Event[]>([]);

  useEffect(()=>{
    fetchEvents().then((data)=>{
      setEvents(data);
    })
  },[])

  return(
    <>
    <h2>イベント一覧</h2>
    <Collapse>
    {events.map((ev)=>{
      const files=ev.file_path?ev.file_path.split(","):[];
      return(
        <Panel 
        key={ev.id.toString()} header={`${ev.date} - ${ev.name} (${ev.organizer})`}
        >
          <p><strong>概要:</strong> {ev.description}</p>
          <p><strong>コメント:</strong> {ev.comment}</p>
          {files.length>0&&(
            <div>
              <strong>添付ファイル:</strong>
              <ul>
                {files.map((file, index) => (
                      <li key={index}>
                        <Button
                          type="link"
                          href={`http://localhost:8000/files/${encodeURIComponent(file)}`}
                          target="_blank"
                        >
                          {file}
                        </Button>
                      </li>
                    ))}
              </ul>
            </div>
          )}
        </Panel>
      )
    })}
    </Collapse>
    </>
  );
}