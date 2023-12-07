function Form({
	articleData,
	handleChange,
	handleFormSubmit,
	closeOverlay,
	isEditing,
	categories,
	tags,
}) {
	return (
		<div className="overlay fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
			<div className="bg-white p-6 rounded-lg shadow-lg">
				<form
					onSubmit={handleFormSubmit}
					className="flex flex-col items-center justify-center space-y-4 w-full max-w-2xl mx-auto">
					{/* Titolo */}
					<div className="flex justify-between items-center space-x-2 w-full">
						<label className="text-white min-w-[7rem]" htmlFor="title">
							Titolo:
						</label>
						<input
							className="border rounded-md px-2 py-1 flex-grow"
							type="text"
							name="title"
							id="title"
							value={articleData.title}
							onChange={handleChange}
						/>
					</div>

					{/* Autore */}
					<div className="flex justify-between items-center space-x-2 w-full">
						<label className="text-white min-w-[7rem]" htmlFor="author">
							Autore:
						</label>
						<input
							className="border rounded-md px-2 py-1 flex-grow"
							type="text"
							name="author"
							id="author"
							value={articleData.author}
							onChange={handleChange}
						/>
					</div>

					{/* Immagine */}
					<div className="flex justify-between items-center space-x-2 w-full">
						<label className="text-white min-w-[7rem]" htmlFor="image">
							Immagine:
						</label>
						<input
							className="border rounded-md px-2 py-1 flex-grow"
							type="text"
							name="image"
							id="image"
							value={articleData.image}
							onChange={handleChange}
						/>
					</div>

					{/* Contenuto */}
					<div className="flex justify-between items-center space-x-2 w-full">
						<label className="text-white min-w-[7rem]" htmlFor="content">
							Contenuto:
						</label>
						<textarea
							className="border rounded-md px-2 py-1 w-full"
							name="content"
							id="content"
							value={articleData.content}
							onChange={handleChange}
						/>
					</div>

					{/* Categoria */}
					<div className="flex justify-between items-center space-x-2 w-full">
						<label className="text-white min-w-[7rem]" htmlFor="category">
							Categoria:
						</label>
						<select
							className="border rounded-md px-2 py-1 w-full"
							name="category"
							value={articleData.category}
							onChange={handleChange}>
							<option value="">Seleziona una categoria</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
					</div>

					{/* Tags */}
					<div className="py-5 flex justify-between items-center space-x-2 w-full">
						<label className="text-white min-w-[7rem]">Tags:</label>
						<div className="flex flex-wrap gap-3 w-full">
							{tags.map((tag) => (
								<div key={tag.id} className="flex items-center">
									<input
										id={`tag-${tag.id}`}
										type="checkbox"
										name="tags"
										value={tag.id}
										checked={articleData.tags[tag.id] || false}
										onChange={handleChange}
										className="mr-2"
									/>
									<label
										htmlFor={`tag-${tag.name}`}
										className="text-violet-300">
										{tag.name}
									</label>
								</div>
							))}
						</div>
					</div>

					<div className="flex gap-5">
						{/* Bottone di invio */}
						<button
							type="submit"
							className={`px-4 py-2 rounded transition duration-200 ease-in-out
						${
							isEditing
								? "bg-orange-800 text-slate-200 hover:bg-orange-600 hover:text-white cursor-pointer"
								: "bg-purple-800 text-slate-200  hover:bg-purple-600 hover:text-white cursor-pointer"
						}`}>
							{isEditing ? "Modifica" : "Aggiungi"}
						</button>

						{/* bottone per chiudere l'overlay */}
						<button
							onClick={closeOverlay}
							className="px-4 py-2 rounded transition duration-200 ease-in-out bg-teal-600 text-slate-200  hover:bg-teal-600 hover:text-white cursor-pointer">
							Chiudi
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Form;
