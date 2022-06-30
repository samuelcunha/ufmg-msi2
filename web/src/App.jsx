import "./App.css";
import { Box } from "@mui/material";
import Header from "./components/header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RepositoryList from "./pages/repository/repository-list";
import RepositoryView from "./pages/repository/repository-view";
import Home from "./pages/home";

function App() {
  return (
    <Box mt={12}>
      <Header></Header>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="repositories" element={<RepositoryList />} />
          <Route path="repositories/:id" element={<RepositoryView />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
