import { FileSystemTree, FileNode, DirectoryNode } from "@webcontainer/api"

export function getFileContent(path: string, tree: FileSystemTree): string {
  for (const filePath in tree) {
    if (filePath === path) {
      const node = tree[filePath] as FileNode;
      if (node.file && typeof node.file.contents === 'string') {
        return node.file.contents;
      }
    } else if ((tree[filePath]as DirectoryNode).directory) {
      const content = getFileContent(path, (tree[filePath]as DirectoryNode).directory);
      if (content !== '') {
        return content;
      }
    }
  }
  return '';
}

export function setFileContent(path: string, tree: FileSystemTree, content: string): boolean {
  for (const filePath in tree) {
    if (filePath === path) {
      if ((tree[filePath] as FileNode).file) {
        (tree[filePath] as FileNode).file.contents = content;
        return true;
      }
    } else if ((tree[filePath] as DirectoryNode).directory) {
      if (setFileContent(path, (tree[filePath] as DirectoryNode).directory, content)) {
        return true;
      }
    }
  }
  return false;
}
