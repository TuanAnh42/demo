const fs = require('fs');
const path = require('path');

const folderPath = './img/uses';

const toSlug = (str) => {
  return str
    .normalize("NFD")               // tách dấu ra khỏi ký tự gốc
    .replace(/[\u0300-\u036f]/g, "") // xoá dấu
    .replace(/đ/g, "d")              // đ -> d
    .replace(/Đ/g, "D")              // Đ -> D
    .replace(/\s+/g, '-')            // space -> -
    .toLowerCase();                  // về chữ thường
};

fs.readdir(folderPath, (err, files) => {
  if (err) return console.log('Lỗi đọc thư mục:', err);

  files.forEach((file) => {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const newName = toSlug(base) + ext;

    const oldPath = path.join(folderPath, file);
    const newPath = path.join(folderPath, newName);

    fs.rename(oldPath, newPath, (err) => {
      if (err) console.log('Lỗi đổi tên:', err);
      else console.log(`✅ Đổi: ${file} → ${newName}`);
    });
  });
});
