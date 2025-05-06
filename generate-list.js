const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
const outputFile = path.join(postsDir, 'list.json');

fs.readdir(postsDir, (err, files) => {
  if (err) {
    console.error('读取目录失败:', err);
    return;
  }
  
  const mdFiles = files
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      filename: file,
      slug: file
        .replace(/\s+/g, '-')
        .replace(/[^\w\d-]/g, '')
        .toLowerCase()
        .replace(/\.md$/, '')
    }))
    .sort((a, b) => {
      const getDate = (file) => {
        try {
          const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
          const dateMatch = content.match(/date: (\d{4}-\d{2}-\d{2})/);
          return dateMatch ? new Date(dateMatch[1]) : new Date(0);
        } catch (e) {
          return new Date(0);
        }
      };
      return getDate(b.filename) - getDate(a.filename);
    });

  fs.writeFileSync(outputFile, JSON.stringify(mdFiles, null, 2));
  console.log(`成功生成 ${mdFiles.length} 篇文章列表到 ${outputFile}`);
});
const getDate = (file) => {
  try {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const dateMatch = content.match(/date: (\d{4}-\d{2}-\d{2})/);
    return dateMatch ? new Date(dateMatch[1]) : new Date(0);
  } catch (e) {
    return new Date(0);
  }
};