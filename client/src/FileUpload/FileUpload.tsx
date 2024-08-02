import {useState} from "react";
import "../styles/file_upload.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  // const [files, setFiles] = useState<File[]>([]);
  const handleFileChange = (files: FileList) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      if (
        selectedFile.type === "audio/wav" ||
        selectedFile.type === "audio/x-wav"
      ) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
      } else {
        alert("Please upload a .wav file.");
      }
    }
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    handleFileChange(droppedFiles);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    // Replace this URL with your actual upload endpoint
    const uploadUrl = "http://127.0.0.1:8000/upload";

    try {
      setLoading(true);
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      console.log(response);
      const blob = await response.blob();

      // Create a link element and set its href to a URL representing the blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "transcript.txt"; // Set the default file name
      document.body.appendChild(link);
      link.click();
      setLoading(false);
      // Clean up the link element and URL object
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  }
  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".wav";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        handleFileChange(target.files);
      }
    };
    input.click();
  };

  const DragNDropInterior = () => {
    return (
      <div className="dnd-interior">
        <CloudUploadIcon sx={{fontSize: "8rem", color: "#00B49B"}} />
        <p className="dnd-text">
          <span className="underline clickable">Click to upload</span> or drag
          and drop
        </p>
        <p className="dnd-label">
          Maximum file size is 25 MB <br /> Supported formats: .wav
        </p>
      </div>
    );
  };

  return (
    <div className="file-upload">
      <div
        className="drag-and-drop-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <DragNDropInterior />
        {fileName ? fileName : ""}
      </div>

      <Button
        variant="contained"
        onClick={() => {
          if (!file) {
            console.log("No file selected");
            return;
          }
          handleUpload(file);
        }}
        disabled={loading || !file}
        sx={{backgroundColor: "#00B49B"}}
      >
        Transcribe
      </Button>
    </div>
  );
};

export default FileUpload;
