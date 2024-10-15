import React from 'react';
import { useVSCodeStore } from "../store";

const TopBar: React.FC = () => {
  const { showExplorer, showTerminal, setShowExplorer, setShowTerminal, getTheme } = useVSCodeStore();
  const theme = getTheme();

  const buttonStyle = {
    backgroundColor: theme.main.topbar.backgroundColor,
    color: theme.main.topbar.text_color,
    border: `${theme.main.topbar.borderWidth} solid ${theme.main.topbar.borderColor}`,
    ':hover': {
      backgroundColor: theme.main.topbar.hoverColor,
    }
  };

  return (
    <div
      className="flex justify-between items-center p-2"
      style={{
        backgroundColor: theme.main.topbar.backgroundColor,
        borderBottom: `${theme.main.topbar.borderWidth} solid ${theme.main.topbar.borderColor}`
      }}
    >
      <div className="flex space-x-2">
        <button
          className="px-2 py-1 rounded"
          style={buttonStyle}
          onClick={() => setShowExplorer(!showExplorer)}
        >
          {showExplorer ? 'Hide' : 'Show'} Explorer
        </button>
        <button
          className="px-2 py-1 rounded"
          style={buttonStyle}
          onClick={() => setShowTerminal(!showTerminal)}
        >
          {showTerminal ? 'Hide' : 'Show'} Terminal
        </button>
      </div>
    </div>
  );
};

export default TopBar;
