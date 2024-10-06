import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChartBar, FaUser, FaCog, FaSignOutAlt, FaBars, FaChevronLeft } from 'react-icons/fa';

const MenuSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    // Eliminar el token del almacenamiento local
    localStorage.removeItem('token');
    // Redirigir al usuario a la página de inicio de sesión
    navigate('/login');
  };

  const menuItems = [
    { icon: FaChartBar, text: 'Dashboard', link: '/dashboard' },
    { icon: FaUser, text: 'Perfil', link: '/perfil' },
    { icon: FaCog, text: 'Configuración', link: '/configuracion' },
    { icon: FaSignOutAlt, text: 'Cerrar sesión', onClick: handleLogout, danger: true },
  ];

  return (
    <div className={`bg-gradient-to-br from-gray-900 to-gray-800 text-white ${isExpanded ? 'w-64' : 'w-20'} min-h-screen p-4 transition-all duration-300 shadow-lg`}>
      <div className="flex justify-between items-center mb-8">
        {isExpanded && (
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
            Mi Aplicación
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white transition duration-200 p-2 rounded-full hover:bg-gray-700/50"
        >
          {isExpanded ? <FaChevronLeft size={20} /> : <FaBars size={20} />}
        </button>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className={`flex items-center py-3 px-4 rounded-xl w-full ${
                    item.danger ? 'hover:bg-red-600/20' : 'hover:bg-blue-600/20'
                  } transition duration-200 group`}
                >
                  <div className={`flex items-center justify-center ${isExpanded ? 'w-8 mr-3' : 'w-full'}`}>
                    <item.icon
                      size={22}
                      className={`${
                        item.danger ? 'text-red-400' : 'text-blue-400'
                      } group-hover:scale-110 transition-all duration-200`}
                    />
                  </div>
                  {isExpanded && (
                    <span className={`font-medium ${item.danger ? 'group-hover:text-red-400' : 'group-hover:text-blue-400'} transition-colors duration-200`}>
                      {item.text}
                    </span>
                  )}
                </button>
              ) : (
                <Link
                  to={item.link}
                  className={`flex items-center py-3 px-4 rounded-xl ${
                    item.danger ? 'hover:bg-red-600/20' : 'hover:bg-blue-600/20'
                  } transition duration-200 group`}
                >
                  <div className={`flex items-center justify-center ${isExpanded ? 'w-8 mr-3' : 'w-full'}`}>
                    <item.icon
                      size={22}
                      className={`${
                        item.danger ? 'text-red-400' : 'text-blue-400'
                      } group-hover:scale-110 transition-all duration-200`}
                    />
                  </div>
                  {isExpanded && (
                    <span className={`font-medium ${item.danger ? 'group-hover:text-red-400' : 'group-hover:text-blue-400'} transition-colors duration-200`}>
                      {item.text}
                    </span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MenuSidebar;