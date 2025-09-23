import React from "react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";

/**
 * TaskCard компонент
 * -------------------
 * Энэ компонент нь даалгаврын мэдээллийг карт хэлбэрээр харуулна.
 * Төлөв (status), ач холбогдол (priority), явц (progress bar),
 * эхлэх болон дуусах огноо, хариуцсан хэрэглэгчид,
 * хавсралтын тоо зэргийг үзүүлдэг.
 */
const TaskCard = ({
  title, // string – Даалгаврын гарчиг
  description, // string – Даалгаврын товч тайлбар
  priority, // string – Даалгаврын ач холбогдол: Low | Medium | High
  status, // string – Даалгаврын төлөв: In Progress | Completed | etc.
  progress, // number – Гүйцэтгэлийн хувь
  createdAt, // date/string – Эхлэх огноо
  dueDate, // date/string – Дуусах огноо
  assignedTo, // array – Даалгаварт хуваарилагдсан хэрэглэгчдийн avatar жагсаалт
  attachmentCount, // number – Хавсралтын тоо
  completedTodoCount, // number – Дууссан дэд даалгаврын тоо
  todoChecklist, // array – Бүх дэд даалгаврын жагсаалт
  onClick, // function – Карт дээр дарахад дуудагдах функц
}) => {
  // Даалгаврын төлөвөөс хамаарч badge-ийн өнгө сонгоно
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  // Ач холбогдлоос хамаарч badge-ийн өнгө сонгоно
  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
      case "Medium":
        return "text-amber-500 bg-amber-50 border border-amber-500/10";
      default:
        return "text-rose-500 bg-rose-50 border border-rose-500/10";
    }
  };

  return (
    <div
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer"
      onClick={onClick}
    >
      {/* Төлөв ба ач холбогдлын badge */}
      <div className="flex items-end gap-3 px-4">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
        >
          {status === "In Progress"
            ? "Явагдаж байна"
            : status === "Completed"
            ? "Дууссан"
            : status}
        </div>
        <div
          className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}
        >
          {priority === "Low"
            ? "Бага ач холбогдол"
            : priority === "Medium"
            ? "Дунд ач холбогдол"
            : "Өндөр ач холбогдол"}
        </div>
      </div>

      {/* Гарчиг, тайлбар, гүйцэтгэл */}
      <div
        className={`px-4 border-l-[3px] ${
          status === "In Progress"
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-indigo-500"
            : "border-violet-500"
        }`}
      >
        <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
          {title}
        </p>

        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
          {description}
        </p>

        <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
          Гүйцэтгэл:{" "}
          <span className="font-semibold text-gray-700">
            {completedTodoCount} / {todoChecklist.length || 0}
          </span>
        </p>

        <Progress progress={progress} status={status} />
      </div>

      {/* Огноо ба хариуцсан хэрэглэгчид */}
      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-500">Эхлэх огноо</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(createdAt).format("YYYY оны MM сарын DD")}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-500">Дуусах огноо</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(dueDate).format("YYYY оны MM сарын DD")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo || []} />

          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
              <LuPaperclip className="text-primary" />
              <span className="text-xs text-gray-900">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
