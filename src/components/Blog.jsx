import {useState, useEffect} from "react";
import Form from "./Form";
import Card from "./Card";

function Blog() {
	// initial loading data
	let initCategories = false;
	let initTags = false;
	let initArticles = false;

	// states
	const [articles, setArticles] = useState([]);
	const [categories, setCategories] = useState([]);
	const [tags, setTags] = useState([]);
	const [showOverlay, setShowOverlay] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [formErrors, setFormErrors] = useState({});
	const [articleData, setArticleData] = useState({
		title: "",
		author: "",
		content: "",
		image: "https://picsum.photos/300/200",
		category: "",
		tags: {},
		published: false,
	});

	// Carica categorie e tag all'avvio
	useEffect(() => {
		if (initCategories) {
			return;
		}
		fetchCategories();
	}, []);

	useEffect(() => {
		if (initTags) {
			return;
		}
		fetchTags();
	}, []);

	useEffect(() => {
		if (initArticles) {
			return;
		}
		fetchArticles();
	}, []);

	// Funzione per caricare le categorie dal server
	async function fetchCategories() {
		try {
			const response = await fetch("http://localhost:3000/categories");
			const data = await response.json();
			setCategories(data);
			initCategories = true;
		} catch (error) {
			console.log("Errore di rete nel caricamento delle categorie", error);
		}
	}

	// Funzione per caricare i tag dal server
	async function fetchTags() {
		try {
			const response = await fetch("http://localhost:3000/tags");
			const data = await response.json();
			setTags(data);
			initTags = true;
		} catch (error) {
			console.log("Errore di rete nel caricamento dei tag", error);
		}
	}

	// Funzione per caricare gli articoli dal server
	async function fetchArticles() {
		try {
			const response = await fetch("http://localhost:3000/posts");
			const data = await response.json();
			setArticles(data);
			initArticles = true;
		} catch (error) {
			console.log("Errore di rete nel caricamento degli articoli", error);
		}
	}

	// Salva i dati nel database
	async function saveArticle(article) {
		try {
			const response = await fetch("http://localhost:3000/posts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(article),
			});
			const savedArticle = await response.json();
			console.log("Articolo salvato:", savedArticle);
			// Aggiorna l'elenco degli articoli con quello appena salvato
			setArticles((prevArticles) => [...prevArticles, savedArticle]);
			resetForm();
		} catch (error) {
			console.log("Errore nel salvataggio dell'articolo:", error);
		}
	}

	async function updateArticle(article) {
		// Prepara il payload per l'update
		const payload = {
			title: article.title,
			author: article.author,
			content: article.content,
			image: article.image,
			published: article.published,
			categoryId: parseInt(article.categoryId),
			tags: article.tags.map((tag) => ({id: tag.id})),
		};
		try {
			// Esegui la chiamata PUT al server
			const response = await fetch(
				`http://localhost:3000/posts/${article.slug}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				},
			);
			if (!response.ok) {
				throw new Error("Errore durante l'aggiornamento dell'articolo");
			}
			const updatedArticle = await response.json();
			console.log("Articolo aggiornato:", updatedArticle);
			// Aggiorna la lista degli articoli
			setArticles((prevArticles) =>
				prevArticles.map((a) =>
					a.id === updatedArticle.id ? updatedArticle : a,
				),
			);
			resetForm();
		} catch (error) {
			console.error("Errore durante l'aggiornamento dell'articolo:", error);
		}
	}

	// validate form
	function validateForm(data) {
		let errors = {};
		if (!data.title) errors.title = "Il titolo è obbligatorio";
		if (!data.author) errors.author = "L'autore è obbligatorio";
		if (!data.content) errors.content = "Il contenuto è obbligatorio";
		if (!data.category) errors.category = "Il contenuto è obbligatorio";
		if (!data.tags) errors.tags = "Il contenuto è obbligatorio";
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	}

	async function handleDelete(articleId) {
		try {
			// Trova l'articolo da eliminare per ottenere il suo slug
			const articleToDelete = articles.find(
				(article) => article.id === articleId,
			);
			if (!articleToDelete) {
				throw new Error("Articolo non trovato");
			}
			// Invia richiesta DELETE al server usando lo slug
			const response = await fetch(
				`http://localhost:3000/posts/${articleToDelete.slug}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			if (!response.ok) {
				throw new Error("Errore nella cancellazione dell'articolo");
			}
			// Aggiorna lo stato rimuovendo l'articolo cancellato
			const updatedArticles = articles.filter(
				(article) => article.id !== articleId,
			);
			setArticles(updatedArticles);
		} catch (error) {
			console.error("Errore nella cancellazione dell'articolo:", error);
		}
	}

	// Funzione per resettare il form
	function resetForm() {
		setArticleData({
			title: "",
			author: "",
			content: "",
			image: "https://picsum.photos/300/200",
			category: "",
			tags: {},
			published: false,
		});
		setIsEditing(false);
		setShowOverlay(false);
		setFormErrors({});
	}

	// functions
	function handleChange(event) {
		const {name, value, checked, type} = event.target;
		if (type === "checkbox" && name === "tags") {
			setArticleData((prevState) => ({
				...prevState,
				tags: {
					...prevState.tags,
					[value]: checked,
				},
			}));
		} else {
			// Gestisci gli altri input
			setArticleData((prev) => ({
				...prev,
				[name]: type === "checkbox" ? checked : value,
			}));
		}
	}

	function handleEdit(articleId) {
		setIsEditing(true);
		const articleToEdit = articles.find((article) => article.id === articleId);
		const articleTags = {};
		articleToEdit.tags.forEach((tag) => {
			articleTags[tag.id] = true;
		});
		setArticleData({
			...articleToEdit,
			tags: articleTags,
			category: articleToEdit.category.id,
		});
		setShowOverlay(true);
	}

	function handleFormSubmit(event) {
		event.preventDefault();
		if (!validateForm(articleData)) {
			return;
		}
		const formData = {
			...articleData,
			categoryId: parseInt(articleData.category),
			tags: Object.keys(articleData.tags)
				.filter((key) => articleData.tags[key])
				.map((key) => ({id: parseInt(key)})),
			published: articleData.published,
		};
		if (isEditing) {
			updateArticle(formData);
		} else {
			saveArticle(formData);
		}
	}

	function handleChangePublished(articleId) {
		const updatedArticles = articles.map((article) => {
			if (article.id === articleId) {
				const newPublishedStatus = !article.published;
				if (newPublishedStatus) {
					alert("Questo articolo è stato impostato come pubblicato!");
				}
				return {...article, published: newPublishedStatus};
			}
			return article;
		});
		setArticles(updatedArticles);
	}

	function closeOverlay() {
		setShowOverlay(false);
		setIsEditing(false);
		resetForm();
	}

	return (
		<div>
			{showOverlay && (
				<Form
					articleData={articleData}
					handleChange={handleChange}
					handleFormSubmit={handleFormSubmit}
					closeOverlay={closeOverlay}
					isEditing={isEditing}
					categories={categories}
					tags={tags}
					formErrors={formErrors}
				/>
			)}

			{/* Floating Button */}
			<button
				className="fixed bottom-10 right-10 bg-blue-500 text-white p-4 rounded-full shadow-lg"
				onClick={() => setShowOverlay(true)}>
				Aggiungi Articolo
			</button>

			<div>
				{articles.map((article) => (
					<Card
						key={article.id}
						article={article}
						handleEdit={handleEdit}
						handleDelete={handleDelete}
						handleChangePublished={handleChangePublished}
						isEditing={isEditing}
					/>
				))}
			</div>
		</div>
	);
}

export default Blog;
