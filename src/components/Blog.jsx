import {useState, useEffect} from "react";
import Form from "./Form";

function Blog() {
	// initial loading data
	let initCategories = false;
	let initTags = false;

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

	async function fetchCategories() {
		try {
			const response = await fetch("http://localhost:3000/categories");
			if (response.ok) {
				const data = await response.json();
				setCategories(data);
				initCategories = true;
			} else {
				console.error("Errore nel caricamento delle categorie");
			}
		} catch (error) {
			console.error("Errore di rete nel caricamento delle categorie", error);
		}
	}

	// Funzione per caricare i tag dal server
	async function fetchTags() {
		try {
			const response = await fetch("http://localhost:3000/tags");
			if (response.ok) {
				const data = await response.json();
				setTags(data);
				initTags = true;
			} else {
				console.error("Errore nel caricamento dei tag");
			}
		} catch (error) {
			console.error("Errore di rete nel caricamento dei tag", error);
		}
	}

	// Salva i dati nel database
	async function saveArticle(article) {
		try {
			const response = await fetch("http://localhost:3000/api/posts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(article),
			});

			if (!response.ok) {
				throw new Error("Si è verificato un errore durante il salvataggio");
			}

			const savedArticle = await response.json();
			// Aggiorna l'elenco degli articoli con quello appena salvato
			setArticles((prevArticles) => [...prevArticles, savedArticle]);
		} catch (error) {
			console.error("Errore nel salvataggio dell'articolo:", error);
		}
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
			setArticleData({
				...articleData,
				[name]: type === "checkbox" ? checked : value,
			});
		}
	}

	function handleEdit(articleId) {
		setIsEditing(true);
		const articleToEdit = articles.find((article) => article.id === articleId);
		setArticleData(articleToEdit);
		setShowOverlay(true);
	}

	function handleFormSubmit(event) {
		event.preventDefault();

		const newArticle = {
			...articleData,
			id: articleData.id ? articleData.id : crypto.randomUUID(),
		};

		let updatedArticles;
		if (articleData.id) {
			// Modifica di un articolo esistente
			updatedArticles = articles.map((article) =>
				article.id === articleData.id ? newArticle : article,
			);
			setIsEditing(false);
		} else {
			// Aggiunta di un nuovo articolo
			updatedArticles = [...articles, newArticle];
		}

		setArticles(updatedArticles);

		// Reset del form
		setArticleData({
			title: "",
			author: "",
			content: "",
			image: "",
			category: "",
			tags: {},
			published: false,
		});

		closeOverlay();
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

	function closeOverlay() {
		setShowOverlay(false);
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
				/>
			)}

			{/* Floating Button */}
			<button
				className="fixed bottom-10 right-10 bg-blue-500 text-white p-4 rounded-full shadow-lg"
				onClick={() => setShowOverlay(true)}>
				Aggiungi Articolo
			</button>

			<div className="container mx-auto mt-12 flex justify-center text-zinc-300">
				<div className="w-full">
					{articles.length > 0 && (
						<div className="grid grid-cols-8 gap-3 justify-center items-center px-4 text-white mb-2">
							<div className="text-center font-bold">Titolo</div>
							<div className="text-center font-bold">Autore</div>
							<div className="text-center font-bold">Contenuto</div>
							<div className="text-center font-bold">Immagine</div>
							<div className="text-center font-bold">Categoria</div>
							<div className="text-center font-bold">Tags</div>
							<div className="text-center font-bold">Pubblicato</div>
							<div>Operazioni:</div>
						</div>
					)}

					{articles.map((article) => (
						<div
							className="container mx-auto grid grid-cols-8 gap-3 justify-center items-center bg-gray-800 px-4 py-2 rounded-md mb-2 text-sm"
							key={article.id}>
							<div className="text-left">{article.title}</div>
							<div className="text-left">{article.author}</div>
							<div className="text-left">{article.content}</div>
							<img
								className="w-40 rounded-md border-1 border-gray-300"
								src={article.image}
								alt=""
							/>
							<div className="text-left">
								{categories.find((cat) => cat.id === parseInt(article.category))
									?.name || "Nessuna categoria"}
							</div>
							<div className="text-center">
								{Object.keys(article.tags)
									.filter((key) => article.tags[key])
									.map((key) => {
										const tagName = tags.find(
											(tag) => tag.id === parseInt(key),
										)?.name;
										return (
											<span
												key={key}
												className="inline-block bg-green-300 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 my-2">
												{tagName || key}
											</span>
										);
									})}
							</div>

							{/* checkbox "Published" */}
							<div className="flex items-center justify-center space-x-2">
								<input
									type="checkbox"
									// name="published"
									// id="published"
									checked={article.published}
									onChange={() => handleChangePublished(article.id)}
								/>
							</div>

							<div className="flex gap-2">
								<button
									className="px-3 py-1 bg-blue-800 text-slate-200 rounded-md transition duration-200 ease-in-out hover:bg-blue-600 hover:text-white"
									onClick={() => handleEdit(article.id)}>
									<i className="fa-solid fa-pen-to-square"></i> Modifica
								</button>
								<button
									className={`px-3 py-1 rounded-md transition duration-200 ease-in-out
									${
										isEditing
											? "bg-slate-400 text-slate-900"
											: "bg-red-800 text-slate-200 hover:bg-red-600 hover:text-white cursor-pointer"
									}`}
									disabled={isEditing}
									onClick={() => handleDelete(article.id)}>
									<i className="fa-solid fa-trash-can"></i> Cancella
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Blog;
