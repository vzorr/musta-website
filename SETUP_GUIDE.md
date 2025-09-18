# myUsta Website - Complete Setup Guide

## 🚀 Quick Start

### 1. Database Setup (PostgreSQL)

#### Install PostgreSQL
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

#### Create Database
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Run the database setup script
psql -U postgres -f scripts/database-setup.sql
```

#### Verify Database
```bash
# Connect to your database
psql -U myusta_website_user -d myusta_website -h localhost

# Check tables
\dt

# Check data
SELECT * FROM categories LIMIT 5;
SELECT * FROM locations LIMIT 5;
```

### 2. Environment Configuration

Create `.env.local` file in your project root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myusta_website
DB_USER=myusta_website_user
DB_PASSWORD=myusta_secure_password_2024

# Email Configuration (Optional - for contact forms)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Security (Generate your own keys)
JWT_SECRET=your-super-secret-jwt-key-here
ENCRYPTION_KEY=your-32-character-encryption-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Install Dependencies & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## 🗄️ Database Schema

### Tables Created:
- **categories** - Service categories (Plumber, Electrician, etc.)
- **locations** - Cities and regions (Tirana, Durres, etc.)
- **users** - User accounts
- **contact_submissions** - Contact form submissions
- **waitlist** - Waitlist registrations
- **recommendations** - Usta recommendations
- **registrations** - User registrations
- **email_logs** - Email sending logs
- **gdpr_requests** - GDPR compliance requests

### Features:
- ✅ Multi-language support (Albanian/English)
- ✅ GDPR compliance
- ✅ Rate limiting
- ✅ Email notifications
- ✅ Data validation
- ✅ Security measures

## 🔧 API Endpoints

### Contact Form
- **POST** `/api/contact` - Submit contact form
- **OPTIONS** `/api/contact` - CORS preflight

### Waitlist
- **POST** `/api/waitlist` - Join waitlist
- **OPTIONS** `/api/waitlist` - CORS preflight

### Registration
- **POST** `/api/register` - User registration
- **OPTIONS** `/api/register` - CORS preflight

### Recommendations
- **POST** `/api/recommend` - Recommend an Usta
- **OPTIONS** `/api/recommend` - CORS preflight

### GDPR
- **POST** `/api/gdpr` - GDPR requests
- **OPTIONS** `/api/gdpr` - CORS preflight

### Health Check
- **GET** `/api/health` - System health check

## 🎨 Frontend Features

### Components:
- **ContactForm** - Contact form with validation
- **WaitlistForm** - Waitlist registration
- **RegistrationForm** - User registration
- **RecommendUstaForm** - Usta recommendation
- **CustomDropdown** - Multi-select dropdowns
- **LanguageSwitcher** - Language toggle

### Styling:
- **Neumorphic Design** - Modern 3D UI elements
- **Responsive** - Mobile-first design
- **Tailwind CSS** - Utility-first styling
- **Custom Components** - Reusable UI elements

## 🚀 Deployment

### Production Environment Variables:
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PASSWORD=your-secure-production-password
SMTP_USER=your-production-email
SMTP_PASS=your-production-email-password
```

### Build & Deploy:
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔍 Testing

### Test Database Connection:
```bash
# Run the health check
curl http://localhost:3000/api/health
```

### Test Forms:
1. Go to `http://localhost:3000/contact`
2. Fill and submit contact form
3. Check database: `SELECT * FROM contact_submissions;`

## 📊 Database Management

### Useful Queries:
```sql
-- View all contact submissions
SELECT * FROM contact_submissions ORDER BY created_at DESC;

-- View waitlist registrations
SELECT * FROM waitlist ORDER BY created_at DESC;

-- View recommendations
SELECT * FROM recommendations ORDER BY created_at DESC;

-- Statistics
SELECT 
  COUNT(*) as total_contacts,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_contacts
FROM contact_submissions;
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify credentials in `.env.local`
   - Check database exists

2. **Forms Not Submitting**
   - Check browser console for errors
   - Verify API endpoints are working
   - Check database connection

3. **Language Switching Issues**
   - Clear browser cache
   - Check language context provider

## 📝 Next Steps

1. **Set up email service** (Gmail SMTP or SendGrid)
2. **Configure production database**
3. **Set up monitoring and logging**
4. **Add admin dashboard**
5. **Implement user authentication**
6. **Add payment integration**

## 🆘 Support

If you encounter any issues:
1. Check the console logs
2. Verify database connection
3. Check environment variables
4. Review the API responses

---

**Happy Coding! 🎉**
