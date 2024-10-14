import React, { useEffect, useCallback } from 'react';
import { WebContainer } from '@webcontainer/api';
import { TerminalContextProvider } from 'react-terminal';
import { useVSCodeStore } from '../store';
import TopBar from './components/TopBar';
import FileExplorer from './components/FileExplorer';

const VSCodeClone: React.FC = () => {
  const {
    selectedFile,
    openFiles,
    files,
    webcontainerInstance,
    showExplorer,
    showTerminal,
    setSelectedFile,
    setOpenFiles,
    setFiles,
    setWebcontainerInstance,
    updateFile,
  } = useVSCodeStore();

  useEffect(() => {
    bootWebContainer();
  }, []);

  const bootWebContainer = async () => {
    const instance = await WebContainer.boot();
    setWebcontainerInstance(instance);
    await instance.mount(files);
  };

  const updateFileSystem = useCallback(async () => {
    if (webcontainerInstance) {
      const updatedFiles: FileSystem = {};
      for await (const entry of webcontainerInstance.fs.readdir('.', {
        recursive: true,
      })) {
        if (entry.kind === 'file') {
          const contents = await webcontainerInstance.fs.readFile(
            entry.path,
            'utf-8'
          );
          updatedFiles[entry.path] = { file: { contents } };
        }
      }
      setFiles(updatedFiles);
    }
  }, [webcontainerInstance, setFiles]);

  const handleEditorChange = async (value: string | undefined) => {
    if (selectedFile && value !== undefined) {
      await updateFile(selectedFile, value);
      if (webcontainerInstance) {
        await webcontainerInstance.fs.writeFile(selectedFile, value);
      }
    }
  };

  const executeCommand = async (command: string) => {
    if (!webcontainerInstance) return 'WebContainer not initialized';

    const parts = command.split(' ');
    const process = await webcontainerInstance.spawn(parts[0], parts.slice(1));

    let output = '';
    process.output.pipeTo(
      new WritableStream({
        write(data) {
          output += data;
        },
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
      <div className="h-screen w-screen bg-gray-900 text-white grid grid-rows-[auto_1fr_auto]">
        <TopBar />
        <div className="flex">
          {showExplorer && <FileExplorer handleFileClick={handleFileClick} />}
          <EditorPane handleEditorChange={handleEditorChange} />
        </div>
        {showTerminal && <TerminalPane terminalCommands={terminalCommands} />}
      </div>
    </TerminalContextProvider>
  );
};

export default VSCodeClone;
