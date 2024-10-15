import React from 'react';
import { useVSCodeStore } from "../store";
import { Folder, Search, Terminal } from "lucide-react";

export const Sidebar: React.FC = () => {
  const {
    showExplorer,
    setShowExplorer,
    showSearchBar,
    setShowSearchBar,
    showTerminal,
    setShowTerminal,
    getTheme
  } = useVSCodeStore();
  const theme = getTheme();

  const iconStyle = {
    color: theme.sidebar.color
  };

  const itemStyle = {
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: theme.sidebar.color,
      opacity: 0.2
    }
  };

  const activeItemStyle = {
    backgroundColor: theme.sidebar.color,
    opacity: 0.1
  };

  return (
    <div
      className="flex flex-col w-full h-full p-2"
      style={{
        background: theme.sidebar.background,
        borderRight: `${theme.sidebar.borderWidth} solid ${theme.sidebar.borderColor}`
      }}
    >
      <div
        className="flex items-center py-2 px-4 cursor-pointer"
        style={showExplorer ? activeItemStyle : itemStyle}
        onClick={() => setShowExplorer(!showExplorer)}
      >
        <Folder height={20} width={20} style={iconStyle} />
      </div>
      <div
        className="flex items-center py-2 px-4 cursor-pointer"
        style={showSearchBar ? activeItemStyle : itemStyle}
        onClick={() => setShowSearchBar(!showSearchBar)}
      >
        <Search height={20} width={20} style={iconStyle} />
      </div>
      <div
        className="flex items-center py-2 px-4 cursor-pointer"
        style={showTerminal ? activeItemStyle : itemStyle}
        onClick={() => setShowTerminal(!showTerminal)}
      >
        <Terminal size={20} style={iconStyle} />
      </div>
    </div>
  );
};

export default Sidebar;
