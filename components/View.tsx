"use client"

import { useVSCodeStore } from "@/utils/store"
import { FC, useEffect, useRef, useState } from "react"

export const View: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [url, setUrl]= useState("")
  const { webcontainerInstance, getTheme } = useVSCodeStore()
  const ref = useRef(null)
  const theme = getTheme()
  useEffect(() => {
    if (ref.current && webcontainerInstance) {
      webcontainerInstance.on("server-ready", (p,url) => {
        if (ref.current){
          (ref.current as HTMLIFrameElement).src = url
        }
      })
    }
  }, [webcontainerInstance])
  return (
    <div style={{
      backgroundColor: theme.view.background
    }} className="w-full h-full">
      <iframe className="w-full h-full" src={url} ref={ref}/>
    </div>
  )
}
