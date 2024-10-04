import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChartBar, FaUser, FaCog, FaSignOutAlt, FaBars, FaChevronLeft } from 'react-icons/fa';

function MenuSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white ${isExpanded ? 'w-64' : 'w-20'} min-h-screen p-4 transition-all duration-300 shadow-lg`}>
      <div className="flex justify-between items-center mb-8">
        {isExpanded && <h2 className="text-2xl font-bold text-blue-400 tracking-wide">Mi Aplicación</h2>}
        <button onClick={toggleSidebar} className="text-white hover:text-blue-400 transition duration-200 p-2 rounded-full hover:bg-gray-700">
          {isExpanded ? <FaChevronLeft size={20} /> : <FaBars size={20} />}
        </button>
      </div>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/dashboard" className={`flex items-center py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ${!isExpanded && 'justify-center'} group`}>
              <FaChartBar size={22} className={`${isExpanded ? 'mr-3' : 'mr-0'} group-hover:scale-110 transition-transform duration-200`} />
              {isExpanded && <span className="font-medium">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link to="/perfil" className={`flex items-center py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ${!isExpanded && 'justify-center'} group`}>
              <FaUser size={22} className={`${isExpanded ? 'mr-3' : 'mr-0'} group-hover:scale-110 transition-transform duration-200`} />
              {isExpanded && <span className="font-medium">Perfil</span>}
            </Link>
          </li>
          <li>
            <Link to="/configuracion" className={`flex items-center py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ${!isExpanded && 'justify-center'} group`}>
              <FaCog size={22} className={`${isExpanded ? 'mr-3' : 'mr-0'} group-hover:scale-110 transition-transform duration-200`} />
              {isExpanded && <span className="font-medium">Configuración</span>}
            </Link>
          </li>
          <li>
            <Link to="/login" className={`flex items-center py-3 px-4 rounded-lg hover:bg-red-600 transition duration-200 ${!isExpanded && 'justify-center'} group`}>
              <FaSignOutAlt size={22} className={`${isExpanded ? 'mr-3' : 'mr-0'} group-hover:scale-110 transition-transform duration-200`} />
              {isExpanded && <span className="font-medium">Cerrar sesión</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default MenuSidebar;