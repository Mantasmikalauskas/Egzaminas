
import multer from 'multer'; import path from 'path'; import fs from 'fs';
const storage = multer.diskStorage({ destination(req,file,cb){ const dir='./uploads'; if(!fs.existsSync(dir)) fs.mkdirSync(dir); cb(null,dir); }, filename(req,file,cb){ cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); } });
const upload = multer({ storage, fileFilter: (req,file,cb)=>{ const ft = /jpg|jpeg|png/; const ok = ft.test(path.extname(file.originalname).toLowerCase()) && ft.test(file.mimetype); cb(ok?null:new Error('Images only'), ok); } });
export default upload;
