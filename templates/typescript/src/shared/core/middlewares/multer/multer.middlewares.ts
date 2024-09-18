import multer from "multer";
import fs from "fs";
import path from "path";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const uploadDestination = "../../../../../public";

function ensureDirectoryExists(directory: string): void {
    if (!fs.existsSync(directory)) {
        try {
            fs.mkdirSync(directory, { recursive: true });
        } catch (err) {
            console.error("Error creating directory:", err);
        }
    }
}

function createStorage(destination: string): multer.StorageEngine {
    return multer.diskStorage({
        destination: (
            req: Express.Request,
            file: Express.Multer.File,
            cb: DestinationCallback
        ) => {
            cb(null, destination);
        },
        filename: (
            req: Express.Request,
            file: Express.Multer.File,
            cb: FileNameCallback
        ) => {
            const extName = path.extname(file.originalname);
            const fileName =
                file.originalname
                    .replace(extName, "")
                    .toLowerCase()
                    .split(" ")
                    .join("-") +
                "-" +
                Date.now();
            cb(null, fileName + extName);
        },
    });
}

function createUploader(destination: string = uploadDestination): multer.Multer {
    ensureDirectoryExists(destination);
    const storage = createStorage(destination);
    return multer({ storage });
}

const upload = createUploader();
export default upload;