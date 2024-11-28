const jsonServer = require("json-server");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({
  static: "./public", // Serve static files from 'public' directory
});

// Configuração do Multer para upload de imagens
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, "public/uploads/livros");
      // Cria o diretório se não existir
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
});

// Rota personalizada para adicionar livro
server.post("/livros", upload.single("imagem"), (req, res) => {
  try {
    // Parse book data from JSON string
    const bookData = JSON.parse(req.body.book);

    // Add image path if file was uploaded
    if (req.file) {
      bookData.imagem = `/uploads/livros/${req.file.filename}`;
    }

    // Adiciona timestamp
    bookData.createdAt = new Date().toISOString();
    bookData.updatedAt = new Date().toISOString();

    // Obtém o banco de dados atual
    const db = router.db.getState();

    // Gera ID único
    bookData.id = (db.livros.length + 1).toString();

    // Adiciona ao banco de dados
    db.livros.push(bookData);

    // Salva o banco de dados
    router.db.setState(db);

    res.status(201).json(bookData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aplica middlewares padrão
server.use(middlewares);

// Usa roteador do json-server
server.use(router);

// Inicia o servidor
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server está rodando na porta ${PORT}`);
});
