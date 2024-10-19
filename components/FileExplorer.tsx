"use client"
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useVSCodeStore } from "@/utils/store";
import { FileSystemTree } from "@webcontainer/api";

interface FileExplorerProps {
  handleFileClick: (filePath: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ handleFileClick }) => {
  const {
    files,
    selectedFile,
    getTheme,
    createFile,
    createFolder,
  } = useVSCodeStore();
  const theme = getTheme();
  const [expandedFolders, setExpandedFolders] = useState<{
    [key: string]: boolean;
  }>({});
  const [newFileName, setNewFileName] = useState("");
  const [isFolder, setIsFolder] = useState(false);
  const [currentPath, setCurrentPath] = useState(""); // Tracks the current path
  const [showInput, setShowInput] = useState(false);
  const [inputPositionPath, setInputPositionPath] = useState<string | null>(
    null,
  );
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    folderPath: string;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    folderPath: "",
    visible: false,
  });

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ ...contextMenu, visible: false });
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

  const getIcon = (fileName: string) => {
    const extension = fileName.split(".").pop();
    return (
      theme.fileExplorer.body.icons[
        extension as keyof typeof theme.fileExplorer.body.icons
      ] || theme.fileExplorer.body.icons["default-file"]
    );
  };

  const renderFileTree = (
    fileSystemTree: FileSystemTree,
    depth = 0,
  ) => {
    return Object.keys(fileSystemTree).map((filePath) => {

      const filePathParts = filePath.split("/");
      const displayName = filePathParts[filePathParts.length - 1];

      if ("directory" in fileSystemTree[filePath]) {
        const isExpanded = expandedFolders[filePath];
        const isInputVisible = showInput && inputPositionPath === filePath;

        return (
          <div
            key={filePath}
            onContextMenu={(e) => handleContextMenu(e, filePath)}
          >
            <div
              className="flex items-center cursor-pointer p-1"
              style={{
                backgroundColor:
                filePath  === selectedFile
                    ? theme.fileExplorer.body.selectedColor
                    : "transparent",
                paddingLeft: `${depth * 20}px`,
              }}
              onClick={() =>
                setExpandedFolders((prev) => ({
                  ...prev,
                  [filePath]: !prev[filePath],
                }))
              }
            >
              {theme.fileExplorer.body.icons["default-folder"]}
              <span>{displayName}</span>
              {isExpanded ? <span>&#8593;</span> : <span>&#8595;</span>}
            </div>
            {isExpanded &&
              renderFileTree(
                fileSystemTree[filePath].directory,
                depth + 1,
              )}
            {isInputVisible && (
              <input
                type="text"
                value={newFileName}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Enter file/folder name"
                className="text-black mt-2 ml-8"
                autoFocus
              />
            )}
          </div>
        );
      } else {
        return (
          <div
            key={filePath}
            className="flex items-center cursor-pointer p-1"
            style={{
              backgroundColor:
                filePath === selectedFile
                  ? theme.fileExplorer.body.selectedColor
                  : "transparent",
              paddingLeft: `${depth * 20}px`,
            }}
            onClick={() => handleFileClick(filePath)}
          >
            {getIcon(filePath)}
            <span>{displayName}</span>
          </div>
        );
      }
    });
  };

  const handleCreateFile = async (path: string, fileName: string) => {
    await createFile(path, fileName, "");
    setNewFileName("");
  };

  const handleCreateFolder = async (path: string, folderName: string) => {
    await createFolder(path, folderName);
    setNewFileName("");
    setExpandedFolders((prev) => ({
      ...prev,
      [`${path}/${folderName}`]: true,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFileName(e.target.value);
    setIsFolder(!e.target.value.includes("."));
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (newFileName.trim() === "") {
        setShowInput(false);
        return;
      }

      if (isFolder) {
        await handleCreateFolder(currentPath, newFileName);
      } else {
        await handleCreateFile(currentPath, newFileName);
      }
      setShowInput(false);
      setInputPositionPath(null); // Reset input position
    }
  };

  const handleContextMenu = (e: React.MouseEvent, folderPath: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      folderPath,
      visible: true,
    });
  };

  const handleMenuClick = (type: "file" | "folder") => {
    setIsFolder(type === "folder");
    setCurrentPath(contextMenu.folderPath);
    setShowInput(true);
    setInputPositionPath(contextMenu.folderPath); // Show input below the folder
    setContextMenu({ ...contextMenu, visible: false });
  };

  // New: Add button handler for top-level file/folder creation
  const handleAddButtonClick = (type: "file" | "folder") => {
    setIsFolder(type === "folder");
    setCurrentPath(""); // Root-level path or current folder
    setShowInput(true);
    setInputPositionPath(null); // Input appears at the root level
  };

  if (!files) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex h-full w-full flex-grow min-w-[300px]">
      <div
        className="h-full w-full"
        style={{
          backgroundColor: theme.fileExplorer.backgroundColor,
        }}
      >
        <div
          className="flex justify-between items-center p-2"
          style={{
            color: theme.fileExplorer.head.text_color,
            backgroundColor: theme.fileExplorer.head.backgroundColor,
            borderColor: theme.fileExplorer.head.borderColor,
          }}
        >
          <h2 className="text-sm font-bold">Explorer</h2>
          <div className="flex items-center text-4xl">
            <Plus
              className="cursor-pointer"
              onClick={() => handleAddButtonClick("file")}
            />
          </div>
        </div>
        <div
          className="p-2"
          style={{
            color: theme.fileExplorer.body.text_color,
            backgroundColor: theme.fileExplorer.body.backgroundColor,
          }}
        >
          {/* Input field for creating new file/folder */}
          {showInput && !inputPositionPath && (
            <div className="p-2">
              <input
                type="text"
                value={newFileName}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Enter file/folder name"
                className="text-black"
                autoFocus
              />
            </div>
          )}
          {renderFileTree(files)}
        </div>
      </div>

      {/* Context menu for folder right-click */}
      {contextMenu.visible && (
        <div
          className="absolute bg-white border shadow-md z-10"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div
            className="p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => handleMenuClick("file")}
          >
            Add New File
          </div>
          <div
            className="p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => handleMenuClick("folder")}
          >
            Add New Folder
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
