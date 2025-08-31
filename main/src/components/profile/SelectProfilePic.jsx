{
  /* 
  
  import React, { useEffect, useState } from "react";

function SelectProfilePic() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentProfilePicture, setCurrentProfilePicture] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const generateUniqueName = (file) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split(".").pop();
    return `profile_${timestamp}_${randomString}.${ext}`;
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // preview
    }
  };

  // Handle save (simulated for now)
  const handleSave = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/api/users/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Profile picture saved at: ${data.filePath}`);
        console.log("Saved at:", data.filePath);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }

    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Select Profile Pic</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={preview}
            alt="Preview"
            width="150"
            style={{ borderRadius: "10px", marginBottom: "10px" }}
          />
          <br />
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
}

export default SelectProfilePic;

  
  */
}
