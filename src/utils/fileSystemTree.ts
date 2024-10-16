import { FileSystemTree, FileNode, DirectoryNode } from "@webcontainer/api"

export function getFileContent(path: string, tree: FileSystemTree){
  return Object.keys(tree).map((filePath): string => {
    console.log(filePath, path, filePath === path)
    if (filePath === path){
      const res = (tree[filePath] as FileNode)
      if (typeof res.file.contents === "string") {
        return res.file.contents
      }
    }
    const r = (tree[filePath] as DirectoryNode)
    if (r.directory) {
      return getFileContent(path, r.directory)
    }
    return ""
  })[0]
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
