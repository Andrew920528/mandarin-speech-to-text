import { Button, TextField } from "@mui/material";
import { useState } from "react";
import "../styles/retrieve_text.css";
import { HOST } from "../App";
export function RetrieveText() {
  const [keyName, setKeyName] = useState("");
  const [loading, setLoading] = useState(false);
  async function submitForm() {
    const uploadUrl = HOST + "/retrieve";
    try {
      setLoading(true);
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_name: keyName }),
      });

      // Check the content type of the response
      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        // The response is JSON, likely containing an error message
        const errorResponse = await response.json();
        console.warn("Error:", errorResponse.msg);
        alert(errorResponse.msg); // Optional: show a user-friendly alert
      } else if (contentType && contentType.includes("text/plain")) {
        // The response is a file, likely the transcript
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${keyName}.txt`; // Set the default file name for download
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error("Unexpected content type:", contentType);
      }
    } catch (error) {
      console.error("Error transcribing file:", error);

      alert("Error transcribing file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="retrieve-text">
      <TextField
        id="outlined-basic"
        label="Enter retrieval key"
        variant="outlined"
        value={keyName}
        onChange={(e) => setKeyName(e.target.value)}
        fullWidth
      />
      <Button
        variant="outlined"
        onClick={() => {
          submitForm();
        }}
        disabled={loading}
      >
        Download
      </Button>
      <div className=" --label --center-text">
        Enter the key to retrieve document. If the document is not ready, you
        can close the tab and come back later.
      </div>
    </div>
  );
}
