"use client";

import React, { useEffect, useState, useRef } from "react";
import { WebContainer } from "@webcontainer/api";
import { useVSCodeStore } from "@/utils/store";
import FileExplorer from "@/components/FileExplorer";
import EditorPanel from "@/components/EditorPanel";
import TerminalPanel from "@/components/TerminalPanel";
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { Sidebar } from "@/components/SideBar";
import Loading from "@/components/Loading";
import { View } from "@/components/View";

export default function VSCodeClone() {
  const {
    selectedFile,
    openFiles,
    webcontainerInstance,
    setSelectedFile,
    setOpenFiles,
    setWebcontainerInstance,
    updateFileSystem,
    updateFile,
    showExplorer,
    showTerminal,
  } = useVSCodeStore();

  const [loading, setLoading] = useState<boolean>(true);

  // Panel refs with the appropriate type that includes collapse/expand
  const fileExplorerPanelRef = useRef<ImperativePanelHandle | null>(null);
  const terminalPanelRef = useRef<ImperativePanelHandle | null>(null);

  const fetchFiles = async (ins: WebContainer) => {
    const blob = await fetch("/_vite-react-starter-main-bin");
    ins.mount((await blob.arrayBuffer()) as unknown as ArrayBuffer);
  };

  useEffect(() => {
    if (!webcontainerInstance) {
      bootWebContainer();
    }

    return () => {
      if (webcontainerInstance) {
        webcontainerInstance.teardown();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bootWebContainer = async (): Promise<void> => {
    if (!webcontainerInstance) {
      const instance = await WebContainer.boot();
      setWebcontainerInstance(instance);
      await fetchFiles(instance);
      await updateFileSystem();
      instance.fs.watch("/", { recursive: true }, updateFileSystem);
      setLoading(false);
    }
  };

  let debounceTimer: NodeJS.Timeout | null = null; // Hold the debounce timer reference

  const handleEditorChange = async (
    value: string | undefined,
  ): Promise<void> => {
    console.assert(
      value !== undefined,
      "Editor value should not be undefined.",
    );

    if (selectedFile && value !== undefined) {
      // Clear the previous timer to debounce
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Set a new timer to update after the user stops typing for a set duration
      debounceTimer = setTimeout(async () => {
        updateFile(selectedFile, value); // Update Zustand store (in-memory)

        if (webcontainerInstance) {
          await webcontainerInstance.fs.writeFile(selectedFile, value); // Write to the WebContainer FS
          await updateFileSystem(); // Sync the Zustand store with WebContainer FS
        }
      }, 500); // Adjust the debounce duration (in milliseconds) as needed
    } else {
      console.warn(
        "Editor change detected, but no file is selected or value is undefined.",
      );
    }
  };

  // Handle file explorer collapse/expand on showExplorer change
  useEffect(() => {
    if (showExplorer) {
      handleExpandFileExplorer();
    } else {
      handleCollapseFileExplorer();
    }
  }, [showExplorer]);

  // Handle terminal collapse/expand on showTerminal change
  useEffect(() => {
    if (showTerminal) {
      handleExpandTerminal();
    } else {
      handleCollapseTerminal();
    }
  }, [showTerminal]);

  const handleFileClick = (fileName: string): void => {
    console.assert(
      fileName !== undefined,
      "File name should not be undefined.",
    );

    setSelectedFile(fileName);

    if (!openFiles.includes(fileName)) {
      setOpenFiles([...openFiles, fileName]);
    }
  };

  const handleCollapseFileExplorer = (): void => {
    if (fileExplorerPanelRef.current) {
      fileExplorerPanelRef.current.collapse();
    }
  };

  const handleExpandFileExplorer = (): void => {
    if (fileExplorerPanelRef.current) {
      fileExplorerPanelRef.current.expand();
    }
  };

  const handleCollapseTerminal = (): void => {
    if (terminalPanelRef.current) {
      terminalPanelRef.current.collapse();
    }
  };

  const handleExpandTerminal = (): void => {
    if (terminalPanelRef.current) {
      terminalPanelRef.current.expand();
    }
  };

  return (
    <div className="h-screen w-screen p-0 m-0 overflow-hidden">
      {loading ? (
        <Loading />
      ) : (
        <PanelGroup autoSave="secondary-layout" direction="horizontal">
          <Sidebar />
          <Panel ref={fileExplorerPanelRef} defaultSize={20} collapsible={true}>
            <FileExplorer handleFileClick={handleFileClick} />
          </Panel>
          <PanelResizeHandle />
          <Panel defaultSize={80}>
            <PanelGroup autoSave="tertiary-layout" direction="horizontal">
              <Panel defaultSize={80}>
                <PanelGroup autoSave="hept-layout" direction="vertical">
                  <Panel defaultSize={80}>
                    <EditorPanel handleEditorChange={handleEditorChange} />
                  </Panel>
                  <PanelResizeHandle />
                  <Panel
                    ref={terminalPanelRef}
                    defaultSize={20}
                    collapsible={true}
                  >
                    <TerminalPanel />
                  </Panel>
                </PanelGroup>
              </Panel>
              <PanelResizeHandle />
              <Panel defaultSize={20}>
                <View />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      )}
    </div>
  );
}
