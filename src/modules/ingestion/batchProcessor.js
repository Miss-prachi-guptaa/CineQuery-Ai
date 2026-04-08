// src/modules/ingestion/batchProcessor.js

// 🔹 Create batches of size N
export const createBatches = (data, batchSize = 50) => {
  const batches = [];

  for (let i = 0; i < data.length; i += batchSize) {
    batches.push(data.slice(i, i + batchSize));
  }

  return batches;
};

// 🔹 Process each batch sequentially

// Retry wrapper for LLM call
export const processWithRetry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      console.log(`⚠️ Retry ${i + 1}/${retries}`);

      // exponential backoff
      const delay = 2000 * (i + 1);

      await new Promise(res => setTimeout(res, delay));
    }
  }

  throw new Error("❌ Failed after retries");
};

export const processBatchesInParallel = async (
  batches,
  processFn,
  concurrency = 5
) => {
  const results = [];

  for (let i = 0; i < batches.length; i += concurrency) {
    const currentGroup = batches.slice(i, i + concurrency);

    const promises = currentGroup.map(batch =>
      processWithRetry(() => processFn(batch))
    );

    const batchResults = await Promise.all(promises);

    results.push(...batchResults);
  }

  return results;
};