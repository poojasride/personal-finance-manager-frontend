import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 ">

      <Header onMenuClick={() => setIsOpen(true)} />

      <div className=" pt-16">

        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main className="p-4 md:p-6 lg:p-8 lg:ml-68">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default Layout;



