import React from 'react';
import { useVSCodeStore } from "../store";
import { Editor } from "@monaco-editor/react";
import { getFileContent } from '../utils/fileSystemTree';
import TopBar from './TopBar';

export const EditorPanel: React.FC<{
  handleEditorChange: (value: string | undefined) => void;
}> = ({ handleEditorChange }) => {
  const { selectedFile, files, getTheme } = useVSCodeStore();
  const theme = getTheme();


  return (
    <div className="flex-grow flex flex-col h-full">
      <TopBar />
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
          backgroundColor: theme.main.editor.backgroundColor
        }}>
          Select a file to edit
        </div>
      )}
    </div>
  );
};

export default EditorPanel;
