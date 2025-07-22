import { Download, Edit, Eraser, Hash, Scissors } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [inputValue, setInputValue] = useState("");
  const [objectValue, setObjectValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (objectValue.split(" ").length > 1) {
        return toast.error("Please provide a single object description.");
      }

      const formData = new FormData();
      formData.append("image", inputValue);
      formData.append("object", objectValue);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while removing the object"
      );
    }

    setLoading(false);
  };

  return (
    <div className="h-full overlay-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* left col */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Scissors className="w-6 text-[#6855EC]" />
          <h1 className="text-xl font-semibold">Object Remover</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          onChange={(e) => setInputValue(e.target.files[0])}
          type="file"
          accept="image/*"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />

        <p className="mt-6 text-sm font-medium">
          Describe the object you want to remove
        </p>

        <textarea
          onChange={(e) => setObjectValue(e.target.value)}
          value={objectValue}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 "
          placeholder="e.g., 'the person on the left', 'the tree in the background'"
          required
        />

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#6755EB] to-[#7364e3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer active:scale-95 transition duration-200"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Scissors className="w-5" />
          )}
          Remove Object
        </button>
      </form>

      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eraser className="w-5 h-5 text-[#6855EC]" />
            <h1 className="text-xl font-semibold">Processed Image</h1>
          </div>

          {content && (
            <a
              href={content}
              download="bg-removed-image.png"
              className="p-2 rounded-md bg-[#6855EC] text-white hover:bg-[#5743d3] transition active:scale-95"
              title="Download Image"
            >
              <Download className="w-5 h-5" />
            </a>
          )}
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Eraser className="w-9 h-9" />
              <p>
                Upload an image and click "Remove Background" to get started.
              </p>
            </div>
          </div>
        ) : (
          <img
            src={content}
            alt="image with background removed"
            className="mt-3 w-full h-full rounded-lg border"
          />
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
