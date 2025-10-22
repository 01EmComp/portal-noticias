import { db } from "./firebaseConfig.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Cria uma notícia no Firestore
 * @param {Object} newsData - Dados da notícia
 * @param {string} newsData.title - Título da notícia
 * @param {string} newsData.content - Conteúdo
 * @param {string} newsData.writerID - UID do autor
 * @param {string} newsData.writerName - Nome do autor
 * @param {string} newsData.category - Categoria da notícia
 * @param {Array<string>} newsData.tags - Tags da notícia
 * @param {string} newsData.imageUrl - URL da imagem
 * @param {boolean} newsData.published - Publicada ou não
 */

// Criar notícia
export async function createNews(newsData) {
  try {
    await addDoc(collection(db, "news"), {
      title: newsData.title,
      content: newsData.content,
      writerID: newsData.writerID,
      writerName: newsData.writerName,
      category: newsData.category,
      tags: newsData.tags || [],
      imageUrl: newsData.imageUrl || "",
      published: newsData.published || false,
      createdIn: serverTimestamp(),
      updatedIn: serverTimestamp(),
    });

    alert("Notícia criada com sucesso!");
  } catch (e) {
    console.error("Erro ao adicionar notícia: ", e);
  }
}
