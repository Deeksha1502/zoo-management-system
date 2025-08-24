#!/bin/bash

echo "🦁 Zoo Management System Setup"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "📦 Installing server dependencies..."
cd server && npm install

echo "📦 Installing client dependencies..."
cd ../client && npm install

cd ..

# Create environment files if they don't exist
if [ ! -f "server/.env" ]; then
    echo "📝 Creating server environment file..."
    cp server/.env.example server/.env
    echo "⚠️  Please update server/.env with your MongoDB URI and other credentials"
fi

if [ ! -f "client/.env" ]; then
    echo "📝 Creating client environment file..."
    cat > client/.env << EOL
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
EOL
    echo "⚠️  Please update client/.env with your Google Client ID if using OAuth"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update server/.env with your MongoDB URI"
echo "2. Run 'cd server && npm run seed' to populate the database"
echo "3. Run 'npm run dev' to start the application"
echo ""
echo "Default login credentials after seeding:"
echo "Admin: admin@zoo.com / password123"
echo "Keeper: john@zoo.com / password123"
echo "Veterinarian: smith@zoo.com / password123"