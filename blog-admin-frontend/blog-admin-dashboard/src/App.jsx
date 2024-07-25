import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { LoginPage } from "./pages/LoginPage";
import { OtpPage } from "./pages/OtpPage";
import { ProtectedRoutes } from "./utils/ProtectedRoutes";
import { PublicRoute } from "./utils/PublicRoute";
import { CreateUserPage } from "./pages/CreateUserPage";
import { PostsPage } from "./pages/PostsPage";
import { CreatePostPage } from "./pages/CreatePostPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/createUser" element={<CreateUserPage />} />
            <Route path="/posts" element={<PostsPage />} />
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
