import { Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Survey from "./pages/survey";
import ThankYou from "./pages/thankYou";
import Closed from "./pages/closed";
import Admin from "./pages/admin";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/" element={<Landing />} />
      <Route path="/survey" element={<Survey />} />
      <Route path="/thankyou" element={<ThankYou />} />
      <Route path="/closed" element={<Closed />} />
    </Routes>
  );
}

export default App;