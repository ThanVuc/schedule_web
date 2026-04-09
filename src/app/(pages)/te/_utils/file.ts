const extensionToMimeType: Record<string, string> = {
	md: "text/markdown",
	markdown: "text/markdown",
	txt: "text/plain",
	pdf: "application/pdf",
	doc: "application/msword",
	docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	xls: "application/vnd.ms-excel",
	xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export function getFileExtension(fileName: string): string | null {
	const normalizedName = fileName.trim().toLowerCase();
	const matched = normalizedName.match(/\.([a-z0-9]+)$/i);
	return matched?.[1] ?? null;
}

export function getMimeTypeFromFile(file: File): string {
	const extension = getFileExtension(file.name);
	if (extension && extensionToMimeType[extension]) {
		return extensionToMimeType[extension];
	}

	if (file.type && file.type.trim().length > 0) {
		return file.type;
	}

	return "application/octet-stream";
}
