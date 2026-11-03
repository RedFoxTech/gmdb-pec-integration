import { FileDto } from "@/domain/entities/common";

export const convertToBase64 = async (file: File): Promise<FileDto> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve({
        base64: (reader?.result as string)?.split(",")[1],
        name: file.name,
        type: file.type,
      });
    };
  });
};

export const downloadFile = (data: {
  file?: File;
  url?: string;
  name: string;
}) => {
  if (data.url) {
    window.open(data.url, "_blank");
  }

  if (data.file) {
    const url = URL.createObjectURL(data.file);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", data.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return;
};
