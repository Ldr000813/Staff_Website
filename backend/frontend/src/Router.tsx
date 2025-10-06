import { BrowserRouter, Routes, Route} from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import EventForm from "./components/EventForm";
import CalendarView from "./components/CalendarView";
import DateDetail from "./components/DateDetail";
import EventList from "./components/EventList";
import Search from "./components/Search";
import Update from "./components/Update";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> {/*clear*/}
        <Route path="/app" element={<App />} /> {/*clear*/}
        <Route path="/search" element={<Search />} />{/*clear*/}
        <Route path="/eventform" element={<EventForm />} />{/*clear*/}
        <Route path="/eventlist" element={<EventList />} /> {/*clear*/}
        <Route path="/calenderview" element={<CalendarView />} />{/*clear*/}
        <Route path="/datedetail/:title" element={<DateDetail />} />{/*clear*/}
        <Route path="/update/:id" element={<Update />} />
        <Route path="*" element={<Login />} />{/**/}
      </Routes>
    </BrowserRouter>
  );
}