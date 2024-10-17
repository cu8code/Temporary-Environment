import React from 'react';
import { X } from "lucide-react";
import { useVSCodeStore } from "../store";

const TopBar: React.FC = () => {
  const { openFiles, setSelectedFile, selectedFile, closeFile, getTheme } = useVSCodeStore();
  const theme = getTheme()

  return (
    <div className="flex space-x-2 p-2" style={{
      display: openFiles.length == 0 ? "none" : "flex",
      background: theme.main.topbar.backgroundColor,
      color: theme.main.topbar.text_color
    }}>
      {openFiles.map((fileName) => (
        <div
          key={fileName}
          className="flex items-center space-x-2 px-2 py-1 cursor-pointer"
          onClick={() => setSelectedFile(fileName)}
        >
          <span>{fileName}</span>
          <X
            size={16}
            className="cursor-pointer"
            onClick={(e) => {
              console.assert(selectedFile !== null, "selectedFile can not be null")
              if (selectedFile === fileName){
                setSelectedFile(null)
                closeFile(fileName);
              }
              e.stopPropagation();
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default TopBar;
