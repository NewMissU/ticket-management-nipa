import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createNewTicketAPI,
  fetchTicketsAllStatusAPI,
  fetchTicketsByStatusAPI,
  updateTicketAPI,
} from "../apis/api";

// สร้าง Context สำหรับจัดการสถานะของ Ticket
const TicketContext = createContext();

// สร้าง Provider Component
export const TicketProvider = ({ children }) => {
  //  * เก็บข้อมูล Ticket ทั้งหมด
  const [tickets, setTickets] = useState([]);
  const [reloadTickets, setReloadTickets] = useState(false); // State สำหรับ trigger การโหลดข้อมูลใหม่
  const [filterStatus, setFilterStatus] = useState("all");

  // useEffect(() => {
  //   const loadTickets = async () => {
  //     const data = await fetchTicketsAPI();
  //     setTickets(data);
  //   };
  //   loadTickets();
  // }, []);

  useEffect(() => {
    const loadTickets = async () => {
      let data;
      console.log("filterStatus: ", filterStatus);
      if (filterStatus === "all") {
        data = await fetchTicketsAllStatusAPI();
      } else {
        data = await fetchTicketsByStatusAPI(filterStatus);
      }
      setTickets(data);
    };
    loadTickets();
    console.log("FROM useEffect | reloadTickets: ", reloadTickets);
  }, [filterStatus, reloadTickets]); //* หากมีการเปลี่ยนแปลง state reloadTickets ให้โหลดข้อมูลใหม่ (เรียกใช้ useEffect)

  // ฟังก์ชันที่ใช้สำหรับอัพเดต ticket
  const updateTicketState = async (updatedTicket) => {
    try {
      // เรียก API สำหรับอัพเดต ticket
      const updatedData = await updateTicketAPI(updatedTicket);
      if (updatedData) {
        // หากอัพเดตสำเร็จ ให้อัพเดต state
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === updatedData.id ? updatedData : ticket
          )
        );

        // Trigger การ reload ข้อมูลใหม่
        setReloadTickets(!reloadTickets);
        console.log("FROM updateTicketState | reloadTickets: ", reloadTickets);
      }
    } catch (error) {
      console.error("❌ Failed to update ticket:", error);
    }
  };

  // ฟังก์ชันที่ใช้สำหรับเพิ่ม ticket ใหม่
  const createNewTicket = async (newTicket) => {
    try {
      const createdTicket = await createNewTicketAPI(newTicket); // เรียก API สำหรับสร้าง ticket ใหม่
      // เพิ่ม ticket ใหม่ลงใน state
      setTickets((prevTickets) => [...prevTickets, createdTicket]);
      setReloadTickets(!reloadTickets); // Trigger การ reload ข้อมูลใหม่
      console.log("FROM createNewTicket | reloadTickets: ", reloadTickets);
    } catch (error) {
      console.error("❌ Failed to create ticket:", error);
    }
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        updateTicketState,
        createNewTicket,
        filterStatus,
        setFilterStatus,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

// Hook สำหรับใช้ข้อมูลใน context
export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketProvider");
  }
  return context;
};
