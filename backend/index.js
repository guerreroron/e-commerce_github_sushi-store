const port = 4000
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const { sendMail } = require('./mail')
const { truncateSync } = require('fs')
require('dotenv').config()
const app = express()


// Middlewares
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    credentials: true
}))
app.use(cookieParser())


// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.authToken
    console.log('Token recibido from middleware verifyToken')
//    console.log('Token recibido:', token)
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(401).json({ success: false, message: 'Invalid token' })
        }
        req.user = decoded.user
//        console.log('Token decodificado:', decoded)
        next()
    })
}


// Endpoint para refrescar el token
app.post('/refresh-token', verifyToken, (req, res) => {
    const data = {
        user: {
            id: req.user.id
        }
    }
    const newToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '15m' })
    res.cookie('authToken', newToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000 
    })
    res.json({ success: true, token: newToken })
})


// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack)
    res.status(500).json({ success: false, message: err.message })
})


// Database connection with MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error)
    })


// API Creation
app.get("/", (req, res) => {
    res.send("Express App is running")
})


// NODEMAILER

app.post('/send-email', sendMail)


// Código funcionando sin la incoporación de las img del ADMIN
// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        const salt = bcrypt.genSaltSync(5)
        const hash = bcrypt.hashSync(file.originalname, salt).replace(/\//g, '').slice(-8);
        const extname = path.extname(file.originalname)

        // Imagen principal
        if (file.fieldname === 'product') {
            const uniqueName = `${file.fieldname}_${hash}${extname}`
            cb(null, uniqueName)
        } else if (file.fieldname === 'thumbnails') {
            // Thumbnails, agregar el prefijo "thumb_"
            const uniqueName = `thumb_${hash}${extname}`
            cb(null, uniqueName)
        }
    }
})



// Esta instrucción de cierre de multer siempre tiene que ir después de la declaración const storage
const upload = multer({ 
    storage: storage,
    limits: {fileSize: 300 * 1024},
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

        if (mimetype && extname) {
            return cb(null, true)
        }
        cb(new Error('Error: Tipo de archivo no permitido. Solo se permiten imágenes.'))
        cb(null, false)
    }
 })


/* // Creating upload endpoint for images
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
}) */


