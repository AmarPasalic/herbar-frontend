# 🌿 Digital Herbarium - Backend Integration

## ✅ Status: POVEZANO SA PRODUCTION BACKENDOM

Frontend aplikacija je uspješno povezana sa deployed backend serverom na Vercel-u.

---

## 🔗 Backend URLs

### Production (TRENUTNO AKTIVNO)
```
URL: https://herbar-backend-7p73b09f8-pashas-projects-8b099908.vercel.app
Status: ✅ Deployed
```

### Development (Lokalni backend)
```
URL: http://localhost:3001
Status: ⚠️ Treba pokrenuti lokalno
```

---

## 📁 Konfiguracija

API URL se automatski bira na osnovu environment-a:

**Fajl:** `/config/api.ts`

```typescript
// Automatski detektuje da li radi lokalno ili na produkciji
const isDevelopment = window.location.hostname === 'localhost';

// Production URL (Vercel)
const PRODUCTION_API_URL = 'https://herbar-backend-7p73b09f8-pashas-projects-8b099908.vercel.app';

// Development URL (Local)
const DEVELOPMENT_API_URL = 'http://localhost:3001';
```

**Kako promijeniti između DEV i PROD:**
- Lokalno (localhost): Automatski koristi development URL
- Production (deploy): Automatski koristi production URL
- Manual override: Promijenite `isDevelopment` u `api.ts` fajlu

---

## 🔌 Integrisani Endpoints

### 1. Autentifikacija

#### Signup
```typescript
POST /api/auth/signup
Body: {
  email: string,
  password: string,
  fullName?: string,
  department?: string,
  school?: string
}
Response: { token: string, user: User }
```

#### Login
```typescript
POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string, user: User }
```

### 2. Identifikacija Biljaka

```typescript
POST /api/identify
Headers: { Authorization: Bearer <token> }
Body: FormData {
  images: File[],
  organs: 'leaf' | 'flower' | 'fruit'
}
Response: PlantNet API JSON
```

**Backend proxy riješava CORS problem!** ✅

### 3. Biljke

#### Sačuvaj biljku
```typescript
POST /api/plants
Headers: { Authorization: Bearer <token> }
Body: FormData {
  name: string,
  description?: string,
  photo?: File
}
Response: { plant: Plant }
```

#### Preuzmi sve biljke
```typescript
GET /api/plants
Headers: { Authorization: Bearer <token> }
Response: { plants: Plant[] }
```

---

## 🔒 Autentifikacija Flow

1. **Korisnik se registruje/prijavljuje**
   - Frontend šalje credentials na `/api/auth/login` ili `/api/auth/signup`
   - Backend vraća JWT token i user podatke

2. **Token se čuva u localStorage**
   ```typescript
   localStorage.setItem('auth_token', token);
   localStorage.setItem('auth_user', JSON.stringify(user));
   ```

3. **Svaki API zahtjev uključuje token**
   ```typescript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

4. **Logout briše token**
   ```typescript
   localStorage.removeItem('auth_token');
   localStorage.removeItem('auth_user');
   ```

---

## 🌐 Offline Mode

Ako backend nije dostupan, aplikacija automatski prelazi u **offline režim**:

- ✅ Autentifikacija koristi localStorage
- ✅ Identifikacija koristi mock biljke
- ✅ Čuvanje biljaka ide u localStorage
- ✅ Gamifikacija funkcionira lokalno

**Offline mode se detektuje automatski:**
```typescript
async function checkServerStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      // ... test request
    });
    return true; // Server radi
  } catch (error) {
    console.log('Server nije dostupan, koristim offline režim');
    return false; // Offline mode
  }
}
```

---

## 🛠️ Kako testirati backend lokalno

1. **Klonirajte backend repo**
   ```bash
   git clone <backend-repo-url>
   cd herbar-backend
   ```

2. **Instalirajte dependencies**
   ```bash
   npm install
   ```

3. **Postavite environment variables**
   ```bash
   cp .env.example .env
   # Uredite .env sa svojim credentials-ima
   ```

4. **Pokrenite MongoDB**
   ```bash
   docker compose up -d
   # ili koristite MongoDB Atlas
   ```

5. **Pokrenite backend server**
   ```bash
   npm run dev
   ```

6. **Backend će raditi na http://localhost:3001** ✅

7. **Frontend će automatski detektovati i koristiti lokalni backend**

---

## 📊 Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  fullName?: string;
  department?: string;
  school?: string;
}
```

### Plant
```typescript
interface Plant {
  id: string;
  name: string;
  description: string;
  photoUrl: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
```

### PlantNet Response
```typescript
interface PlantNetResponse {
  results: Array<{
    score: number;
    species: {
      scientificNameWithoutAuthor: string;
      commonNames: string[];
      family: {
        scientificNameWithoutAuthor: string;
      };
    };
  }>;
}
```

---

## 🐛 Debugging

### Check current API URL
Otvorite browser console i vidjet ćete:
```
🌿 API Mode: PRODUCTION
🔗 API URL: https://herbar-backend-7p73b09f8-pashas-projects-8b099908.vercel.app
```

### Test backend connection
```typescript
// U browser console
fetch('https://herbar-backend-7p73b09f8-pashas-projects-8b099908.vercel.app/api/health')
  .then(r => r.json())
  .then(console.log);
```

Expected response:
```json
{ "ok": true, "mongo": "connected" }
```

### Common Issues

**Problem:** `Failed to fetch` ili `NetworkError`
- ✅ Rješenje: Offline mode će se automatski aktivirati

**Problem:** `401 Unauthorized`
- ✅ Rješenje: Token je istekao, redirect na login

**Problem:** `CORS error`
- ✅ Rješenje: Backend proxy riješava CORS (koristi `/api/identify`)

---

## 🚀 Deployment Checklist

- ✅ Backend deployed na Vercel
- ✅ MongoDB Atlas konfigurisan
- ✅ Environment variables postavljene
- ✅ CORS dozvoljeno za frontend origin
- ✅ PlantNet API ključ postavljen
- ✅ JWT secret konfigurisan
- ✅ Frontend config pokazuje na production URL

---

## 📝 Environment Variables (Backend)

```env
# Required
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key-here

# Optional
CORS_ORIGIN=https://your-frontend.vercel.app
PLANTNET_API_KEY=2b10xzkW60RZnoaSPTwEUC8Se
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

---

## 🎯 Next Steps

1. Test signup/login funkcionalnost
2. Test identifikacija biljaka sa pravim slikama
3. Test čuvanje biljaka u backend
4. Verifikuj da se slike pravilno prikazuju
5. Test offline mode functionality

---

## 📞 Support

Ako nešto ne radi:
1. Provjeri browser console za greške
2. Provjeri da li backend radi (`/api/health`)
3. Provjeri network tab u DevTools
4. Provjeri da li je token validan
5. Test u offline modu

---

**Verzija:** 1.0.0  
**Datum:** 2024  
**Status:** ✅ Production Ready
