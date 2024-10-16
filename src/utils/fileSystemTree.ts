import { FileSystemTree, FileNode, DirectoryNode } from "@webcontainer/api"

export function getFileContent(path: string, tree: FileSystemTree){
  Object.keys(tree).map(filePath=> {
    if (filePath === path){
      const res = (tree[filePath] as FileNode)
      return res.file.contents
    }
    const r = (tree[filePath] as DirectoryNode)
    if (r.directory) {
      return getFileContent(path, r.directory)
    }
  })
  return ""
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
