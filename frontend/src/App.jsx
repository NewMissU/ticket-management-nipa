import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import MainLayout from "./layouts/MainLayout";
import KanbanBoardPage from "./pages/KanbanBoardPage";
import NotFoundPage from "./pages/NotFoundPage";
// import TestKanban from "./components/TestKanban";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Homepage />} />
        <Route path="/kanban" element={<KanbanBoardPage />} />
        {/* <Route path="/test" element={<TestKanban />} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
