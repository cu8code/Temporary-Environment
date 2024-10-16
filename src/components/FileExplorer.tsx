import React, { useState } from "react";
import { X } from "lucide-react";
import { useVSCodeStore } from "../store";
import { FileSystemTree } from "@webcontainer/api";

interface FileExplorerProps {
  handleFileClick: (filePath: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ handleFileClick }) => {
  const {
    files,
    selectedFile,
    setShowExplorer,
    getTheme,
  }= useVSCodeStore();
  const theme = getTheme();
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({});

  const getIcon = (fileName: string) => {
    const extension = fileName.split(".").pop();
    return (
      theme.fileExplorer.body.icons[extension as keyof typeof theme.fileExplorer.body.icons] ||
      theme.fileExplorer.body.icons["default-file"]
    );
  };

  const renderFileTree = (fileSystemTree: FileSystemTree, path = "", depth = 0) => {
    return Object.keys(fileSystemTree).map((fileName) => {
      const filePath = `${path}/${fileName}`;
      const filePathParts = filePath.split("/");
      const displayName = filePathParts[filePathParts.length - 1];

      if ("directory" in fileSystemTree[fileName]) {
        const isExpanded = expandedFolders[filePath];
        return (
          <div key={fileName}>
            <div
              className="flex items-center cursor-pointer p-1"
              style={{
                backgroundColor:
                  fileName === selectedFile
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
              {isExpanded ? (
                <span>&#8593;</span>
              ) : (
                <span>&#8595;</span>
              )}
            </div>
            {isExpanded && renderFileTree(fileSystemTree[fileName].directory, filePath, depth + 1)}
          </div>
        );
      } else {
        return (
          <div
            key={fileName}
            className="flex items-center cursor-pointer p-1"
            style={{
              backgroundColor:
                fileName === selectedFile
                  ? theme.fileExplorer.body.selectedColor
                  : "transparent",
              paddingLeft: `${depth * 20}px`,
            }}
            onClick={() => handleFileClick(filePath)}
          >
            {getIcon(fileName)}
            <span>{displayName}</span>
          </div>
        );
      }
    });
  };

  if (!files) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full w-full flex-grow">
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
            borderWidth: theme.fileExplorer.head.borderWidth,
            borderStyle: "solid",
            borderTopWidth: "0",
            borderLeftWidth: "0",
            borderRightWidth: "0",
          }}
        >
          <h2 className="text-sm font-bold">Explorer</h2>
          <X
            size={18}
            className="cursor-pointer"
            onClick={() => setShowExplorer(false)}
          />
        </div>
        <div
          className="p-2"
          style={{
            color: theme.fileExplorer.body.text_color,
            backgroundColor: theme.fileExplorer.body.backgroundColor,
          }}
        >
          {renderFileTree(files)}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
