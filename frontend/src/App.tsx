import { BrowserRouter, Routes, Route } from "react-router-dom";
import PostList from "./pages/PostList";
import Home from "./pages/Home";
import "./App.css";
import PostUpsertPage from "./pages/PostUpsert";
import PostDetail from "./pages/PostList/components/PostDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/create" element={<PostUpsertPage />} />
        <Route path="/posts/edit/:id" element={<PostUpsertPage />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
