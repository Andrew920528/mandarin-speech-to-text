import FileUpload from "./FileUpload/FileUpload";
import "./styles/reset.css";
import "./styles/app.css";

function App() {
  return (
    <div className="app">
      <h1>Upload WAV File</h1>
      <FileUpload />
    </div>
  );
}

export default App;
