import { Edit, SquarePen } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLengthOptions = [
    { length: "Short (300-500 words)", value: 400 },
    { length: "Medium (500-1000 words)", value: 800 },
    { length: "Long (1000+ words)", value: 1200 },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLengthOptions[0]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const prompt = `Write an article about ${inputValue} with a length of ${selectedLength.value}`;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.value },
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
          <SquarePen className="w-6 text-[#6855EC]" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          type="text"
          placeholder="Enter article topic"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 "
          required
        />

        <p className="mt-4 text-sm font-medium">Article Length</p>

        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {articleLengthOptions.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              className={`text-sm px-4 py-1 border rounded-full cursor-pointer ${
                selectedLength.value === item.value
                  ? "bg-blue-50 text-[#6755EB]"
                  : "text-gray-500 border-gray-300"
              }`}
              key={index}
            >
              {item.length}
            </span>
          ))}
        </div>
        <br />

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#6755EB] to-[#7364e3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer active:scale-95 transition duration-200"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Edit className="w-5" />
          )}
          Generate Article
        </button>
      </form>

      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-[#6855EC]" />
          <h1 className="text-xl font-semibold">Generated Article Preview</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Edit className="w-9 h-9" />
              <p>
                Enter a topic and click "Generate Article" to see the preview.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;
