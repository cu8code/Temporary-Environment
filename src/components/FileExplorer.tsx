import React from 'react';
import { X, File } from "lucide-react";
import { useVSCodeStore } from "../store";

const FileExplorer: React.FC<{
  handleFileClick: (fileName: string) => void;
}> = ({ handleFileClick }) => {
  const { files, selectedFile, setShowExplorer, getTheme } = useVSCodeStore();
  const theme = getTheme();

  return (
    <div className="flex h-full w-full flex-grow">
      <div className="h-full w-full" style={{
        backgroundColor: theme.fileExplorer.backgroundColor
      }}>
        <div className="flex justify-between items-center p-2" style={{
          color: theme.fileExplorer.head.text_color,
          backgroundColor: theme.fileExplorer.head.backgroundColor,
          borderColor: theme.fileExplorer.head.borderColor,
          borderWidth: theme.fileExplorer.head.borderWidth,
          borderStyle: 'solid',
          borderTopWidth: '0',
          borderLeftWidth: '0',
          borderRightWidth: '0'
        }}>
          <h2 className="text-sm font-bold">Explorer</h2>
          <X
            size={18}
            className="cursor-pointer"
            onClick={() => setShowExplorer(false)}
          />
        </div>
        <div className="p-2" style={{
          color: theme.fileExplorer.body.text_color,
          backgroundColor: theme.fileExplorer.body.backgroundColor,
        }}>
          {Object.keys(files).map((fileName) => (
            <div
              key={fileName}
              className="flex items-center cursor-pointer p-1"
              style={{
                backgroundColor: fileName === selectedFile ? theme.fileExplorer.body.selectedColor : 'transparent',
                ':hover': {
                  backgroundColor: theme.fileExplorer.body.hoverColor
                }
              }}
              onClick={() => handleFileClick(fileName)}
            >
              <File size={16} className="mr-2" />
              <span>{fileName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
