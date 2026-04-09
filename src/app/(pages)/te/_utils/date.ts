import { DateOnly } from "../_types/DateOnly";

const uiDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
const handlerDateRegex = /^\d{2}-\d{2}-\d{4}$/;

function isValidIsoDate(value: string): boolean {
	try {
		DateOnly.fromString(value);
		return true;
	} catch {
		return false;
	}
}

export function formatTypingDdMmYyyy(value: string): string {
	const digits = value.replace(/\D/g, "").slice(0, 8);
	if (digits.length <= 2) return digits;
	if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
	return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function toIsoDateString(value: string): string | null {
	if (!value) {
		return null;
	}

	if (isoDateRegex.test(value)) {
		return isValidIsoDate(value) ? value : null;
	}

	if (uiDateRegex.test(value)) {
		const [day, month, year] = value.split("/");
		const iso = `${year}-${month}-${day}`;
		return isValidIsoDate(iso) ? iso : null;
	}

	if (handlerDateRegex.test(value)) {
		const [month, day, year] = value.split("-");
		const iso = `${year}-${month}-${day}`;
		return isValidIsoDate(iso) ? iso : null;
	}

	return null;
}

export function normalizeDateToHandler(value: string): string {
	const iso = toIsoDateString(value);
	if (!iso) {
		return value;
	}

	const [year, month, day] = iso.split("-");
	return `${month}-${day}-${year}`;
}

export function normalizeDateToIso(value: string): string {
	return toIsoDateString(value) ?? value;
}

export function toDdMmYyyy(value: string): string {
	if (!value) {
		return "";
	}

	if (uiDateRegex.test(value)) {
		return value;
	}

	if (isoDateRegex.test(value)) {
		const [year, month, day] = value.split("-");
		return `${day}/${month}/${year}`;
	}

	if (handlerDateRegex.test(value)) {
		const [month, day, year] = value.split("-");
		return `${day}/${month}/${year}`;
	}

	return formatTypingDdMmYyyy(value);
}
