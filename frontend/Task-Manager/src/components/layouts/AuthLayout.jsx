import React from "react";
// import UI_IMG from "../../assets/images/#";
import UI_IMG from "../../assets/images/auth-img.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-2xl font-bold text-black ">
          Хэрэглэгчийн хянах самбар
        </h2>
        {children}
      </div>

      <div className="hidden md:flex w-[50vw] h-screen items-center justify-center bg-blue-50 bg-[url('/bg-img.png')] bg-cover bg-no-repeat bg-center overflow-hidden p-8">
        <img src={UI_IMG} className="w-64 lg:w-[90%] px-5" />
      </div>
    </div>
  );
};

export default AuthLayout;
