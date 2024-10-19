"use client"

import React from 'react';
import { X } from "lucide-react";
import { useVSCodeStore } from "@/utils/store";

const TopBar: React.FC = () => {
  const { openFiles, setSelectedFile, selectedFile, closeFile, getTheme } = useVSCodeStore();
  const theme = getTheme()

  return (
    <div className="flex min-h-[50px] max-h-[50px] space-x-2 overflow-hidden w-full" style={{
      display: openFiles.length == 0 ? "none" : "flex",
      background: theme.main.topbar.backgroundColor,
      color: theme.main.topbar.text_color
    }}>
      {openFiles.map((fileName: string) => (
        <div
          key={fileName}
          className="w-[150px] h-full overflow-hidden text-nowrap flex items-center space-x-2 px-2 py-1 cursor-pointer"
          onClick={() => setSelectedFile(fileName)}
          style={{
            backgroundColor: fileName === selectedFile ? theme.main.topbar.selectedColor : ""
          }}
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
