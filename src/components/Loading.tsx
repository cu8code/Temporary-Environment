import { useVSCodeStore } from "../store"

export const Loading = () => {
  const { getTheme } = useVSCodeStore()
  const theme = getTheme()
  return (
    <div className="absolute w-full h-full flex justify-center items-center" style={{
      backgroundColor: theme.loading.background,
      color: theme.loading.color
    }}>
      <div className="text-lg">Creating Tesing Enviorment...</div>
    </div>
  )
}

export default Loading
