export interface Event {
  id: number;
  name: string;
  organizer: string;
  date: string;
  description?: string;
  comment?: string;
  file_path?:string;
}
