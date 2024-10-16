import React, { useEffect } from "react";
import { WebContainer } from "@webcontainer/api";
import { useVSCodeStore } from "./store";
import FileExplorer from "./components/FileExplorer";
import EditorPanel from "./components/EditorPanel";
import TerminalPanel from "./components/TerminalPanel";
import { TerminalContextProvider } from "react-terminal";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Sidebar } from "./components/SideBar";

const VSCodeClone: React.FC = () => {
  const {
    selectedFile,
    openFiles,
    files,
    webcontainerInstance,
    setSelectedFile,
    setOpenFiles,
    setWebcontainerInstance,
    updateFileSystem,
    updateFile,
    showExplorer,
    showTerminal
  } = useVSCodeStore();

  useEffect(() => {
    if (!webcontainerInstance) {
      bootWebContainer();
    }

    return () => {
      if (webcontainerInstance) {
        webcontainerInstance.teardown();
      }
    };
  }, []);

  const bootWebContainer = async () => {
    const instance = await WebContainer.boot();
    setWebcontainerInstance(instance);
    await instance.mount(files); // Mount initial files
    await updateFileSystem(); // Fetch the current file system from WebContainer
  };

  const handleEditorChange = async (value: string | undefined) => {
    if (selectedFile && value !== undefined) {
      updateFile(selectedFile, value); // Update Zustand store (in-memory)
      if (webcontainerInstance) {
        await webcontainerInstance.fs.writeFile(selectedFile, value); // Write to the WebContainer FS
        await updateFileSystem(); // Sync the Zustand store with WebContainer FS
      }
    }
  };

  const handleFileClick = (fileName: string) => {
    setSelectedFile(fileName);
    if (!openFiles.includes(fileName)) {
      setOpenFiles([...openFiles, fileName]);
    }
  };

  return (
    <div className="h-screen w-screen p-0 m-0 overflow-hidden">
      <PanelGroup autoSave="primary-layout" direction="horizontal">
        <Panel minSize={5} defaultSize={5} maxSize={5}>
          <Sidebar />
        </Panel>
        <PanelResizeHandle disabled={true} />
        <Panel defaultSize={95}>
          <PanelGroup autoSave="secondary-layout" direction="horizontal">
            {showExplorer && (
              <Panel defaultSize={20}>
                <FileExplorer handleFileClick={handleFileClick} />
              </Panel>
            )}
            {showExplorer && <PanelResizeHandle />}
            <Panel defaultSize={80}>
              <PanelGroup autoSave="tertiary-layout" direction="vertical">
                <Panel defaultSize={80}>
                  <EditorPanel handleEditorChange={handleEditorChange} />
                </Panel>
                <PanelResizeHandle />
                {showTerminal && (
                  <Panel defaultSize={20}>
                    <TerminalContextProvider>
                      <TerminalPanel />
                    </TerminalContextProvider>
                  </Panel>
                )}
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default VSCodeClone;
