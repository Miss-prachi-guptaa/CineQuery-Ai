import { pipeline } from "@xenova/transformers";

let extractor;

// Load model once
const getExtractor = async () => {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  return extractor;
};

export const getEmbedding = async (text) => {
  try {

    const extractor = await getExtractor();

    const output = await extractor(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);

  } catch (err) {

    console.error("Embedding Error:", err.message);
    throw err;
  }
};