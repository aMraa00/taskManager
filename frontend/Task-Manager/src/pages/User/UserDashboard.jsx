import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth"; // Хэрэглэгчийн нэвтрэлт
import { useContext } from "react";
import { UserContext } from "../../context/userContext"; // Хэрэглэгчийн мэдээлэл авах
import DashboardLayout from "../../components/layouts/DashboardLayout"; // Хуудасны үндсэн загвар
import { useNavigate } from "react-router-dom"; // Хуудас хооронд шилжих
import axiosInstance from "../../utils/axiosInstance"; // API холболт
import { API_PATHS } from "../../utils/apiPaths"; // API замууд
import moment from "moment"; // Огноо цаг форматлах
import { addThousandsSeparator } from "../../utils/helper"; // Тоо форматлах туслах функц
import InfoCard from "../../components/Cards/InfoCard"; // Товч мэдээллийн карт
import { LuArrowRight } from "react-icons/lu"; // Дүрс тэмдэг
import TaskListTable from "../../components/TaskListTable"; // Даалгаврын хүснэгт
import CustomPieChart from "../../components/Charts/CustomPieChart"; // Бялуу график
import CustomBarChart from "../../components/Charts/CustomBarChart"; // Баар график

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"]; // Графикын өнгөний сонголт

const UserDashboard = () => {
  // Хэрэглэгчийн нэвтрэлт шалгах
  useUserAuth();

  // Context-оос хэрэглэгчийн мэдээлэл авах
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  // Төлөвүүд
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // Графикийн өгөгдөл бэлтгэх функц
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    // Бялуу графикийн өгөгдөл
    const taskDistributionData = [
      { status: "Хүлээгдэж буй", count: taskDistribution?.Pending || 0 },
      { status: "Хийгдэж буй", count: taskDistribution?.InProgress || 0 },
      { status: "Дууссан", count: taskDistribution?.Completed || 0 },
    ];
    setPieChartData(taskDistributionData);

    // Баар графикийн өгөгдөл
    const PriorityLevelData = [
      { priority: "Бага", count: taskPriorityLevels?.Low || 0 },
      { priority: "Дунд", count: taskPriorityLevels?.Medium || 0 },
      { priority: "Өндөр", count: taskPriorityLevels?.High || 0 },
    ];
    setBarChartData(PriorityLevelData);
  };

  // Dashboard-ийн өгөгдөл татах
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Хэрэглэгчийн өгөгдөл татахад алдаа гарлаа:", error);
    }
  };

  // “Бүгдийг үзэх” товчлуур
  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  // Компонент ачаалагдах үед өгөгдөл татах
  useEffect(() => {
    getDashboardData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Өглөөний мэнд! {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>

        {/* Товч мэдээллийн картууд */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Нийт даалгавар"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
            color="bg-primary"
          />

          <InfoCard
            label="Хүлээгдэж буй даалгавар"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Pending || 0
            )}
            color="bg-violet-500"
          />

          <InfoCard
            label="Хийгдэж буй даалгавар"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0
            )}
            color="bg-cyan-500"
          />

          <InfoCard
            label="Дууссан даалгавар"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0
            )}
            color="bg-lime-500"
          />
        </div>
      </div>

      {/* График болон сүүлийн даалгаврууд */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Даалгаврын хуваарилалт</h5>
            </div>

            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>
        </div>

        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Даалгаврын ач холбогдлын түвшин</h5>
            </div>

            <CustomBarChart data={barChartData} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between ">
              <h5 className="text-lg">Хамгийн сүүлийн үеийн даалгаврууд</h5>

              <button className="card-btn" onClick={onSeeMore}>
                Бүгдийг үзэх <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
