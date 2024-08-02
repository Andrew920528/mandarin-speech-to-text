import FileUpload from "./FileUpload/FileUpload";
import "./styles/reset.css";
import "./styles/app.css";

function App() {
  return (
    <div className="app">
      <h1>Speech To Text Transcriber</h1>
      <FileUpload />
      <div className="notes --label">
        *For refernce, a 6-minute recording will take roughly 4 minutes to
        transcribe.
      </div>
    </div>
  );
}

export default App;
