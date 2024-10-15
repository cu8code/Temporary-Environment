const downloadFile = async () => {
  const f = await fetch("https://github.com/cu8code/oEditor.git")
  console.log(f)
}

export default downloadFile
