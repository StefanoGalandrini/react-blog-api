function Card({
	article,
	handleEdit,
	handleDelete,
	isEditing,
	handleChangePublished,
}) {
	const articleTags = article.tags ? article.tags.map((tag) => tag.name) : [];
	const articleCategory = article.category
		? article.category.name
		: "Nessuna categoria";

	return (
		<div className="container mx-auto mt-12 flex justify-center text-zinc-300">
			<div className="w-full">
				{article.length > 0 && (
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
					<div className="text-left">{article.category.name}</div>
					<div className="text-center">
						{articleTags.map((tagName, index) => (
							<span
								key={index}
								className="inline-block bg-green-300 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 my-2">
								{tagName}
							</span>
						))}
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
			</div>
		</div>
	);
}

export default Card;
