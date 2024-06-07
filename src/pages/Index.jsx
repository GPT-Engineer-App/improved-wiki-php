import React, { useState, useEffect } from "react";
import { Container, Text, VStack, HStack, Button, Input, Box, Heading, Textarea, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Index = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });
  const toast = useToast();

  useEffect(() => {
    // Fetch articles from the backend
    fetch("/api/articles")
      .then((response) => response.json())
      .then((data) => setArticles(data))
      .catch((error) => console.error("Error fetching articles:", error));
  }, []);

  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
    setIsEditing(false);
  };

  const handleEditArticle = () => {
    setIsEditing(true);
  };

  const handleSaveArticle = () => {
    // Save the article to the backend
    fetch(`/api/articles/${selectedArticle.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedArticle),
    })
      .then((response) => response.json())
      .then((data) => {
        setArticles(articles.map((article) => (article.id === data.id ? data : article)));
        setIsEditing(false);
        toast({
          title: "Article updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => console.error("Error updating article:", error));
  };

  const handleDeleteArticle = (id) => {
    // Delete the article from the backend
    fetch(`/api/articles/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setArticles(articles.filter((article) => article.id !== id));
        setSelectedArticle(null);
        toast({
          title: "Article deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => console.error("Error deleting article:", error));
  };

  const handleAddArticle = () => {
    // Add the new article to the backend
    fetch("/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newArticle),
    })
      .then((response) => response.json())
      .then((data) => {
        setArticles([...articles, data]);
        setNewArticle({ title: "", content: "" });
        toast({
          title: "Article added.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => console.error("Error adding article:", error));
  };

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} width="100%">
        <Heading>Wikipédia Amélioré</Heading>
        <HStack width="100%" justifyContent="space-between">
          <Input placeholder="Titre de l'article" value={newArticle.title} onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} />
          <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={handleAddArticle}>
            Ajouter
          </Button>
        </HStack>
        <VStack spacing={4} width="100%">
          {articles.map((article) => (
            <Box key={article.id} p={4} borderWidth="1px" borderRadius="lg" width="100%" onClick={() => handleSelectArticle(article)}>
              <Heading size="md">{article.title}</Heading>
              <Text noOfLines={1}>{article.content}</Text>
            </Box>
          ))}
        </VStack>
        {selectedArticle && (
          <Box p={4} borderWidth="1px" borderRadius="lg" width="100%">
            {isEditing ? (
              <>
                <Input value={selectedArticle.title} onChange={(e) => setSelectedArticle({ ...selectedArticle, title: e.target.value })} />
                <Textarea value={selectedArticle.content} onChange={(e) => setSelectedArticle({ ...selectedArticle, content: e.target.value })} />
                <Button colorScheme="teal" onClick={handleSaveArticle}>
                  Enregistrer
                </Button>
              </>
            ) : (
              <>
                <Heading size="md">{selectedArticle.title}</Heading>
                <Text>{selectedArticle.content}</Text>
                <HStack spacing={4}>
                  <Button leftIcon={<FaEdit />} colorScheme="yellow" onClick={handleEditArticle}>
                    Modifier
                  </Button>
                  <Button leftIcon={<FaTrash />} colorScheme="red" onClick={() => handleDeleteArticle(selectedArticle.id)}>
                    Supprimer
                  </Button>
                </HStack>
              </>
            )}
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
