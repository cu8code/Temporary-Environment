"use client"

import React from 'react';
import { useVSCodeStore } from "@/utils/store";
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
        defaultLanguage={getLanguageId(selectedFile)}
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

function getLanguageId(filePath: string): string {
  const extension = filePath.split('.').pop()!.toLowerCase();
  const languageMap: { [key: string]: string } = {
    js: 'javascript',
    ts: 'typescript',
    jsx: 'javascript',
    tsx: 'typescript',
    json: 'json',
    css: 'css',
    less: 'less',
    scss: 'scss',
    sass: 'sass',
    html: 'html',
    md: 'markdown',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
  };
  return languageMap[extension] || 'plain text';
}

export default EditorPanel;
