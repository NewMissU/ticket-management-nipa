import axios from "axios";

const BASE_URL = `http://127.0.0.1:8000`; // * ตัวแปรเก็บ URL API=

export async function createNewTicketAPI(ticket) {
    try {
      // * ดึงข้อมูลจาก API
    //   const BASE_URL = "http://127.0.0.1:8000";
      const new_ticket = {
        title: ticket.title,
        description: ticket.description,
        contact_info: ticket.contact_info,
      };
      const response = await axios.post(`${BASE_URL}/tickets`, new_ticket);
      console.log("✅ Ticket created:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to create ticket:", error);
    }
  }

  // * ดึงข้อมูล Ticket จาก API
export const fetchTicketsAllStatusAPI = async () => {
    try {
      // * ดึงข้อมูลจาก API
      const response = await axios.get(`${BASE_URL}/tickets`);
      return response.data
    //   setTickets(response.data); // * นำข้อมูลที่ดึงมาใส่ใน state
    } catch (error) {
      console.log("ERROR", error);
    }
  };

export const fetchTicketsByStatusAPI = async (status) => {
  try{
    const response = await axios.get(`${BASE_URL}/tickets/${status}`);
    return response.data;
  }
  catch(error){
    console.log("ERROR", error);
  }
}


export const updateTicketAPI = async (ticket) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/tickets/${ticket.id}`,
        ticket
      );
      console.log("✅ Ticket updated:", response.data);
      return response.data;
    //  await fetchTickets();
    } catch (error) {
      console.error("❌ Failed to update ticket:", error);
      return null;
    }
  };
