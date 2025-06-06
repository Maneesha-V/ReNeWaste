import { Outlet } from 'react-router-dom';
import Header from "../../components/superAdmin/Header";
import Sidebar from "../../components/superAdmin/Sidebar"
import { useState } from 'react';
import Footer from './Footer';

const SuperAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={collapsed} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header collapsed={collapsed} toggleCollapse={toggleCollapse} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 min-h-[calc(100vh-8rem)]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Footer /> 
    </div>
  );
};

export default SuperAdminLayout;