// ? ทุกหน้ามี header footer เหมือนกัน
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom"; // * ตัวแทนของสิ่งที่อยู่กึ่งกลาง component ต่างในภายใน MainLayout เช่น Homepage
import { TicketProvider } from "../contexts/TicketContext";

const MainLayout = () => {
  return (
    <>
      <TicketProvider>
        <NavBar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </TicketProvider>
    </>
  );
};

export default MainLayout;
