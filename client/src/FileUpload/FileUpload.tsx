import {useState} from "react";
import "../styles/file_upload.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import IconButton from "@mui/material/IconButton";
import {Delete} from "@mui/icons-material";
import {CircularProgress} from "@mui/material";
const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const handleFileChange = (files: FileList) => {
    if (loading) return;
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

  async function handleTranscribe(file: File) {
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
      console.error("Error transcribing file:", error);
      setLoading(false);
      alert("Error transcribing file.");
    }
  }
  const handleClick = () => {
    if (loading) return;
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

  const FileCard = ({text}: {text: string}) => {
    return (
      <div className="file-card">
        <div className="file-info">
          <AudioFileIcon sx={{fontSize: "1rem", color: "#00B49B"}} />
          <p>{text}</p>
        </div>
        <div className="delete-btn">
          {loading ? (
            <div className="file-info">
              <p className="--label">
                <i>Transcribing...</i>
              </p>
              <CircularProgress
                color="inherit"
                size={"1rem"}
                sx={{margin: "0.5rem"}}
              />
            </div>
          ) : (
            <IconButton aria-label="delete" onClick={() => setFile(null)}>
              <Delete sx={{fontSize: "1rem"}} />
            </IconButton>
          )}
        </div>
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
      </div>
      {file && <FileCard text={fileName} />}
      <Button
        variant="contained"
        onClick={() => {
          if (!file) {
            console.log("No file selected");
            return;
          }
          handleTranscribe(file);
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
