
import React from "react";

const ExportTemplate: React.FC = () => {
	return (
		<div className="space-y-2 mt-4">
			<div className="text-xs text-gray-400 font-semibold">
				Muốn kết quả tốt hơn? Sử dụng simple workflow này:
			</div>
			<button
				type="button"
				className="bg-[#2A3A4F] inline-flex items-center h-9 rounded-lg border border-[#1E2A3A] px-4 text-sm font-semibold text-gray-300 hover:bg-[#1E2A3A]"
				onClick={async () => {
                    const files = [
                    '/template/CONVERT_PROMPT.md',
                    '/template/DESIGN-TEMPLATE.md',
                    ];
                    
					for (const file of files) {
						const fileName = file.split('/').pop();
						try {
							const response = await fetch(file);
							if (!response.ok) throw new Error('Network error');
							const blob = await response.blob();
							const url = window.URL.createObjectURL(blob);
							const a = document.createElement('a');
							a.href = url;
							a.download = fileName || 'template.md';
							document.body.appendChild(a);
							a.click();
							setTimeout(() => {
								document.body.removeChild(a);
								window.URL.revokeObjectURL(url);
							}, 100);
						} catch (e) {
							console.error('Error downloading file:', e);
                            alert(`Không thể tải tệp ${fileName}`);
						}
					}
				}}
			>
				Xuất Tệp Tin Mẫu
			</button>
		</div>
	);
};

export default ExportTemplate;
