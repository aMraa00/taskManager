import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu"; // Энэ хэсгийг хэрэглэхгүй бол устгаж болно.
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]); // Бүх таскыг хадгалах төлөв
  const [tabs, setTabs] = useState([]); // Табуудын төлөв (Жишээ нь: "Бүгд", "Хүлээгдэж буй" гэх мэт)
  const [filterStatus, setFilterStatus] = useState("All"); // Шүүлт хийх статус, анхдагч утга нь "Бүгд"

  const navigate = useNavigate(); // Хуудас хооронд шилжихэд ашиглана

  // Бүх таскыг API-аас татаж авах функц
  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus, // Хэрэв шүүлт "Бүгд" бол хоосон, үгүй бол сонгосон статусаар шүүнэ
        },
      });

      // Хэрэв таск байгаа бол төлөвийг шинэчилнэ, үгүй бол хоосон массив өгнө
      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      // Статусын нэгдсэн мэдээллийг (statusSummary) боловсруулж, тогтсон дарааллаар таб үүсгэнэ
      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "Бүгд", count: statusSummary.all || 0 }, // Нийт таскууд
        { label: "Хүлээгдэж буй", count: statusSummary.pendingTasks || 0 }, // Хүлээгдэж буй таскууд
        { label: "Хийгдэж буй", count: statusSummary.inProgressTasks || 0 }, // Хийгдэж буй таскууд
        { label: "Дууссан", count: statusSummary.completedTasks || 0 }, // Дууссан таскууд
      ];

      setTabs(statusArray); // Табуудын төлөвийг шинэчилнэ
    } catch (error) {
      console.error("Хэрэглэгчдийг татаж авахад алдаа гарлаа:", error); // Алдаа гарвал консол дээр харуулна
    }
  };

  // Таск дээр дарахад дэлгэрэнгүй хуудас руу шилжих функц
  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  // `filterStatus` өөрчлөгдөх бүрд `getAllTasks` функцийг дуудна
  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {}; // Цэвэрлэх функц (component unmount хийгдэхэд ашиглагдана)
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Миний Таскууд">
      {" "}
      {/* Идэвхтэй цэсний нэр */}
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Миний Таскууд</h2>{" "}
          {/* Хуудасны гарчиг */}
          {/* Хэрэв таб байгаа бол TaskStatusTabs компонентыг харуулна */}
          {tabs?.[0]?.count > 0 && (
            <TaskStatusTabs
              tabs={tabs} // Табуудын мэдээлэл
              activeTab={filterStatus} // Идэвхтэй таб
              setActiveTab={setFilterStatus} // Таб өөрчлөгдөхөд төлөвийг шинэчлэх функц
            />
          )}
        </div>

        {/* Таскуудыг карт хэлбэрээр харуулах хэсэг */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks?.map((item) => (
            <TaskCard
              key={item._id} // Давтагдашгүй ID
              title={item.title} // Таскын гарчиг
              description={item.description} // Таскын тайлбар
              priority={item.priority} // Таскын тэргүүлэх зэрэглэл
              status={item.status} // Таскын статус
              progress={item.progress} // Таскын явц
              createdAt={item.createdAt} // Үүсгэгдсэн огноо
              dueDate={item.dueDate} // Хугацаа
              assignedTo={item.assignedTo?.map(
                (assignee) => assignee.profileImageUrl
              )} // Хуваарилагдсан хүмүүсийн зургууд
              attachmentCount={item.attachments?.length || 0} // Хавсралтын тоо
              completedTodoCount={item.completedTodoCount || 0} // Хийгдсэн todo-ийн тоо
              todoChecklist={item.todoChecklist || []} // Todo жагсаалт
              onClick={() => {
                handleClick(item._id); // Таск дээр дарахад дэлгэрэнгүй хуудас руу шилжинэ
              }}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
