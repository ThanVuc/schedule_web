'use server';

import { promises as fs } from 'fs';
import path from 'path';

// Định nghĩa kiểu dữ liệu cho log
interface LogData {
  errorId: string;
  timestamp: string;
  errorName: string;
  errorCause: string;
}

// Đường dẫn đến thư mục logs trong src/components/logs
const logDir = path.join(process.cwd(), 'src', 'logs');
const maxFileSize = 1 * 1024 * 1024; // 1MB
const maxFilesBeforeZip = 4; // Nén khi có đủ 4 file

// Đảm bảo thư mục logs tồn tại
async function ensureLogDir(): Promise<void> {
  if (!await fs.access(logDir).catch(() => false)) {
    await fs.mkdir(logDir, { recursive: true });
  }
}

// Tìm file log hiện tại hoặc tạo file mới nếu cần
async function getCurrentLogFile(): Promise<string> {
  await ensureLogDir();
  const files = (await fs.readdir(logDir))
    .filter((file) => file.startsWith('errors.') && file.endsWith('.log'))
    .sort(); // Sắp xếp để lấy file mới nhất

  let currentFile = files.length > 0 ? files[files.length - 1] : null;
  let currentFilePath = currentFile ? path.join(logDir, currentFile) : null;

  // Nếu không có file hoặc file hiện tại vượt quá maxFileSize
  if (!currentFilePath || (currentFilePath && (await fs.stat(currentFilePath)).size >= maxFileSize)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Thay : và . để hợp lệ tên file
    currentFile = `errors.${timestamp}.log`;
    currentFilePath = path.join(logDir, currentFile);
  }

  // Đảm bảo trả về một chuỗi hợp lệ
  if (!currentFilePath) {
    throw new Error('Unable to determine current log file path');
  }

  return currentFilePath;
}

// Nén 4 file log thành file zip
async function zipLogFiles(): Promise<void> {
  const files = (await fs.readdir(logDir))
    .filter((file) => file.startsWith('errors.') && file.endsWith('.log'))
    .sort();

  if (files.length >= maxFilesBeforeZip) {
    try {
      const admZipModule = await import('adm-zip');
      const AdmZip = admZipModule.default;
      const zip = new AdmZip();
      const filesToZip = files.slice(0, maxFilesBeforeZip); // Lấy 4 file đầu tiên
      const zipFileName = `errors-archive-${new Date().toISOString().replace(/[:.]/g, '-')}.zip`;
      const zipFilePath = path.join(logDir, zipFileName);

      // Thêm các file vào zip
      for (const file of filesToZip) {
        zip.addLocalFile(path.join(logDir, file));
      }

      // Ghi file zip
      zip.writeZip(zipFilePath);

      // Xóa các file đã nén
      for (const file of filesToZip) {
        await fs.unlink(path.join(logDir, file));
      }
    } catch (err) {
      console.error('Failed to zip log files:', err);
    }
  }
}

// Server Action để ghi log
export async function logError(data: LogData): Promise<{ success: boolean; message: string }> {
  try {
    const logFile = await getCurrentLogFile();
    
    // Định dạng nội dung log
    const logMessage = `ID: ${data.errorId} | Time: ${data.timestamp} | Name: ${data.errorName} | Cause: ${data.errorCause}\n`;
    
    // Ghi log vào file
    await fs.appendFile(logFile, logMessage, 'utf8');

    // Kiểm tra và nén file nếu đủ 4 file
    await zipLogFiles();
    
    return { success: true, message: 'Log saved successfully' };
  } catch (err) {
    console.error('Failed to write log:', err);
    return { success: false, message: 'Failed to save log' };
  }
}