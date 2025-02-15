import React, { useEffect, useRef, useState } from "react";
import { useTickets } from "../contexts/TicketContext";
import { TiTag } from "react-icons/ti";

const KanbanBoard = () => {
  const { tickets, updateTicketState, filterStatus, setFilterStatus } =
    useTickets(); // ใช้ข้อมูลจาก context
  const [selectedTicketForUpdate, setSelectedTicketForUpdate] = useState(null);
  // const [filterStatus, setFilterStatus] = useState("all");

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

  // ✅ คำนวณว่าจะแสดงกี่คอลัมน์ (all = 4, อื่นๆ = 2)
  let displayedStatuses = filterStatus === "all" ? statuses : [filterStatus];

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

  const submitUpdateForm = async (e) => {
    e.preventDefault();
    // เรียกฟังก์ชัน updateTicketState ที่อยู่ใน context เพื่ออัพเดต ticket
    await updateTicketState(selectedTicketForUpdate);
    dialogModal.current.close();
  };

  return (
    <>
      <div className="flex justify-center pt-6">
        <div className="flex items-center gap-4">
          <label htmlFor="filterStatus" className="text-lg font-semibold">
            Filter by status
          </label>
          <select
            id="filterStatus"
            className="p-2 border rounded-md shadow-sm bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">all</option>
            {statuses.map((status) => (
              <option
                key={status}
                value={status}
                className={`${statusColorsIn[status]}`}
              >
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* ✅ Grid ที่เปลี่ยนตาม Filter */}
      <div
        className={`grid gap-4 p-4 my-1 ${
          filterStatus === "all"
            ? "sm:grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1 w-3/4 mx-auto"
        }`}
      >
        {/* เปลี่ยนจาก statuses เป็น displayedStatuses จากที่แสดงทุก status เป็นตาม ที่เลือก */}
        {displayedStatuses.map((status) => (
          <div key={status}>
            <h2 className={`text-xl font-bold text-center capitalize pb-2`}>
              {status}
            </h2>
            <div
              className={`p-4 rounded-lg shadow-md min-h-[200px] bg-gray-200/70 ${statusColorsOut[status]} overflow-y-auto  h-screen `}
            >
              {/* <h2 className="text-xl font-bold text-center capitalize">
                  {status}
                </h2> */}
              <div
                className={`mt-2 space-y-2 ${
                  filterStatus === "all"
                    ? ""
                    : "grid-col-1 md:grid grid-cols-2 gap-x-5 "
                }`}
              >
                {/* ✅ แสดงเฉพาะ Ticket ที่มี status ตรงกัน */}
                {tickets
                  .filter((ticket) => ticket.status === status)
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`flex flex-col gap-1 p-3 bg-white rounded-md shadow-sm my-4 ${statusColorsIn[status]}  `}
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
                className={`focus:outline-none w-full `}
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
