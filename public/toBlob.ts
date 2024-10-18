import { snapshot } from '@webcontainer/snapshot';
import fs from "node:fs/promises"

const main = async () => {
  const sourceSnapshot = await snapshot("/home/ankan/Documents/git/me/temporaryenvironment/public/_vite-react-starter-main");
  await fs.writeFile("_vite-react-starter-main-bin", sourceSnapshot)
}

main()
