import {useState, useEffect} from "react";
import Form from "./Form";

function Blog() {
	// categories and tags
	const categories = [
		"Programmazione e Sviluppo Web",
		"Framework per Frontend e Backend",
		"Gestione database relazionali",
		"Argomenti di interesse generale",
	];
	const tags = [
		"Frontend",
		"Backend",
		"HTML/CSS",
		"Javascript",
		"PHP",
		"MySql",
		"Vue JS",
		"React",
		"Laravel",
		"Express JS",
		"Node JS",
	];

	const initialTags = {};
	tags.forEach((tag) => {
		initialTags[tag] = false;
	});

	const initialData = {
		title: "",
		author: "",
		content: "",
		image: "https://picsum.photos/300/200",
		category: "",
		tags: initialTags,
		published: false,
	};

	const [articleData, setArticleData] = useState(initialData);
	const [articles, setArticles] = useState([]);
	const [showOverlay, setShowOverlay] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (articleData.published) {
			alert("Questo articolo è stato impostato come pubblicato!");
		}
	}, [articleData.published]);

	// functions
	function handleChange(event) {
		const {name, value, type, checked} = event.target;
		if (type === "checkbox" && name === "tags") {
			setArticleData({
				...articleData,
				tags: {...articleData.tags, [value]: checked},
			});
		} else {
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
		setArticleData(initialData); // Reset del form
	}

	function handleDelete(id) {
		const updatedArticles = articles.filter((article) => article.id !== id);
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
							<div className="text-left">{article.category}</div>
							<div className="text-center">
								{Object.keys(article.tags)
									.filter((key) => article.tags[key])
									.map((key) => (
										<span
											key={key}
											className="inline-block bg-green-300 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 my-2">
											{key}
										</span>
									))}
							</div>

							{/* checkbox "Published" */}
							<div className="flex items-center justify-center space-x-2">
								<input
									type="checkbox"
									name="published"
									id="published"
									checked={articleData.published}
									onChange={handleChange}
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
