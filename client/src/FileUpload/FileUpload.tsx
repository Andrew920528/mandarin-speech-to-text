import {useState} from "react";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

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
  };

  return (
    <div>
      <input type="file" accept=".wav" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
