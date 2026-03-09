import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createItem } from "../services/itemService";
import { ArrowLeft, CheckCircle2, Upload, X, Image as ImageIcon } from "lucide-react";

export const PostItem: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<"lost" | "found">("lost");
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "campusfind_upload");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/djklonpdx/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError("");
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      await createItem({
        title,
        description,
        location,
        type,
        imageUrl,
        userId: user.uid,
        userEmail: user.email,
        status: "open",
      });

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to post item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Back to Dashboard
      </button>

      <div className="bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Report an Item
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Provide details about the item you lost or found on campus. The more details you provide, the easier it will be to identify.
            </p>
          </div>
          
          <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></div>
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  What are you reporting?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`relative flex cursor-pointer rounded-xl border p-4 focus:outline-none transition-all ${
                      type === "lost"
                        ? "bg-indigo-50 border-indigo-600 ring-1 ring-indigo-600"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="lost"
                      className="sr-only"
                      checked={type === "lost"}
                      onChange={() => setType("lost")}
                    />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className={`block text-sm font-medium ${type === "lost" ? "text-indigo-900" : "text-gray-900"}`}>
                          I lost something
                        </span>
                        <span className={`mt-1 flex items-center text-xs ${type === "lost" ? "text-indigo-700" : "text-gray-500"}`}>
                          I'm looking for my item
                        </span>
                      </span>
                    </span>
                    {type === "lost" && (
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
                    )}
                  </label>

                  <label
                    className={`relative flex cursor-pointer rounded-xl border p-4 focus:outline-none transition-all ${
                      type === "found"
                        ? "bg-indigo-50 border-indigo-600 ring-1 ring-indigo-600"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="found"
                      className="sr-only"
                      checked={type === "found"}
                      onChange={() => setType("found")}
                    />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className={`block text-sm font-medium ${type === "found" ? "text-indigo-900" : "text-gray-900"}`}>
                          I found something
                        </span>
                        <span className={`mt-1 flex items-center text-xs ${type === "found" ? "text-indigo-700" : "text-gray-500"}`}>
                          I have someone else's item
                        </span>
                      </span>
                    </span>
                    {type === "found" && (
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
                  Item Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full rounded-xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border transition-colors"
                    placeholder="e.g., Blue Hydroflask, Apple AirPods"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-900">
                  Location <span className="text-gray-500 font-normal">(Where was it {type === "lost" ? "lost" : "found"}?)</span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="location"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="block w-full rounded-xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border transition-colors"
                    placeholder="e.g., Library 2nd Floor, Student Union"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    rows={5}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border transition-colors resize-none"
                    placeholder="Provide identifying details like color, brand, unique marks, or contents..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Photo (Optional)
                </label>
                <div className="mt-2">
                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 max-w-md">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto object-contain max-h-64"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-red-600 hover:bg-white shadow-sm transition-all"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="flex justify-center rounded-xl border border-dashed border-gray-300 px-6 py-10 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                          <span className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              capture="environment"
                              ref={fileInputRef}
                              onChange={handleImageChange}
                            />
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full sm:w-auto px-6 py-3 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </>
                ) : (
                  "Post Item"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
