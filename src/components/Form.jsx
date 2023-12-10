import {useState} from "react";

function Form({
	articleData,
	handleChange,
	handleFormSubmit,
	closeOverlay,
	isEditing,
	categories,
	tags,
	formErrors,
	serverUrl,
}) {
	const [imagePreview, setImagePreview] = useState(null);

	function handleImageChange(e) {
		handleChange(e);
		if (e.target.files && e.target.files[0]) {
			const fileReader = new FileReader();
			fileReader.onload = (e) => {
				setImagePreview(e.target.result);
			};
			fileReader.readAsDataURL(e.target.files[0]);
		}
	}

	function createTagCheckboxes() {
		return tags.map((tag) => (
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
				<label htmlFor={`tag-${tag.id}`} className="text-violet-300">
					{tag.name}
				</label>
			</div>
		));
	}

	return (
		<div className="overlay fixed inset-0 bg-gray-700 bg-opacity-80 flex justify-center items-center">
			<div className="bg-cyan-950 p-6 rounded-lg shadow-lg border-2">
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
						{formErrors.title && (
							<span className="text-red-500">{formErrors.title}</span>
						)}
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
						{formErrors.title && (
							<span className="text-red-500">{formErrors.author}</span>
						)}
					</div>

					{/* Immagine */}
					<div className="flex justify-between items-center space-x-2 w-full">
						<div className="w-full md:w-1/2">
							<label className="text-white min-w-[7rem]" htmlFor="image">
								Immagine:
							</label>
							<input
								type="file"
								name="image"
								id="image"
								onChange={handleImageChange}
								className="border rounded-md px-2 py-1 flex-grow text-gray-400"
							/>
						</div>

						{/* Anteprima Immagine */}
						<div className="px-2 w-full md:w-1/2">
							{isEditing && articleData.imageUrl ? (
								<img
									src={`${serverUrl}/${articleData.image.replace(/\\/g, "/")}`}
									alt="Immagine corrente"
									className="w-60 border-2 border-white rounded-md ml-auto"
								/>
							) : imagePreview ? (
								<img
									src={imagePreview}
									alt="Anteprima immagine"
									className="w-60 border-2 border-white rounded-md ml-auto"
								/>
							) : null}
						</div>
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
						{formErrors.title && (
							<span className="text-red-500">{formErrors.content}</span>
						)}
					</div>

					{/* Categoria */}
					<div className="flex justify-between items-center space-x-2 w-full">
						<label className="text-white min-w-[7rem]" htmlFor="category">
							Categoria:
						</label>
						<select
							className="border rounded-md px-2 py-1 flex-grow"
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
						{formErrors.title && (
							<span className="text-red-500">Seleziona una categoria</span>
						)}
					</div>

					{/* Tags */}
					<div className="py-5 flex justify-between items-center space-x-2 w-full">
						<label className="text-white min-w-[7rem]">Tags:</label>
						<div className="flex flex-wrap gap-3 w-full">
							{createTagCheckboxes()}
						</div>
						{formErrors.title && (
							<span className="text-red-500">Seleziona almeno un tag</span>
						)}
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
							className="px-4 py-2 rounded transition duration-200 ease-in-out  bg-gray-900 text-slate-200  hover:bg-gray-800 hover:text-white cursor-pointer">
							Chiudi
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Form;