// Código funcionando sin avatar del Admin    
// Endpoint para manejar múltiples archivos
app.post("/upload", upload.fields([
    { name: 'product', maxCount: 1 }, 
    { name: 'thumbnails', maxCount: 4 } 
]), (req, res) => {

    // Manejar errores de multer
    if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError)
    }
    if (!req.files['product'] || !req.files['thumbnails']) {
        return res.status(400).json({ success: 0, message: 'Por favor, sube las imágenes requeridas.' })
    }

    // Obtener la imagen principal
    const productImage = req.files['product'] ? req.files['product'][0].filename : null

    // Obtener miniaturas con hash
    const thumbnailImages = req.files['thumbnails']
        ? req.files['thumbnails'].map(file => {
            return `http://localhost:${port}/images/${file.filename}`
        })
        : []
    
    // Mostrar resultados en consola
    console.log("Product Image:", productImage)
    console.log("Thumbnails:", thumbnailImages)
    
    // Responder con la URL de las imágenes
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${productImage}`,
        thumbnails: thumbnailImages 
    })
})


// Hacer que los archivos estáticos sean accesibles desde el servidor
app.use('/images', express.static('upload/images'))

// Esquema para registrar los cambios
const changeLogSchema_product = new mongoose.Schema({
    action: { type: String, enum: ['created', 'deleted'], required: true },
    timestamp: { type: Date, default: Date.now },
    productId: { type: Number, required: true }
})

// Schema for creating Product model in MongoDB
const productSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    thumbnails: { type: [String], default: [] }, 
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
    description: { type: String },
    changeLogs: [changeLogSchema_product]
  }, { timestamps: true })


const Product = mongoose.model("Product", productSchema)


// Middleware para registrar creación
productSchema.pre('save', function(next) {
    if (this.isNew) {
        this.changeLogs.push({ action: 'created', productId: this.id })
    }
    next()
})

// Middleware para registrar eliminación
productSchema.pre('remove', function(next) {
    this.changeLogs.push({ action: 'deleted', productId: this.id })
    next()
})

module.exports = Product


// Endpoint for adding a product
app.post("/addproduct", async (req, res) => {
    try {
        let products = await Product.find({})
        let id = products.length > 0 ? products.slice(-1)[0].id + 1 : 1

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            thumbnails: req.body.thumbnails, 
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
            description: req.body.description
        })

        await product.save()
        res.json({ success: true, name: req.body.name })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving product' })
    }
})


// Creating API for deleting products
app.delete('/removeproduct/:id', async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findOneAndDelete({ id: productId })
        if (product) {
            res.json({ success: true })
        } else {
            res.status(404).json({ success: false, message: 'Product not found' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting product' })
    }
})


// Creating API for update products
app.put('/updateproduct/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        )
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }
        res.json({ success: true, updatedProduct })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating product' })
    }
})


// Creating API for getting all products
app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({})
        res.send(products)
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching products' })
    }
})


// Endpoint for related products (show in product display)
app.get('/products', async (req, res) => {
    const category = req.query.category
    try {
      const products = await Product.find({ category: category }).limit(4)
      res.status(200).json(products)
    } catch (error) {
      res.status(500).send({ error: 'Error fetching products by category' })
    }
  })

  

// Endpoint for [Popular] items (Hero --> Agregados recientemente)
app.get('/newarrivals', async (req, res) => {
    try {
        let products = await Product.find().sort({ createdAt: -1 }).limit(4)
        res.send(products)
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener los productos nuevos' })
    }
})


// Endpoint for [Offers] items (Hero --> tablas en promoción)
app.get('/tablas-promo', async (req, res) => {
    let products = await Product.find({category:"table"})
    let tables = products.slice(0,4)
    res.send(tables)
})


// Endpoint for [Catering] items (Hero --> catering y eventos)
app.get('/catering', async (req, res) => {
    try {
      // Utiliza el operador $sample para obtener 4 productos aleatorios
      let catering = await Product.aggregate([{ $sample: { size: 4 } }])
      res.status(200).json(catering)
    } catch (error) {
      console.error('Error fetching catering items:', error)
      res.status(500).send({ error: 'Error fetching catering items' })
    }
  })



// USERS


// Esquema para registrar los cambios
const changeLogSchema_users = new mongoose.Schema({
    action: { type: String, enum: ['created', 'deleted'], required: true },
    timestamp: { type: Date, default: Date.now },
    userId: { type: String, required: true } 
})

// Schema for creating Users model in MongoDB
const userSchema = new mongoose.Schema({
    name: { type: String, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object }, 
    date: { type: Date, default: Date.now },
    changeLogs: [changeLogSchema_users]
})

// Middleware para registrar creación
userSchema.pre('save', function(next) {
    if (this.isNew) {
        this.changeLogs.push({ action: 'created', userId: this._id, timestamp: new Date() })
    }
    next()
})

// Middleware para registrar eliminación
userSchema.pre('remove', function(next) {
    this.changeLogs.push({ action: 'deleted', userId: this._id, timestamp: new Date() })
    next()
})

// Model creation
const Users = mongoose.model('Users', userSchema)

module.exports = Users


// Endpoint for creating user
app.post('/signup', async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email })
        if (check) {
            return res.status(400).json({ success: false, errors: "User email already exists" })
        }
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }
        const hashPassword = bcrypt.hashSync(req.body.password, 10);
        const user = new Users({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            cartData: cart
        })
        
        await user.save()
        
        // Se almacena ID del usuario después de guardar
        const logEntry = { action: 'created', userId: user._id }
        user.changeLogs.push(logEntry)
        await user.save()
        
        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '15m' })
        res.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000
        })
        res.json({ success: true, message: 'User registered successfully', token })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error during signup' })
    }
})


// Endpoint for User Login
app.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ success: false, errors: "Password or username are wrong" })
        }
        const passCompare = bcrypt.compareSync(req.body.password, user.password)
        if (!passCompare) {
            return res.status(400).json({ success: false, errors: "Password or username are wrong" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '15m' })
        res.cookie('authToken', token, {
            httpOnly: true,
        //    secure: process.env.NODE_ENV === 'production' ? true : false,
        //    sameSite: 'Strict',
            maxAge: 15 * 60 * 1000
        })
        res.json({ success: true, message: 'Logged in successfully', email: user.email, token })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error during login' })
    }
})


// Endpoint para obtener la información del usuario autenticado
app.get('/getuser', verifyToken, async (req, res) => {
    try {
      console.log('Loged with valid token, user ID:', req.user.id)
        const user = await Users.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
        res.json({ success: true, user })
    } catch (error) {
        console.error('Error fetching user:', error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


// Endpoint for logout
app.post('/logout', (req, res) => {
    res.clearCookie('authToken')
    res.json({ success: true, message: 'Logged out successfully' })
})
 

// Endpoint to get all Users
app.get('/allusers', async (req, res) => {
    try {
        const usersWithPurchases = await Users.aggregate([
            {
                $lookup: {
                    from: 'purchases',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'purchases'
                }
            },
            {
                $addFields: {
                    totalSpent: {
                        $sum: '$purchases.totalAmount'
                    }
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    totalSpent: 1
                }
            }
        ])

        res.json(usersWithPurchases)
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users' })
    }
})


// Creating API for deleting users
app.delete('/removeusers/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await Users.findById(id)
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }
        
        // Añadir el registro de cambio antes de eliminar
        user.changeLogs.push({ action: 'deleted', userId: user._id })
        
        // Guardar los cambios en el registro de cambios
        await user.save()

        // Eliminar el usuario
        await Users.deleteOne({ _id: id })
        
        res.json({ success: true })
    } catch (error) {
        console.error("Error deleting user:", error)
        res.status(500).json({ success: false, message: 'Error deleting user' })
    }
})


// Endpoint to edit a User
app.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const updateUser = req.body

        // Validar datos de entrada antes de actualizar
        if (updateUser.password) {
            updateUser.password = bcrypt.hashSync(updateUser.password, 10)
        }

        const user = await Users.findByIdAndUpdate(userId, updateUser, { new: true })
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.json(user)
    } catch (error) {
        res.status(500).send('Server error')
    }
})

// Endpoint to get top clients
app.get('/topclients', async (req, res) => {
    try {
        const usersWithPurchases = await Users.aggregate([
            {
                $lookup: {
                    from: 'purchases',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'purchases'
                }
            },
            {
                $addFields: {
                    totalSpent: {
                        $sum: '$purchases.totalAmount'
                    }
                }
            },
            {
                $sort: {
                    totalSpent: -1
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    totalSpent: 1
                }
            }
        ])
        
        res.json(usersWithPurchases);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching top clients' })
    }
})


// Endpoint to get new clients
app.get('/newclients', async (req, res) => {
    try {
        const usersWithPurchases = await Users.aggregate([
            {
                $lookup: {
                    from: 'purchases',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'purchases'
                }
            },
            {
                $addFields: {
                    totalSpent: {
                        $sum: '$purchases.totalAmount'
                    }
                }
            },
            {
                $sort: {
                    date: -1 
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    totalSpent: 1
                }
            }
        ])

        res.json(usersWithPurchases);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching new clients' })
    }
})

// Endpoint to get inactive clients (users with no purchases)
app.get('/inactiveclients', async (req, res) => {
    try {
        const inactiveClients = await Users.aggregate([
            {
                $lookup: {
                    from: 'purchases',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'purchases'
                }
            },
            {
                $match: {
                    purchases: { $eq: [] } 
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    totalSpent: {
                        $sum: '$purchases.totalAmount'
                    }
                }
            }
        ])

        res.json(inactiveClients)
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching inactive clients' })
    }
})

// Endpoint para contar usuarios agregados en los últimos 30 días
app.get('/users-added-last-30-days', async (req, res) => {
    try {
        // Fecha de hace 30 días
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // Contar usuarios creados en los últimos 30 días
        const count = await Users.aggregate([
            { $unwind: "$changeLogs" },
            { $match: { 
                "changeLogs.action": "created", 
                "changeLogs.timestamp": { $gte: thirtyDaysAgo } 
            }},
            { $count: "totalAdded" }
        ]);

        // Respuesta
        res.status(200).json({ count: count.length > 0 ? count[0].totalAdded : 0 })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al contar usuarios' })
    }
})

// Endpoint para contar usuarios eliminados en los últimos 30 días
app.get('/users-deleted-last-30-days', async (req, res) => {
    try {
        // Fecha de hace 30 días
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // Contar usuarios eliminados en los últimos 30 días
        const count = await Users.aggregate([
            { $unwind: "$changeLogs" },
            { $match: { 
                "changeLogs.action": "deleted", 
                "changeLogs.timestamp": { $gte: thirtyDaysAgo } 
            }},
            { $count: "totalDeleted" }
        ])

        // Respuesta
        res.status(200).json({ count: count.length > 0 ? count[0].totalDeleted : 0 })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al contar usuarios eliminados' })
    }
})



// PURCHASE



// Esquema para registrar los cambios
const changeLogSchema_purchase = new mongoose.Schema({
    action: { type: String, enum: ['created', 'deleted'], required: true },
    timestamp: { type: Date, default: Date.now },
    purchaseId: { type: mongoose.Schema.Types.ObjectId, required: true }
})

// Esquema para el modelo de compra
const purchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    products: [{
        id: { type: Number, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    changeLogs: [changeLogSchema_purchase]
})

// Middleware para registrar creación
purchaseSchema.pre('save', function(next) {
    if (this.isNew) {
        this.changeLogs.push({ action: 'created', purchaseId: this._id })
    }
    next()
})

// Middleware para registrar eliminación
purchaseSchema.pre('remove', function(next) {
    this.changeLogs.push({ action: 'deleted', purchaseId: this._id })
    next()
})

// Model creation
const Purchase = mongoose.model('Purchase', purchaseSchema)

// Hook pre-remove para eliminar compras asociadas
userSchema.pre('remove', async function(next) {
    try {
        const purchases = await Purchase.find({ userId: this._id })
        for (const purchase of purchases) {
            purchase.changeLogs.push({ action: 'deleted', purchaseId: purchase._id })
            await purchase.save()
        }
        await Purchase.deleteMany({ userId: this._id })
        next()
    } catch (error) {
        next(error)
    }
})

module.exports = Purchase

// Endpoint for recording a purchase
app.post('/purchased', verifyToken, async (req, res) => {
    try {
        const purchase = new Purchase({
            userId: req.user.id,
            products: req.body.products,
            totalAmount: req.body.totalAmount,
        })
        await purchase.save()
        res.json({ success: true, purchase })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error recording purchase' })
    }
})


// Endpoint to get MiCompra (Última compra del usuario)
app.get('/micompra', verifyToken , async (req, res) => {
    try {
        const userId = req.user.id
        const lastPurchase = await Purchase.findOne({ userId })
            .sort({ date: -1 })
            .limit(1)
        if (!lastPurchase) {
            return res.status(404).json({ message: 'No se encontraron compras para este usuario.' })
        }
        res.status(200).json(lastPurchase)
    } catch (error) {
        console.error("Error al obtener la última compra:", error)
        res.status(500).json({ message: 'Error al obtener la última compra.' })
    }
})


// Endpoint to get purchases by userId
app.get('/userpurchases/:userId', async (req, res) => {
    try {
        const userId = req.params.userId
        const purchases = await Purchase.find({ userId: userId })

        if (!purchases.length) {
            return res.status(200).json({ success: false, message: 'No purchases found for this user.', purchases: []  })
        }

        res.json({ success: true, purchases })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error })
    }
})


// Endpoint para obtener los productos que más se venden
app.get('/bestproducts', async (req, res) => {
    try {
        // Obtener la cantidad total de ventas por producto
        const purchases = await Purchase.aggregate([
            { $unwind: '$products' },
            {
                $group: {
                    _id: '$products.id',
                    totalSales: { $sum: '$products.quantity' } 
                }
            },
            {
                $sort: { totalSales: -1 }
            }
        ])

        // Obtener todos los productos que tienen ventas
        const productIds = purchases.map(purchase => purchase._id)
        const bestSellingProducts = await Product.find({ id: { $in: productIds } })

        // Mapear los productos con sus ventas
        const result = bestSellingProducts.map(product => {
            const salesData = purchases.find(p => p._id === product.id)
            return {
                ...product.toObject(),
                totalSales: salesData ? salesData.totalSales : 0
            }
        })

        res.json(result)
    } catch (error) {
        console.error('Error fetching best products:', error)
        res.status(500).json({ success: false, message: 'Error fetching best products' })
    }
})


app.get('/newproducts', async (req, res) => {
    try {
        const newProducts = await Product.find().sort({ createdAt: 1 })
        res.json(newProducts)
    } catch (error) {
        console.error('Error fetching new products:', error)
        res.status(500).json({ success: false, message: 'Error fetching new products' })
    }
})

app.get('/inactiveproducts', async (req, res) => {
    try {
        const inactiveProducts = await Product.find({
            id: { $nin: await Purchase.distinct("products.id") }
        })
        res.json(inactiveProducts)
    } catch (error) {
        console.error('Error fetching inactive products:', error)
        res.status(500).json({ success: false, message: 'Error fetching inactive products' })
    }
})
 

// Ruta para contar el monto total de las ventas en los últimos 30 días
app.get('/total-sales-last-30-days', async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // Sumar el total de las ventas
        const totalSales = await Purchase.aggregate([
            {
                $match: {
                    'changeLogs.action': 'created',
                    date: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ])

        // Enviamos la respuesta
        res.status(200).json({ totalSales: totalSales.length > 0 ? totalSales[0].totalAmount : 0 })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al contar las ventas totales' })
    }
})

// Ruta para contar el monto total de las ventas en los últimos 7 días
app.get('/total-sales-last-7-days', async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        // Sumar el total de las ventas
        const totalSales = await Purchase.aggregate([
            {
                $match: {
                    'changeLogs.action': 'created',
                    date: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ])

        // Enviamos la respuesta
        res.status(200).json({ totalSales: totalSales.length > 0 ? totalSales[0].totalAmount : 0 })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al contar las ventas totales' })
    }
})


/* Esquemas ADMIN y SUPERUSER */
// Esquema de Admin-Superuser

// Subesquema para las preguntas de seguridad
const securityQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true } 
});

// Esquema principal para administradores
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superuser'], default: 'admin' },
    securityQuestions: [securityQuestionSchema], 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin



// Endpoint para crear Administradores
app.post('/addadmin', async (req, res) => {
    const { name, username, email, password, role } = req.body

    if (!name || !username || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    try {
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newAdmin = new Admin({
            name,
            username,
            email,
            password: hashedPassword,
            role,
            securityQuestions: hashedQuestions
        })

        await newAdmin.save()

        res.status(201).json({ success: true, message: 'Admin added successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add admin', error })
    }
})


// Endpoint para obtener la lista de todos los administradores
app.get('/alladmins', async (req, res) => {
    try {
        const admins = await Admin.find({}, 'name username email password role')
        res.json(admins)
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching admins', error })
    }
})

// Endpoint para eliminar Admin
app.delete('/removeadmin/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deleteAdmin = await Admin.findByIdAndDelete(id)
        if (!deleteAdmin) {
            return res.status(404).json({ success: false, message: 'Admin not found' })
        }
        res.json({ success: true, message: 'Admin removed successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing admin', error })
    }
})

// Endpoint para login de administradores
app.post('/adminlogin', async (req, res) => {
    const { email, password } = req.body

    try {
        // Buscar usuario por email
        const user = await Admin.findOne({ email })

        // Verificar si el usuario existe
        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas' })
        }

        // Comparar la contraseña hasheada
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas' })
        }

        // Generación del token
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '15m' })

        // Responder con el token y el rol
        res.json({
            success: true,
            token,
            role: user.role,
            username: user.username,
            adminId: user._id.toString()
        })
        
    } catch (error) {
        console.error('Error during login:', error)
        res.status(500).json({ success: false, message: 'Error del servidor en función login' })
    }
})



// PUBLICATIONS


// Esquema para registrar los cambios
const changeLogSchema_publications = new mongoose.Schema({
    action: { type: String, enum: ['created', 'deleted'], required: true },
    timestamp: { type: Date, default: Date.now },
    publicationId: { type: mongoose.Schema.Types.ObjectId, required: true }
})

// Esquema para las publicaciones
const publicationSchema = new mongoose.Schema({
    author: { 
        name: { type: String, required: true }
    },
    date_publish: { type: Date, default: Date.now },
    related_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SomeRelatedModel' },
    content: { type: String, required: true },
    approved: { type: Boolean, default: false },
    approvedBy: { type: String },
    date_approve: { type: Date },
    changeLogs: [changeLogSchema_publications]
})

// Middleware para registrar creación
publicationSchema.pre('save', function(next) {
    if (this.isNew) {
        this.changeLogs.push({ action: 'created', publicationId: this._id })
    }
    next()
})

// Middleware para registrar eliminación
publicationSchema.pre('remove', function(next) {
    this.changeLogs.push({ action: 'deleted', publicationId: this._id })
    next()
})

// Model creation
const Publication = mongoose.model('Publication', publicationSchema)
module.exports = Publication


// Endpoint para agregar publicación
app.post('/addpost', async (req, res) => {
    try {
        let publication = new Publication({
            author: req.body.author,
            date_publish: req.body.date_publish,
            related_id: req.body.related_id,
            content: req.body.content,
            approved: req.body.approved,
            approvedBy: req.body.approvedBy,
            date_approve: req.body.date_approve
        })
        await publication.save();
        res.json({ success: true, content: publication })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error al agregar publicación.' })
    }
})

// Endpoint para listar publicaciones asociadas a un producto
app.get('/products/:id/publications', async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findOne({ id: productId })

        if (!product) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' })
        }

        const publications = await Publication.find({ related_id: product._id }).exec()

        if (!publications || publications.length === 0) {
            return res.json({ success: true, publications: [] })
        }

        res.json({ success: true, publications})
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error al obtener publicaciones.' })
    }
})


// Endpoint para aprobar las publicaciones
app.post('/approvepost/:id', async (req, res) => {
    try {
        const publication = await Publication.findById(req.params.id)
        if (!publication) {
            return res.status(404).json({ success: false, message: 'Publicación no encontrada.' })
        }

        // Actualiza los campos de aprobación
        publication.approved = true
        publication.approvedBy = req.body.approvedBy
        publication.date_approve = new Date()
        
        // Añadir el registro de cambio
        publication.changeLogs.push({ action: 'approved', publicationId: publication._id })
        
        await publication.save()
        res.json({ success: true, content: publication })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error al aprobar la publicación.' })
    }
})


// Cantidad publicaciones agregadas en los últimos 7 días
app.get('/publications-added-last-7-days', async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        // Contar las publicaciones creadas en los últimos 7 días
        const count = await Publication.countDocuments({
            date_publish: { $gte: sevenDaysAgo }
        })

        // Respuesta
        res.status(200).json({ count })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al contar publicaciones agregadas' })
    }
})

// Ruta para contar las publicaciones aprobadas en los últimos 7 días
app.get('/publications-approved-last-7-days', async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        // Contar las publicaciones aprobadas en los últimos 7 días
        const count = await Publication.countDocuments({
            approved: true,
            date_approve: { $gte: sevenDaysAgo }
        })

        // Respuesta
        res.status(200).json({ count })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al contar publicaciones aprobadas' })
    }
})










// Listen
app.listen(port, (err) => {
    if (!err) {
        console.log("Server started... port:"+port)
    } else {
        console.error("Error : " + err)
    }
})