import React, { useState } from "react";

function SelectProfilePic() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

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
  const handleSave = () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }
    const newFileName = generateUniqueName(selectedFile);

    // Simulate "saving" inside /profilepictures folder
    console.log("Saving as:", `/profilepictures/${newFileName}`);

    // In real app: send file -> backend/Firebase/etc.
    alert(`Profile picture saved as: ${newFileName}`);

    // Reset
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
