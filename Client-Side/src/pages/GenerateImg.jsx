import { Edit, Hash, Image, Download } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImg = () => {
  const ImageStyle = [
    "Realistic",
    "Cartoon",
    "Anime",
    "Abstract",
    "Minimalist",
    "Vintage",
    "Modern",
    "3d",
    "Ghibli Style",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [inputValue, setInputValue] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const prompt = `Generate an image of ${inputValue} in ${selectedStyle} style`;
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || "Failed to generate article");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while generating the article"
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
          <Image className="w-6 text-[#6855EC]" />
          <h1 className="text-xl font-semibold">Describe Your Image</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Keyword</p>
        <textarea
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 "
          placeholder="Describe the image you want to generate"
          required
        />

        <p className="mt-4 text-sm font-medium">Style</p>

        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {ImageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              className={`text-sm px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === item
                  ? "bg-blue-50 text-[#6755EB]"
                  : "text-gray-500 border-gray-300"
              }`}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-[#6855EC] transition"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p>Make this image public</p>
        </div>

        <br />
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#6755EB] to-[#7364e3] text-white px-4 py-2 text-sm rounded-lg cursor-pointer active:scale-95 transition duration-200"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Image className="w-5" />
          )}
          Generate Image
        </button>
      </form>

      {/* right col */}
      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-[#6855EC]" />
            <h1 className="text-xl font-semibold">Generated Image Preview</h1>
          </div>

          {content && (
            <a
              href={content}
              download="generated-image.png"
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
              <Image className="w-9 h-9" />
              <p>Enter a topic and click "Generate Image" to get started.</p>
            </div>
          </div>
        ) : (
          <div className="h-full mt-3">
            <img
              src={content}
              alt="Generated Image"
              className="w-full rounded-lg border"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImg;
