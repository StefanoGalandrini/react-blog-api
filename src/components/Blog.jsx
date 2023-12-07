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
			// Aggiorna l'elenco degli articoli con quello appena salvato
			setArticles((prevArticles) => [...prevArticles, savedArticle]);
			resetForm();
		} catch (error) {
			console.log("Errore nel salvataggio dell'articolo:", error);
		}
	}

	async function updateArticle(article) {
		// Logica per aggiornare un articolo
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
	}

	// controllo se published è true
	useEffect(() => {
		if (articleData.published) {
			alert("Questo articolo è stato impostato come pubblicato!");
		}
	}, [articleData.published]);

	// functions
	function handleChange(event) {
		const {name, value, checked, type} = event.target;

		// if (type === "checkbox" && name === "tags") {
		// 	setArticleData((prevState) => ({
		// 		...prevState,
		// 		tags: {
		// 			...prevState.tags,
		// 			[value]: checked,
		// 		},
		// 	}));
		// } else {
		// Gestisci gli altri input
		setArticleData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		// }
	}

	function handleEdit(articleId) {
		setIsEditing(true);
		const articleToEdit = articles.find((article) => article.id === articleId);
		setArticleData(articleToEdit);
		setShowOverlay(true);
	}

	function handleFormSubmit(event) {
		event.preventDefault();
		if (isEditing) {
			updateArticle(articleData);
		} else {
			saveArticle(articleData);
		}
	}

	function handleDelete(id) {
		const updatedArticles = articles.filter((article) => article.id !== id);
		setArticles(updatedArticles);
	}

	function handleChangePublished(articleId) {
		const updatedArticles = articles.map((article) => {
			if (article.id === articleId) {
				if (!article.published) {
					alert("Questo articolo è stato impostato come pubblicato!");
				}
				return {...article, published: !article.published};
			}
			return article;
		});

		setArticles(updatedArticles);
	}

	return (
		<div>
			{showOverlay && (
				<Form
					articleData={articleData}
					handleChange={handleChange}
					handleFormSubmit={handleFormSubmit}
					closeOverlay={() => setShowOverlay(false)}
					isEditing={isEditing}
					categories={categories}
					tags={tags}
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
