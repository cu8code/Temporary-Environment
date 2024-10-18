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

export function setFileContent(path: string, tree: FileSystemTree, content: string){
  Object.keys(tree).map(filePath=> {
    if (filePath === path){
      const res = (tree[filePath] as FileNode)
      res.file.contents  = content
    }
    const r = (tree[filePath] as DirectoryNode)
    if (r.directory) {
      return getFileContent(path, r.directory)
    }
  })
}
