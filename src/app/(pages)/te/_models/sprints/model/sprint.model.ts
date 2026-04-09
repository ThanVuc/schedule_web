import { SprintAiPresignResponseSchema, type SprintAiFileItem } from "../schema/sprint.schema";

export class SprintAiFileMetadataModel {
	object_key: string;
	size: number;

	constructor(objectKey: string, size: number) {
		this.object_key = objectKey;
		this.size = size;
	}

	static fromSchema(input: SprintAiFileItem): SprintAiFileMetadataModel {
		return new SprintAiFileMetadataModel(input.object_key, input.size);
	}
}

export class SprintAiPresignedUrlItemModel {
	index: number;
	presigned_url: string;

	constructor(index: number, presignedUrl: string) {
		this.index = index;
		this.presigned_url = presignedUrl;
	}
}

export class SprintAiPresignResponseModel {
	items: SprintAiPresignedUrlItemModel[];

	constructor(items: SprintAiPresignedUrlItemModel[]) {
		this.items = items;
	}

	static fromApi(payload: unknown): SprintAiPresignResponseModel {
		const parsed = SprintAiPresignResponseSchema.parse(payload);
		return new SprintAiPresignResponseModel(
			parsed.items.map(
				(item) => new SprintAiPresignedUrlItemModel(item.index, item.presigned_url),
			),
		);
	}
}
