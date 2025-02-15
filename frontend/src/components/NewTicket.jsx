import { useEffect, useState } from "react";
import { useTickets } from "../contexts/TicketContext";

const NewTicket = () => {
  const { createNewTicket, setFilterStatus } = useTickets(); // ใช้ข้อมูลจาก context

  useEffect(() => {
    //* เมื่อมาหน้า NewTicket ให้เปลี่ยน filterStatus กลับไปที่ "all"
    setFilterStatus("all");
  });

  // * ส่งค่า title,desc,contact ไป home ผ่าน createNewTicket func (prop) ย้อนกลับ
  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    contact_info: "",
  });

  const handleFormChange = (event) => {
    setTicket((previousState) => ({
      ...previousState,
      [event.target.name]: event.target.value,
    }));
  };

  // async function createNewTicket(ticket) {
  //   try {
  //     // * ดึงข้อมูลจาก API
  //     const URL_API = "http://127.0.0.1:8000/tickets";
  //     const new_ticket = {
  //       title: ticket.title,
  //       description: ticket.description,
  //       contact_info: ticket.contact_info,
  //     };
  //     const response = await axios.post(URL_API, new_ticket);
  //     console.log("✅ Ticket created:", response.data);
  //   } catch (error) {
  //     console.error("❌ Failed to create ticket:", error);
  //   }
  // }

  // const onSubmitForm = async (e) => {
  //   e.preventDefault();
  //   console.log(ticket);
  //   await createNewTicketAPI(ticket); // * ส่งไปให้ home

  //   // ? Clear form
  //   setTicket({
  //     title: "",
  //     description: "",
  //     contact_info: "",
  //   });
  // };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    await createNewTicket(ticket); // * ส่งไปให้ home
    console.log(ticket);
    // ? Clear form
    setTicket({
      title: "",
      description: "",
      contact_info: "",
    });
  };

  return (
    // h-screen flex flex-col justify-center items-center gap-y-3 bg-indigo-200 p-6 rounded-md shadow-md
    <div className="flex flex-col justify-center items-center h-screen ">
      <form onSubmit={onSubmitForm}>
        <div className="flex flex-col gap-y-2 bg-white p-10 rounded-md shadow-md  w-auto md:w-[750px]">
          <h1 className="font-semibold text-2xl md:text-4xl text-center">
            Tell us about your problem
          </h1>
          <label htmlFor="title" className="text-lg text-gray-500">
            Title
          </label>
          <div className="bg-white rounded-md shadow-sm p-2 pl-3 border-2 ">
            <input
              id="title"
              type="text"
              className="focus:outline-none w-full"
              name="title"
              maxLength={255}
              placeholder="Type your problem's title here..."
              autoFocus
              required
              value={ticket.title}
              onChange={handleFormChange}
            />
          </div>

          <label htmlFor="description" className="text-lg text-gray-500">
            Description
          </label>
          <div className="bg-white rounded-md shadow-sm p-2 pl-3 border-2">
            <textarea
              id="description"
              type="text"
              className="focus:outline-none w-full"
              name="description"
              rows="3"
              placeholder="Describe your problem here..."
              required
              value={ticket.description}
              onChange={handleFormChange}
            ></textarea>
          </div>

          <label
            htmlFor="contact-information"
            className="text-lg text-gray-500"
          >
            Contact Information
          </label>
          <div className="bg-white rounded-md shadow-sm p-2 pl-3 border-2">
            <textarea
              id="contact-information"
              type="text"
              name="contact_info"
              className="focus:outline-none w-full"
              maxLength={255}
              rows="3"
              placeholder="Type contact information here..."
              required
              value={ticket.contact_info}
              onChange={handleFormChange}
            ></textarea>
          </div>
          <div className="">
            <button
              type="submit"
              className=" px-3 py-2 mt-5 rounded-lg font-semibold bg-blue-700/80 text-white hover:bg-blue-700 w-full"
            >
              {/* w-80 */}
              Submit Ticket
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewTicket;
