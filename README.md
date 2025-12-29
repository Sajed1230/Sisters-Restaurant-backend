# Sisters Restaurant Backend

Backend API and Owner Dashboard for managing menu items with MongoDB and Cloudinary integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/sisters-restaurant
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sisters-restaurant

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Port
PORT=3001
```

4. Start MongoDB (if using local MongoDB):
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

5. Get Cloudinary credentials:
   - Sign up at https://cloudinary.com
   - Go to Dashboard and copy your Cloud Name, API Key, and API Secret
   - Add them to your `.env` file

6. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Get all menu items
- **GET** `/api/menu`
- Returns all menu items organized by category

### Get items by category
- **GET** `/api/menu/:category`
- Categories: `appetizers`, `mainDishes`, `grills`, `desserts`, `beverages`, `sandwiches`

### Upload image
- **POST** `/api/upload`
- Content-Type: `multipart/form-data`
- Body: `image` (file)
- Returns: `{ imageUrl: string, cloudinaryId: string }`

### Add new item
- **POST** `/api/menu/:category`
- Body: `{ name: { en: string, ar: string }, description: { en: string, ar: string }, price: number, image?: string, cloudinaryId?: string }`

### Update item
- **PUT** `/api/menu/:category/:id`
- Body: `{ name?: object, description?: object, price?: number, image?: string, cloudinaryId?: string }`

### Delete item
- **DELETE** `/api/menu/:category/:id`
- Also deletes the image from Cloudinary if it exists

## Dashboard

Access the owner dashboard at:
```
http://localhost:3001/dashboard
```

The dashboard allows you to:
- Add new menu items with image uploads
- Edit existing items
- Delete items (images are automatically deleted from Cloudinary)
- View all items by category
- Upload images directly to Cloudinary

## Features

- **MongoDB**: Persistent database storage for menu items
- **Cloudinary**: Cloud-based image storage and optimization
- **Image Upload**: Direct file upload support with preview
- **Automatic Cleanup**: Images are deleted from Cloudinary when items are deleted
- **Image Optimization**: Automatic resizing and quality optimization

## Data Model

Menu items are stored with the following schema:
- `name`: Object with `en` and `ar` properties
- `description`: Object with `en` and `ar` properties
- `price`: Number
- `image`: String (URL)
- `cloudinaryId`: String (for Cloudinary management)
- `category`: String (enum)
- `createdAt`: Date
- `updatedAt`: Date
