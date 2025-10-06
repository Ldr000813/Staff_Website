// 型専用インポート
import axios from "axios";
import type { Event } from "../types";

const BASE_URL = "http://localhost:8000/api";

//イベント一覧
export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch(`${BASE_URL}/events/`);
  return res.json();
}

//新規イベント登録
export async function createEvent(eventData: Omit<Event, "id">): Promise<Event> {
  const res = await fetch(`${BASE_URL}/events/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });
  return res.json();
}

//イベント検索
export const searchEvents=async(keyword:string):Promise<Event[]>=>{
  const res=await axios.get(`${BASE_URL}/events/search`,{
    params:{keyword}
  });
  return res.data;
}
