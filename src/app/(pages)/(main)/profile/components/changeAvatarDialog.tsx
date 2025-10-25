import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage, Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Input, Label, Progress, Separator } from '@/components/ui';
import img from "../../../../../../public/assets/e145d5f684c1d0a465722a583e09904e.jpg";
import { ConvertToWebP } from '@/utils';
import { PencilIcon, UploadIcon } from '@/components/icon';
import useToastState from '@/hooks/useToasts';
import axios from 'axios';
import { useAxiosMutation } from '@/hooks';
import profileApiUrl from '@/api/profile';
import { PresignedUrlRequest, PresignedUrlResponse } from '../models/type/profile.type';

interface ChangeAvatarDialogProps {
  url?: string;
  refetchProfile?: () => void;
}

export function ChangeAvatarDialog({
  url,
  refetchProfile
}: ChangeAvatarDialogProps) {
  const [file, setFile] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [openDialog, setOpenDialog] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringPreview, setIsHoveringPreview] = useState(false);
  const { setToast } = useToastState();
  const [progress, setProgress] = useState(0);
  const { sendRequest } = useAxiosMutation<PresignedUrlResponse, PresignedUrlRequest>({
    method: 'POST',
    url: profileApiUrl.getPresignedUrl,
  });
  const [cacheBust, setCacheBust] = useState(0);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    const maxSizeMB = 2;
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      alert(`File is too large! Maximum size is ${maxSizeMB} MB.`)
      removeImg();
      return
    }

    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  // Whenever file changes, generate a URL
  useEffect(() => {
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    // ✅ Cleanup when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const removeImg = () => {
    setFile(undefined);
    setPreviewUrl(undefined);
  }

  const uploadAvatar = async () => {
    if (!file) return;
    const webpFile = await ConvertToWebP(file);
    const isDelete = !webpFile;

    // get prisigned or delete url from backend
    const { data: presignedData, error } = await sendRequest({
      public_url: url || undefined,
      is_delete: isDelete,
    });

    if (error || !presignedData) {
      setToast({
        variant: 'error',
        message: 'Không thể lấy URL tải lên!',
        title: 'Lỗi',
        closeable: false,
      });
      return;
    }
    const presignedUrl = presignedData.presign_url;

    if (!presignedUrl) {
      setToast({
        variant: 'error',
        message: 'Không thể lấy URL tải lên!',
        title: 'Lỗi',
        closeable: false,
      });
      return;
    }

    try {
      const res = await axios.put(presignedUrl, webpFile, {
        headers: { "Content-Type": "image/webp" },
        onUploadProgress: (e) => {
          if (e.total) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setProgress(progress);
          }
        },
      });

      if (res.status >= 200 && res.status < 300) {
        setCacheBust(Date.now());
        setProgress(100);
        removeImg();
        setOpenDialog(false);
        refetchProfile?.();

        setToast({
          variant: 'success',
          message: 'Avatar đã được tải lên thành công!',
          title: 'Thành Công',
          closeable: true,
        });
      } else {
        setToast({
          variant: 'error',
          message: `Lỗi khi upload avatar`,
          title: 'Lỗi',
          closeable: false,
        })
        setProgress(0);
      }

    } catch (error: any) {
      console.error("❌ Upload error:", error);
      setToast({
        variant: 'error',
        message: `Lỗi khi upload avatar`,
        title: 'Lỗi',
        closeable: false,
      })
      setProgress(0);
    }
  }

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger
          onClick={() => setOpenDialog(true)}
          className='!p-0 !bg-transparent !border-none hover:!border-transparent focus:!outline-none active:!border-transparent'
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative w-70 h-70 border-15 border-[#4C4D50] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {isHovering ? <PencilIcon className='z-10 absolute text-amber-400 w-[2rem] h-[2rem]' /> : null}
            <Avatar className={`z-0 w-[100%] h-[100%] hover:cursor-pointer ${isHovering ? 'opacity-50' : 'opacity-100'}`}>
              <AvatarImage src={url ? `${url}?t=${cacheBust}` : img.src} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className='font-semibold text-3xl text-center'>Thay Đổi Ảnh Đại Diện</DialogTitle>
            <Separator className='my-3' />
            <DialogDescription asChild>
              <div className='flex flex-col justify-center items-center'>
                <Label htmlFor="file-uploader"
                  onMouseEnter={() => setIsHoveringPreview(true)}
                  onMouseLeave={() => setIsHoveringPreview(false)}
                >
                  <div className="w-70 h-70 border-15 border-[#4C4D50] rounded-full flex items-center justify-center text-white text-2xl font-bold hover:cursor-pointer">
                    {isHoveringPreview ? <UploadIcon className='z-10 absolute text-blue-400 w-[3rem] h-[3rem]' /> : null}
                    <Avatar className={`z-0 w-[100%] h-[100%] hover:cursor-pointer ${isHoveringPreview ? 'opacity-50' : 'opacity-100'}`}>
                      <AvatarImage
                        src={
                          previewUrl
                            ? previewUrl
                            : url
                              ? `${url}?t=${cacheBust}`
                              : img.src
                        }
                        alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                </Label>
                <Input id="file-uploader" name='file-uploader' className='hidden' type='file'
                  onChange={(e) => {
                    handleFile(e);
                  }}
                />
              </div>
            </DialogDescription>
            {progress > 0 && progress < 100 ? (
              <div className="mt-4 w-3/4 mx-auto text-center">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-gray-500 mt-1">{progress}%</p>
              </div>
            ) : (
              <div className='flex justify-center gap-2'>
                <Button onClick={() => { removeImg() }} className='text-blue-500 !p-0 !bg-transparent !border-none hover:!border-transparent focus:!outline-none active:!border-transparent'>Loại Bỏ Ảnh</Button>
              </div>
            )}
            <Separator className='my-3' />
            <div className='flex justify-center gap-2'>
              <Button variant={"outline"} disabled={progress > 0 && progress < 100} onClick={() => setOpenDialog(false)}>Hủy Bỏ</Button>
              <Button variant={"outline"} disabled={progress > 0 && progress < 100} onClick={() => uploadAvatar()} >Lưu Lại</Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
