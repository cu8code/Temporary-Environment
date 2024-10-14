import React, { useEffect } from 'react';
import { WebContainer } from '@webcontainer/api';
import { useVSCodeStore } from './store';
import FileExplorer from './components/FileExplorer';
import EditorPanel from './components/EditorPanel';
import TerminalPanel from './components/TerminalPanel';
import { TerminalContextProvider } from 'react-terminal';

const VSCodeClone: React.FC = () => {
  const {
    selectedFile,
    openFiles,
    files,
    webcontainerInstance,
    setSelectedFile,
    setOpenFiles,
    setWebcontainerInstance,
    updateFileSystem
  } = useVSCodeStore();

  useEffect(() => {
    if (!webcontainerInstance){
      bootWebContainer();
    }

    return () => {
      if (webcontainerInstance) {
        webcontainerInstance.teardown()
      }
    }
  }, []);

  const bootWebContainer = async () => {
      const instance = await WebContainer.boot();
      setWebcontainerInstance(instance);
      await instance.mount(files);
      await updateFileSystem();
    };

  const handleEditorChange = async (value: string | undefined) => {
    if (selectedFile && value !== undefined) {
      await updateFile(selectedFile, value);
      if (webcontainerInstance) {
        await webcontainerInstance.fs.writeFile(selectedFile, value);
      }
    }
  };

  const executeCommand = async (command: string) => {
      if (!webcontainerInstance) return "WebContainer not initialized";

      const parts = command.split(' ');
      const process = await webcontainerInstance.spawn(parts[0], parts.slice(1));

      let output = '';
      process.output.pipeTo(
        new WritableStream({
          write(data) {
            output += data;
          }
        })
      );

      const exitCode = await process.exit;
      await updateFileSystem();
      return `${output}\nProcess exited with code ${exitCode}`;
    };

  const terminalCommands = {
    echo: (args: string) => args,
    execute: async (command: string) => await executeCommand(command),
  };

  const handleFileClick = (fileName: string) => {
    setSelectedFile(fileName);
    if (!openFiles.includes(fileName)) {
      setOpenFiles([...openFiles, fileName]);
    }
  };

  return (
    <TerminalContextProvider>
      <div className="flex flex-col h-screen w-screen">
        <div className="flex flex-row w-full h-full">
          <EditorPanel handleEditorChange={handleEditorChange} />
          <FileExplorer handleFileClick={handleFileClick} />
        </div>
        <TerminalPanel terminalCommands={terminalCommands} />
      </div>
    </TerminalContextProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateFile(selectedFile: string, value: string) {
  throw new Error('Function not implemented.');
}

export default VSCodeClone;
