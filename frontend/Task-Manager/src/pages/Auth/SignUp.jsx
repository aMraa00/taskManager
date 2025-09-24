import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout"; // Бүртгэлийн хуудасны ерөнхий загвар
import { validateEmail } from "../../utils/helper"; // И-мэйл шалгах функц
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector"; // Профайл зураг сонгох компонент
import Input from "../../components/Inputs/Input"; // Оролтын талбар
import { Link, useNavigate } from "react-router-dom"; // Хуудас хооронд шилжих компонент
import axiosInstance from "../../utils/axiosInstance"; // API харилцаа үүсгэх
import { API_PATHS } from "../../utils/apiPaths"; // API-ийн зам
import { UserContext } from "../../context/userContext"; // Хэрэглэгчийн мэдээлэл хадгалах context
import uploadImage from "../../utils/uploadImage"; // Зураг байршуулах функц

const SignUp = () => {
  // useState hooks - профайл зураг, нэр, и-мэйл, нууц үг, админ токен, алдааг хадгална
  const [profilePic, setProfilePic] = useState(null); // Профайл зураг
  const [fullName, setFullName] = useState(""); // Бүрэн нэр
  const [email, setEmail] = useState(""); // И-мэйл хаяг
  const [password, setPassword] = useState(""); // Нууц үг
  const [adminInviteToken, setAdminInviteToken] = useState(""); // Админ урилгын токен
  const [error, setError] = useState(null); // Алдааны мэдээлэл

  // useContext болон useNavigate - хэрэглэгчийн мэдээлэл шинэчлэх болон хуудас шилжихэд ашиглагдана
  const { updateUser } = useContext(UserContext); // Хэрэглэгчийн мэдээллийг шинэчлэх функц
  const navigate = useNavigate(); // Хуудас шилжих функц

  // Бүртгэлийн form-ыг удирдлах
  const handleSignUp = async (e) => {
    e.preventDefault(); // Хуудас refresh хийхээс сэргийлнэ

    let profileImageUrl = ""; // Профайл зургийн URL

    // Input-уудыг шалгах
    if (!fullName) {
      setError("Бүрэн нэрээ оруулна уу.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Зөв и-мэйл хаяг оруулна уу.");
      return;
    }

    if (!password) {
      setError("Нууц үгээ оруулна уу.");
      return;
    }

    setError(""); // Өмнөх алдааг цэвэрлэнэ

    // SignUp API Call
    try {
      // Зураг байгаа бол байршуулах
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      // Бүртгэлийн хүсэлт илгээх
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token); // Токен хадгална
        updateUser(response.data); // Хэрэглэгчийн мэдээллийг шинэчилнэ

        // Эрхэд тулгуурлан хуудас руу шилжүүлэх
        if (role === "admin") {
          navigate("/admin/dashboard"); // Админ бол админ самбар руу
        } else {
          navigate("/user/dashboard"); // Хэрэглэгч бол хэрэглэгчийн самбар руу
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
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Бүртгэл үүсгэх</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Доорх мэдээллээ оруулж бүртгүүлнэ үү.
        </p>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Бүрэн нэр"
              placeholder="Овог нэр"
              type="text"
            />
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="И-мэйл хаяг"
              placeholder="Та И-мэйл хаягаа оруулна уу."
              type="text"
            />
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Нууц үг"
              placeholder="Хамгийн багадаа 8 тэмдэгт"
              type="password"
            />
            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Админ урилгын токен"
              placeholder="6 оронтой код"
              type="text"
            />
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary">
            БҮРТГҮҮЛЭХ
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Бүртгэлтэй юу?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Нэвтрэх
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
