<<<<<<< HEAD
// 1.LLM call for structured data(object form) of pdf 
//2.if 1000 movie exist then LLM call = 1k 
//3.optimize it
// send it in batch of 50 , 50 ,...20 call goes
// mistake what LLM does here->what is any error occcur in any batches 
it did not retrive it 
// So now first upload this pdf into LLM and parellaly execute batch of 
//(50,50,50,50,50)(5 execute in parellel)
// is tarah 4 batches banegi and retry logic use if any error occcur
//now do indexing on each node 
//Now we have 1000 movies data now insert it into graphdb


//
=======
# 🎬 CineQuery AI

An AI-powered movie query system that extracts structured data from PDFs and enables complex relational queries using modern backend architecture.

---

## 🚀 Features

* 📄 **PDF Ingestion Pipeline**
  Extracts raw movie data from PDF files

* 🧠 **LLM-Based Data Extraction (Groq)**
  Converts unstructured text into structured JSON

* 📦 **Batch Processing System**
  Handles large datasets efficiently using batching

* ⏱ **Rate Limit Handling**
  Implements delay and retry mechanisms for stable API usage

* 🔄 **Fault-Tolerant Pipeline**
  Includes error handling and retry with backoff

* 🕸 **Graph-Ready Architecture (Upcoming)**
  Designed for Neo4j to support complex relational queries

---

## 🧠 Problem Statement

Traditional databases struggle with complex relational queries like:

* Movies directed by a specific director
* Actors who worked across multiple genres
* Award-winning actors across different movies

This system solves it using:

* **LLM for structured extraction**
* **Graph DB (Neo4j) for relationships**
* **Vector DB (planned) for semantic search**

---

## ⚙️ Tech Stack

* **Backend:** Node.js
* **LLM:** Groq (LLaMA 3.1)
* **Parsing:** PDF processing
* **Database (Planned):** Neo4j (Graph DB), MongoDB (Vector Search)

---

## 🏗 Architecture

```
PDF → Text Extraction → Chunking → Batching → LLM → Structured JSON → Graph DB
```

---

## 📊 Current Status

* ✅ PDF parsing
* ✅ Chunking & batching
* ✅ LLM extraction
* ✅ Rate-limit handling
* 🔜 Graph DB integration (Neo4j)
* 🔜 Query engine

---

## 💡 Key Highlights

* Designed with **production-level considerations**
* Handles **rate limits and failures gracefully**
* Separates **data extraction from querying layer**
* Scalable architecture for large datasets

---

## 📌 Future Improvements

* Neo4j integration for graph queries
* Vector search for semantic recommendations
* REST API for user queries
* Frontend UI for interaction

---

## 👩‍💻 Author

Prachi
>>>>>>> 0cd56934b77b4c9247b1ca927578a5879671ad9f
