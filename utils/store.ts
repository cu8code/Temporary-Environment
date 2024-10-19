import { FileSystemAPI, FileSystemTree, WebContainer } from "@webcontainer/api";
import { create } from "zustand";
import { Theme } from "@/theme/theme";
import { vscode_dark } from "@/theme/vscode_dark";
import { setFileContent } from "@/utils/fileSystemTree";

const themes = [vscode_dark];

interface VSCodeState {
  selectedFile: string | null;
  openFiles: string[];
  files: FileSystemTree;
  webcontainerInstance: WebContainer | null;
  showExplorer: boolean;
  showTerminal: boolean;
  showSearchBar: boolean;
  theme: number;
  themes: Theme[];
  setTheme: (index: number) => void;
  getThemes: () => Theme[];
  getTheme: () => Theme;
  setSelectedFile: (file: string | null) => void;
  setOpenFiles: (files: string[]) => void;
  setFiles: (files: FileSystemTree) => void;
  setWebcontainerInstance: (instance: WebContainer | null) => void;
  setShowExplorer: (show: boolean) => void;
  setShowTerminal: (show: boolean) => void;
  setShowSearchBar: (show: boolean) => void;
  addFile: (fileName: string, content: string) => void;
  updateFile: (fileName: string, content: string) => void;
  closeFile: (fileName: string) => void;
  updateFileSystem: () => Promise<void>;
  createFile: (filePath: string, filename: string, content: string) => Promise<void>;
  createFolder: (filePath: string, filename: string) => Promise<void>;
}

export const useVSCodeStore = create<VSCodeState>((set, get) => ({
  selectedFile: null,
  openFiles: [],
  files: {},
  webcontainerInstance: null,
  showExplorer: true,
  showTerminal: true,
  showSearchBar: false,
  theme: 0,
  themes: themes,
  setTheme: (index) => {
    console.assert(index >= 0 && index < themes.length, "Theme index out of bounds");
    set({ theme: index });
  },
  setSelectedFile: (file) => set({ selectedFile: file }),
  setOpenFiles: (files) => set({ openFiles: files }),
  setFiles: (files) => {
    console.assert(typeof files === "object", "Files must be an object");
    set({ files });
  },
  setWebcontainerInstance: (instance) => set({ webcontainerInstance: instance }),
  setShowExplorer: (show) => set({ showExplorer: show }),
  setShowTerminal: (show) => set({ showTerminal: show }),
  setShowSearchBar: (show) => set({ showSearchBar: show }),
  addFile: (fileName, content) => {
    console.assert(!!fileName && content !== undefined, "File name and content must be provided");
    set((state) => ({
      files: {
        ...state.files,
        [fileName]: { file: { contents: content } },
      },
    }));
  },
  updateFile: (fileName, content) => {
    set((state) => {
      const updatedFiles = { ...state.files }; // Create a copy of the files object
      setFileContent(fileName, updatedFiles, content); // Update the copied object
      return {
        ...state, // Preserve other state properties
        files: updatedFiles // Update the files property
      };
    });
  },
  closeFile: (fileName) => {
    console.assert(get().openFiles.includes(fileName), "File is not open");
    set((state) => ({
      openFiles: state.openFiles.filter((file) => file !== fileName),
      selectedFile:
        state.selectedFile === fileName ? state.openFiles[0] || null : state.selectedFile,
    }));
  },
  updateFileSystem: async () => {
    const { webcontainerInstance, setFiles } = get();
    console.assert(!!webcontainerInstance, "WebContainer instance is null");
    if (webcontainerInstance) {
      const updatedFiles: FileSystemTree = {};
      await readDir(webcontainerInstance.fs, ".", updatedFiles);
      setFiles(updatedFiles);
    }
  },
  readFile: async (filePath: string) => {
    const { webcontainerInstance } = get();
    console.assert(!!webcontainerInstance, "WebContainer instance is null");
    if (webcontainerInstance) {
      try {
        const file = await webcontainerInstance.fs.readFile(filePath, "utf-8");
        return file;
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
      }
    }
  },
  writeFile: async (filePath: string, content: string) => {
    const { webcontainerInstance } = get();
    console.assert(!!webcontainerInstance, "WebContainer instance is null");
    if (webcontainerInstance) {
      try {
        await webcontainerInstance.fs.writeFile(filePath, content);
      } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
      }
    }
  },
  deleteFile: async (filePath: string) => {
    const { webcontainerInstance } = get();
    console.assert(!!webcontainerInstance, "WebContainer instance is null");
    if (webcontainerInstance) {
      try {
        await webcontainerInstance.fs.rm(filePath);
      } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
      }
    }
  },
  createDirectory: async (dirPath: string) => {
    const { webcontainerInstance } = get();
    console.assert(!!webcontainerInstance, "WebContainer instance is null");
    if (webcontainerInstance) {
      try {
        await webcontainerInstance.fs.mkdir(dirPath);
      } catch (error) {
        console.error(`Error creating directory ${dirPath}:`, error);
      }
    }
  },
  getThemes: () => {
    const { themes } = get();
    return themes;
  },
  getTheme: () => {
    const { theme, themes } = get();
    console.assert(theme >= 0 && theme < themes.length, "Current theme index out of bounds");
    return themes[theme];
  },
  createFile: async (filePath: string, fileName: string, content: string) => {
    const { webcontainerInstance } = get();
    console.assert(!!webcontainerInstance, "WebContainer instance is null");
    if (webcontainerInstance) {
      try {
        await webcontainerInstance.fs.writeFile(`${filePath}/${fileName}`, content);
      } catch (error) {
        console.error(`Error creating file ${filePath}/${fileName}:`, error);
      }
    }
  },
  createFolder: async (filePath: string, folderName: string) => {
    const { webcontainerInstance, updateFileSystem } = get();
    console.assert(!!webcontainerInstance, "WebContainer instance is null");
    if (webcontainerInstance) {
      try {
        await webcontainerInstance.fs.mkdir(`${filePath}/${folderName}`);
      } catch (error) {
        console.error(`Error creating folder ${filePath}/${folderName}:`, error);
      }
    }
    updateFileSystem();
  },
}));

const readDir = async (
  fs: FileSystemAPI,
  dirPath: string,
  updatedFiles: FileSystemTree,
) => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = `${dirPath}/${entry.name}`;
      if (entry.isDirectory()) {
        updatedFiles[entryPath] = { directory: {} };
        await readDir(fs, entryPath, updatedFiles[entryPath].directory);
      } else {
        const contents = await fs.readFile(entryPath, "utf-8");
        updatedFiles[entryPath] = { file: { contents } };
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
};
