import SendCommandToArduinoComponent from "./components/SendCommandToArduinoComponent"

export default function DebugPage() {
  return (
    <div style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"}}>
      <SendCommandToArduinoComponent/>
    </div>
  )
}