import { X } from "lucide-react";
import { useVSCodeStore } from "../store";
import { Editor } from "@monaco-editor/react";

const EditorPanel: React.FC<{
  handleEditorChange: (value: string | undefined) => void;
}> = ({ handleEditorChange }) => {
  const { selectedFile, openFiles, files, setSelectedFile, closeFile } = useVSCodeStore();
  return (
    <div className="flex-grow flex flex-col h-full">
      <div className="flex space-x-2 bg-gray-900 p-2 border-b border-gray-700">
        {openFiles.map((fileName) => (
          <div
            key={fileName}
            className={`flex items-center space-x-2 px-2 py-1 cursor-pointer ${
              fileName === selectedFile ? 'bg-gray-700' : 'bg-transparent'
            }`}
            onClick={() => setSelectedFile(fileName)}
          >
            <span>{fileName}</span>
            <X
              size={16}
              className="cursor-pointer"
              onClick={() => closeFile(fileName)}
            />
          </div>
        ))}
      </div>
      {selectedFile ? (
        <Editor
          height="calc(100vh - 200px)" // subtracting top bar height
          width="100%"
          defaultLanguage={
            selectedFile.endsWith('.js') ? 'javascript' : 'json'
          }
          value={files[selectedFile]?.file.contents || ''}
          theme="vs-dark"
          onChange={handleEditorChange}
        />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          Select a file to edit
        </div>
      )}
    </div>
  );
};

export default EditorPanel;
