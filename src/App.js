import { AppBar, Toolbar } from "@mui/material";
import React from "react";
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { NoticeSnackbar } from "./components/NoticeSnackbar";
import History from "./pages/History";
import Main from "./pages/Main";

function App() {
  const location = useLocation();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <div className="flex-grow-0 sm:flex-1"></div>
          <NavLink
            to="/main"
            className="font-bold select-none cursor-pointer self-stretch flex items-center"
          >
            💪 Jini’s Squat Challenge! 💪
          </NavLink>
          <div className="flex-grow"></div>
          <div className="self-stretch flex items-center">
            {location.pathname !== "/history" && (
              <NavLink
                className="select-none select-none self-stretch flex items-center"
                to="/history"
              >
                히스토리
              </NavLink>
            )}
            {location.pathname === "/history" && (
              <NavLink
                className="select-none select-none self-stretch flex items-center"
                to="/main"
              >
                뒤로가기
              </NavLink>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <NoticeSnackbar />
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/main" />} />
      </Routes>
    </>
  );
}

export default App;
