import React from 'react';
import { X } from "lucide-react";
import { useVSCodeStore } from "../store";
import { Editor } from "@monaco-editor/react";
import { getFileContent } from '../utils/fileSystemTree';

export const EditorPanel: React.FC<{
  handleEditorChange: (value: string | undefined) => void;
}> = ({ handleEditorChange }) => {
  const { selectedFile, openFiles, files, setSelectedFile, closeFile, getTheme } = useVSCodeStore();
  const theme = getTheme();

  const tabStyle = {
    color: theme.main.topbar.text_color,
    backgroundColor: theme.main.topbar.backgroundColor,
    ':hover': {
      backgroundColor: theme.main.topbar.hoverColor
    }
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: theme.main.topbar.selectedColor
  };

  return (
    <div className="flex-grow flex flex-col h-full">
      <div className="flex space-x-2 p-2" style={{
        backgroundColor: theme.main.topbar.backgroundColor,
        borderBottom: `${theme.main.topbar.borderWidth} solid ${theme.main.topbar.borderColor}`
      }}>
        {openFiles.map((fileName) => (
          <div
            key={fileName}
            className="flex items-center space-x-2 px-2 py-1 cursor-pointer"
            style={fileName === selectedFile ? activeTabStyle : tabStyle}
            onClick={() => setSelectedFile(fileName)}
          >
            <span>{fileName}</span>
            <X
              size={16}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                closeFile(fileName);
              }}
            />
          </div>
        ))}
      </div>
      {selectedFile ? (
        <Editor
          defaultLanguage={
            selectedFile.endsWith('.js') ? 'javascript' : 'json'
          }
          theme={theme.main.editor.theme}
          onChange={handleEditorChange}
          value={getFileContent(selectedFile, files)}
        />
      ) : (
        <div className="h-full flex items-center justify-center" style={{
          color: theme.main.topbar.text_color,
          backgroundColor: theme.main.topbar.backgroundColor
        }}>
          Select a file to edit
        </div>
      )}
    </div>
  );
};


export default EditorPanel
