import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout"; // Нэвтрэх хуудасны ерөнхий загвар
import { Link, useNavigate } from "react-router-dom"; // Хуудас хооронд шилжихэд ашиглагдах компонент
import Input from "../../components/Inputs/Input"; // И-мэйл, нууц үгийн оролтын талбар
import { validateEmail } from "../../utils/helper"; // И-мэйл шалгах функц
import axiosInstance from "../../utils/axiosInstance"; // API харилцаа үүсгэх
import { API_PATHS } from "../../utils/apiPaths"; // API-ийн зам
import { UserContext } from "../../context/userContext"; // Хэрэглэгчийн мэдээлэл хадгалах context

const Login = () => {
  // useState hooks - и-мэйл, нууц үг, алдааг хадгална
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // useContext болон useNavigate - хэрэглэгчийн мэдээлэл шинэчлэх болон хуудас шилжихэд ашиглагдана
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    // Input-уудыг шалгах
    if (!validateEmail(email)) {
      setError("Зөв и-мэйл хаяг оруулна уу.");
      return;
    }

    if (!password) {
      setError("Нууц үгээ оруулна уу.");
      return;
    }

    setError(""); // Алдааг арилгах

    //Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        // Эрхэд тулгуурлан хуудас руу шилжүүлэх
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      // Алдааг хэрэглэгчид харуулах
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Ямар нэгэн зүйл буруу байна. Дахин оролдоно уу.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Тавтай морил</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Нэвтрэхийн тулд мэдээллээ оруулна уу
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="И-мэйл хаяг"
            placeholder="Та мэйл хаягаа оруулна уу"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Нууц үг"
            placeholder="Хамгийн багадаа 8 тэмдэгт"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            НЭВТРЭХ
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Бүртгэлгүй юу?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              Бүртгүүлэх
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
