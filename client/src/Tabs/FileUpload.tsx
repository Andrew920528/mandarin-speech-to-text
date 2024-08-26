import { useEffect, useState } from "react";
import "../styles/file_upload.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import IconButton from "@mui/material/IconButton";
import { ContentCopy, Delete, Download } from "@mui/icons-material";
import { CircularProgress, InputAdornment, OutlinedInput } from "@mui/material";
import { HOST } from "../App";
import React from "react";
import PopUp from "../components/PopUp";

const supportedFileTypes = [
  "mp3",
  "mp4",
  "mpeg",
  "mpga",
  "m4a",
  "x-m4a",
  "x-wav",
  "wav",
  "webm",
];

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const [retrieveFileName, setRetrieveFileName] = useState("");
  const [transcript, setTranscript] = useState("");
  const [openPu, setOpenPu] = useState(false);

  useEffect(() => {
    if (retrieveFileName !== "") {
      setOpenPu(true);
    }
  }, [retrieveFileName]);

  const handleFileChange = (files: FileList) => {
    if (loading) return;
    setTranscript("");
    setRetrieveFileName("");
    if (files.length > 0) {
      const selectedFile = files[0];
      const isSupported = supportedFileTypes.some(
        (ext) => selectedFile.type === `audio/${ext}`
      );

      if (isSupported) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
      } else {
        alert(
          "Please upload a supported file: " + supportedFileTypes.join(",")
        );
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
    const uploadUrl = HOST + "/upload";

    try {
      setLoading(true);
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      const reader = response.body?.getReader();

      const decoder = new TextDecoder();

      let total = [];
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        let newChunk = decoder.decode(value);
        handleChunk(newChunk);
        total.push(newChunk);
      }
      setLoading(false);
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
    input.accept = supportedFileTypes.map((ext) => `.${ext}`).join(",");
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        handleFileChange(target.files);
      }
    };
    input.click();
  };

  function handleChunk(responseChunk: string) {
    try {
      const delimiter = "|T|";
      let chunks = responseChunk.split(delimiter);

      for (let chunk of chunks) {
        if (chunk.trim() === "") continue;
        let responseChunkData = JSON.parse(chunk);
        if (responseChunkData["status"] === "file_uploaded") {
          setRetrieveFileName(responseChunkData["data"]);
        } else if (responseChunkData["status"] === "transcription_complete") {
          setLoading(false);
          setTranscript(responseChunkData["data"]);
        }
      }
    } catch {
      alert("Something went wrong");
      setLoading(false);
    }
  }

  const DragNDropInterior = () => {
    return (
      <div className="dnd-interior">
        <CloudUploadIcon sx={{ fontSize: "8rem", color: "#00B49B" }} />
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

  const FileCard = ({ text }: { text: string }) => {
    return (
      <div className="file-card">
        <div className="file-info">
          <AudioFileIcon sx={{ fontSize: "1rem", color: "#00B49B" }} />
          <p>{text}</p>
          <div className="--label">
            {retrieveFileName === "" ? "" : "Ref: " + retrieveFileName}
          </div>
        </div>
        <div className="file-card-btn-group">
          {transcript === "" ? (
            <></>
          ) : (
            <IconButton
              onClick={() => {
                downloadTextFile(retrieveFileName + ".txt", transcript);
              }}
              size="small"
              color="primary"
            >
              <Download />
            </IconButton>
          )}
          <div className="delete-btn">
            {loading ? (
              <div className="file-info">
                <p className="--label">
                  <i>Transcribing...</i>
                </p>
                <CircularProgress
                  color="inherit"
                  size={"1rem"}
                  sx={{ margin: "0.5rem" }}
                />
              </div>
            ) : (
              <IconButton aria-label="delete" onClick={() => setFile(null)}>
                <Delete sx={{ fontSize: "1rem" }} />
              </IconButton>
            )}
          </div>
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
        sx={{ backgroundColor: "#00B49B" }}
      >
        Transcribe
      </Button>
      <div className="notes --label">
        *For refernce, a 6-minute recording will take roughly 4 minutes to
        transcribe.
      </div>
      <PopUp trigger={openPu} setTrigger={setOpenPu} title="You're all set!">
        <div className="key-pop-up">
          Your file is being transcribed. This can take a few minutes.
          <br />
          <div className="--label">
            <ul>
              <li>
                You are welcome to stay on this page to wait, or feel free to
                copy the key and return a few minutes later.
              </li>
              <li>
                You can go to the "Retrieve Text" tab and enter this key to
                retrieve the document.
              </li>
              <li>
                Make sure you write down the key if you are leaving the page!
              </li>
            </ul>
          </div>
          <CopyField text={retrieveFileName} />
        </div>
      </PopUp>
    </div>
  );
};

export default React.memo(FileUpload);

function downloadTextFile(fileName: string, content: string) {
  // Create a Blob from the content
  const blob = new Blob([content], { type: "text/plain" });

  // Create a link element
  const link = document.createElement("a");

  // Set the download attribute with the desired file name
  link.download = fileName;

  // Create an object URL for the Blob
  link.href = URL.createObjectURL(blob);

  // Append the link to the document
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);

  // Revoke the object URL to free up memory
  URL.revokeObjectURL(link.href);
}

function CopyField({ text }: { text: string }) {
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
  }
  return (
    <div className="copy-field">
      <OutlinedInput
        id="standard-adornment-password"
        value={text}
        fullWidth
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={async () => {
                await handleCopy();
              }}
            >
              <ContentCopy />
            </IconButton>
          </InputAdornment>
        }
      />
    </div>
  );
}
