import express from 'express';
import open from 'open';
import browserSync from 'browser-sync';

const app = express();
const PORT = 8080;

app.use(express.static('src'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

browserSync.create().init({
  proxy: `http://localhost:${PORT}`,
  files: ['src/**/*.html', 'src/**/*.css'],
  open: false,
});

open(`http://localhost:${PORT}/`);
