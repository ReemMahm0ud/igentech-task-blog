import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { LoginPage } from "./pages/LoginPage";
import { OtpPage } from "./pages/OtpPage";
import { ProtectedRoutes } from "./utils/ProtectedRoutes";
import { PublicRoute } from "./utils/PublicRoute";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostDetailsPage } from "./pages/PostDetailsPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/details/:id" element={<PostDetailsPage />} />
            <Route path="/createPost" element={<CreatePostPage />} />
          </Route>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify" element={<OtpPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;