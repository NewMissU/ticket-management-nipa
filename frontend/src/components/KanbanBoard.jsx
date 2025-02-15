import React, { Children, useEffect, useRef, useState } from "react";
import { TiTag } from "react-icons/ti";
import { fetchTicketsAllStatusAPI, updateTicketAPI } from "../apis/api";

const KanbanBoard = () => {
  //  * เก็บข้อมูล Ticket ทั้งหมด
  const [tickets, setTickets] = useState([]);
  const [reloadTickets, setReloadTickets] = useState(false); // State สำหรับ trigger การโหลดข้อมูลใหม่
  const [selectedTicketForUpdate, setSelectedTicketForUpdate] = useState(null);

  const statuses = ["pending", "accepted", "resolved", "rejected"];

  const statusColorsOut = {
    pending: "border-t-4 border-yellow-500",
    accepted: "border-t-4  border-green-500",
    resolved: "border-t-4 border-blue-500",
    rejected: "border-t-4 border-red-500",
  };

  const statusColorsIn = {
    pending: "border-l-4 border-yellow-500",
    accepted: "border-l-4  border-green-500",
    resolved: "border-l-4 border-blue-500",
    rejected: "border-l-4 border-red-500",
  };

  const statusColorsModal = {
    pending: "bg-yellow-300/80",
    accepted: "bg-green-300/80",
    resolved: "bg-blue-300/80",
    rejected: "bg-red-300/80",
  };

  // const BASE_URL = `http://127.0.0.1:8000`; // * ตัวแปรเก็บ URL API

  // * ดึงข้อมูล Ticket จาก API
  // const fetchTickets = async () => {
  //   try {
  //     // * ดึงข้อมูลจาก API
  //     const response = await axios.get(`${BASE_URL}/tickets`);
  //     setTickets(response.data); // * นำข้อมูลที่ดึงมาใส่ใน state
  //   } catch (error) {
  //     console.log("ERROR", error);
  //   }
  // };

  // * useEffect ทำงานเพียงครั้งเดียว ใส่ [] ว่าง
  // useEffect(() => {
  //   fetchTickets();
  // }, []);

  //empty array ([]): การใส่ array ว่างหมายความว่า useEffect จะทำงานเพียงครั้งเดียวหลังจากการเรนเดอร์แรกเท่านั้น
  useEffect(() => {
    const loadTickets = async () => {
      const data = await fetchTicketsAllStatusAPI();
      setTickets(data);
    };
    loadTickets();
  }, [reloadTickets]); //* หากมีการเปลี่ยนแปลง state reloadTickets ให้โหลดข้อมูลใหม่ (เรียกใช้ useEffect)

  const dialogModal = useRef();

  const openModal = (ticket) => {
    setSelectedTicketForUpdate(ticket);
    dialogModal.current.showModal();
  };

  const closeModal = () => {
    setSelectedTicketForUpdate(null);
    dialogModal.current.close();
  };

  const closeOutsideModal = (e) => {
    if (e.target === dialogModal.current) {
      // * ถ้าคลิกข้างนอก Modal ให้ปิด
      setSelectedTicketForUpdate(null);
      dialogModal.current.close();
    }
  };

  const handleFormChange = (event) => {
    setSelectedTicketForUpdate((previousState) => ({
      ...previousState,
      [event.target.name]: event.target.value,
    }));
  };

  // const submitUpdateForm = (e) => {
  //   e.preventDefault();
  //   //Call api to update ticket
  //   updateTicket(selectedTicketForUpdate);
  //   dialogModal.current.close();
  //   console.log(selectedTicketForUpdate);
  // };

  const submitUpdateForm = async (e) => {
    e.preventDefault();
    //Call api to update ticket
    const updatedTicket = await updateTicketAPI(selectedTicketForUpdate); // * แก้ข้อมูลใน db แล้ว
    console.log("need: ", updatedTicket);
    setTickets((previousState) =>
      previousState.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );

    // ✅ โหลดข้อมูลใหม่ทั้งหมด ให้แสดงข้อมูลที่อัพเดทแล้ว
    // const newTickets = await fetchTickets(); // ดึงข้อมูล ticket ทั้งหมดใหม่
    // setTickets(newTickets);
    setReloadTickets(!reloadTickets);
    dialogModal.current.close();
    // console.log(selectedTicketForUpdate);
  };

  // const updateTicket = async (ticket) => {
  //   try {
  //     const response = await axios.put(
  //       `${BASE_URL}/tickets/${ticket.id}`,
  //       ticket
  //     );
  //     console.log("✅ Ticket updated:", response.data);
  //     fetchTickets();
  //   } catch (error) {
  //     console.error("❌ Failed to update ticket:", error);
  //   }
  // };

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 my-1">
        {statuses.map((status) => (
          <div key={status}>
            <h2 className="text-xl font-bold text-center capitalize pb-2">
              {status}
            </h2>
            <div
              className={`p-4 rounded-lg shadow-md min-h-[200px] bg-gray-200/70 ${statusColorsOut[status]} overflow-y-auto  h-screen`}
            >
              {/* <h2 className="text-xl font-bold text-center capitalize">
              {status}
            </h2> */}

              <div className="mt-2 space-y-2 ">
                {/* ✅ แสดงเฉพาะ Ticket ที่มี status ตรงกัน */}
                {tickets
                  .filter((ticket) => ticket.status === status)
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`flex flex-col gap-1 p-3 bg-white rounded-md shadow-sm my-4 ${statusColorsIn[status]} `}
                      onClick={() => openModal(ticket)}
                    >
                      <div className="flex gap-2 items-center">
                        <TiTag />
                        <p className="font-semibold">{ticket.title}</p>
                      </div>
                      <div className="flex gap-2">
                        <h1 className="text-sm font-semibold">Desc:</h1>
                        <p className="text-sm text-gray-700">
                          {ticket.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <h1 className="text-sm font-semibold">Contact:</h1>
                        <p className="text-sm text-gray-700">
                          {ticket.contact_info}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 text-right py-1">
                        {new Date(ticket.updated_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      <dialog
        ref={dialogModal}
        className="rounded-md w-[480px] justify-center items-center m-auto"
        onClick={closeOutsideModal}
      >
        <form className="p-6 justify-center items-center">
          <h3 className="font-semibold text-2xl text-center">Editing Ticket</h3>
          <div className="flex flex-col gap-y-2 rounded-md ">
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
                value={selectedTicketForUpdate?.title || ""}
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
                value={selectedTicketForUpdate?.description || ""}
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
                rows="3"
                maxLength={255}
                placeholder="Type contact information here..."
                required
                value={selectedTicketForUpdate?.contact_info || ""}
                onChange={handleFormChange}
              ></textarea>
            </div>

            <label htmlFor="status" className="text-lg text-gray-500">
              Status
            </label>
            <div
              className={` rounded-md shadow-sm p-2 pl-3 border-2 ${
                statusColorsModal[selectedTicketForUpdate?.status]
              }`}
            >
              <select
                name="status"
                id="status"
                className="focus:outline-none w-full"
                value={selectedTicketForUpdate?.status || ""}
                onChange={handleFormChange}
                required
              >
                <option value="pending">pending</option>
                <option value="accepted">accepted</option>
                <option value="resolved">resolved</option>
                <option value="rejected">rejected</option>
              </select>
            </div>

            <div className="flex flex-row gap-4 items-center justify-center ">
              <button
                type="button"
                className="  px-10 md:px-15 py-2 mt-5 rounded-lg font-semibold bg-blue-700/80 text-white hover:bg-blue-700"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-10 py-2 md:px-15 mt-5 rounded-lg font-semibold bg-blue-700/80 text-white hover:bg-blue-700"
                onClick={submitUpdateForm}
              >
                Edit
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default KanbanBoard;
