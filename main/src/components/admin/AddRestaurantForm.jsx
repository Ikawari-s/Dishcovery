import React, { useState } from "react";
import { addRestaurantApi } from "../../api/adminApi";

function AddRestaurantForm() {
  const [form, setForm] = useState({
    name: "",
    cuisine: "",
    address: { street: "", city: "", zipcode: "" },
    rating: 0,
    is_open: true,
    tags: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
        rating: Number(form.rating),
      };

      const res = await addRestaurantApi(data);
      setMessage(res.message);
      setForm({
        name: "",
        cuisine: "",
        address: { street: "", city: "", zipcode: "" },
        rating: 0,
        is_open: true,
        tags: "",
        image: "",
      });
    } catch (err) {
      setMessage(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4 text-black">Add Restaurant</h2>
      {message && <p className="mb-2 text-red-500 text-black">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Restaurant Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded text-black"
        />
        <input
          type="text"
          name="cuisine"
          placeholder="Cuisine"
          value={form.cuisine}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded text-black"
        />
        <input
          type="text"
          name="address.street"
          placeholder="Street"
          value={form.address.street}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded text-black"
        />
        <input
          type="text"
          name="address.city"
          placeholder="City"
          value={form.address.city}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded text-black"
        />
        <input
          type="text"
          name="address.zipcode"
          placeholder="Zipcode"
          value={form.address.zipcode}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded text-black"
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        />
        <label className="flex items-center space-x-2 text-black">
          <input
            type="checkbox"
            name="is_open"
            checked={form.is_open}
            onChange={handleChange}
          />
          <span>Open</span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Adding..." : "Add Restaurant"}
        </button>
      </form>
    </div>
  );
}

export default AddRestaurantForm;
