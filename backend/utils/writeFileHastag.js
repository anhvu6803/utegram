const fs = require('fs');
const path = './hastag.txt';

const readFileHastag = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./hastag.txt', 'utf8', (err, data) => {
            if (err) {
                console.error('Lỗi khi đọc file:', err);
                return reject(err);
            }

            // Chia nội dung thành mảng, mỗi dòng là một tag
            const tags = data.split('\n').filter(Boolean); // .filter(Boolean) để loại bỏ dòng rỗng
            console.log('Nội dung file:', tags);

            resolve(tags);
        });
    });
}

const writeFileHastag = (tags) => {
    // Chuyển mảng thành chuỗi với mỗi phần tử trên một dòng
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc file:', err);
            return;
        }

        // Tạo một tập hợp các tag hiện có trong file
        const existingTags = new Set(data.split('\n').filter(Boolean));

        // Lọc ra các tag chưa có trong file
        const newTags = tags.filter(tag => !existingTags.has(tag));

        // Nếu không có tag mới, không cần ghi file
        if (newTags.length === 0) {
            console.log('Tất cả các tag đã có trong file.');
            return;
        }

        // Chuyển mảng thành chuỗi với mỗi phần tử trên một dòng
        const formattedData = newTags.join('\n') + '\n';

        // Ghi file không đồng bộ
        fs.appendFile(path, formattedData, 'utf8', (err) => {
            if (err) {
                console.error('Lỗi khi ghi file:', err);
                return;
            }
            console.log('Ghi file không đồng bộ thành công!');
        });
    });
}

exports.readFileHastag = readFileHastag;
exports.writeFileHastag = writeFileHastag;
