# SwapTN Frontend-Backend Integration Guide

## ✅ Completed Integration

Your frontend has been successfully integrated with the Spring Boot backend API. Here's what was implemented:

### 1. **API Layer (src/api.js)**
Complete API client with endpoints for:
- **Authentication**: Login, registration, token management
- **Listings**: Create, read, update, delete
- **Conversations**: Create and fetch conversations
- **Messages**: Send and receive messages
- **Reviews**: Fetch and create reviews
- **Users**: Get user profile, update profile

### 2. **Frontend Updates (src/App.jsx)**
- ✅ Added `listings` and `loading` state management
- ✅ Added `useEffect` to fetch listings on component mount
- ✅ Added authentication persistence (auto-login from token)
- ✅ Updated **LoginPage** to call API for signup/login
- ✅ Updated **SellPage** to create listings via API
- ✅ Integrated JWT token handling
- ✅ Error handling and loading states

### 3. **Backend Configuration**
- ✅ CORS already configured in `SecurityConfig.java` for localhost:5173 (Vite dev server)
- ✅ JWT authentication ready
- ✅ Backend running on port 8081

### 4. **Vite Configuration (vite.config.js)**
- ✅ Proxy configured for `/api`, `/auth`, and `/users` endpoints

---

## 🚀 Setup Instructions

### Prerequisites
1. **Backend running**: `mvn spring-boot:run` on port 8081
2. **Database**: PostgreSQL running with `swaptn_new` database
3. **Frontend dependencies**: `npm install`

### Start Development

```bash
# Terminal 1: Start Spring Boot Backend
cd c:\Users\Rayen\marketplace
mvn spring-boot:run

# Terminal 2: Start Vite Development Server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🧪 Testing Guide

### Test 1: User Registration & Login
1. Go to the app → Click "Login" button
2. Click "Sign up" tab
3. Fill in: Name, Email, Password
4. Click "Create Account →"
5. You should be redirected to home and logged in

### Test 2: Create a Listing
1. Ensure you're logged in
2. Click "📦 Sell" button or "Sell" in navbar
3. Follow the 4-step process:
   - **Step 1**: Upload photos
   - **Step 2**: Enter title, brand, category, size, condition, description, location
   - **Step 3**: Set price in TND
   - **Step 4**: Review and publish
4. Click "🚀 Publish Listing"
5. You should see a success message
6. Your listing appears when you go to "Browse"

### Test 3: Browse Listings
1. Go to "Browse" or click items
2. Filter by category, search by title
3. Click on an item to view details

---

## 🔑 API Endpoints Reference

### Authentication
```
POST /auth/signup
  Request: { fullName, email, password }
  Response: { id, fullName, email }

POST /auth/login
  Request: { email, password }
  Response: { message, token }
```

### Listings
```
GET /api/listings
  Returns: List<Listing>

GET /api/listings/{id}
  Returns: Listing

POST /api/listings
  Request: Listing object
  Response: Listing

PUT /api/listings/{id}
  Request: Listing object
  Response: Listing

DELETE /api/listings/{id}
  Response: 200 OK

GET /api/listings/search?title=X
  Returns: List<Listing>

GET /api/listings/category/{category}
  Returns: List<Listing>
```

### Users
```
GET /users/{id}
  Returns: User

PUT /users/{id}
  Request: UpdateUserRequest
  Response: UserResponse
```

### Messages & Conversations
```
POST /api/conversations
  Request: { listingId, otherUserId }
  Response: ConversationResponse

GET /api/conversations
  Returns: List<ConversationResponse>

GET /api/conversations/{id}
  Returns: ConversationResponse

POST /api/messages?conversationId={id}
  Request: { content }
  Response: Message

GET /api/messages/conversation/{id}
  Returns: List<Message>
```

### Reviews
```
GET /api/reviews
  Returns: List<Review>

POST /api/reviews
  Request: Review object
  Response: Review

GET /api/reviews/user/{userId}
  Returns: List<Review>

DELETE /api/reviews/{id}
  Response: 200 OK
```

---

## 🔐 Authentication Flow

1. User logs in → API returns JWT token
2. Token stored in `localStorage` as `swaptn_token`
3. Token automatically included in all requests via `Authorization: Bearer <token>`
4. On app mount, checks if token is valid and loads user profile
5. Logout clears token from localStorage

---

## 📝 Token Management

```javascript
// Get token
api.getToken()

// Set token (called automatically after login)
api.setToken(token)

// Clear token (called on logout)
api.clearToken()

// Check if logged in
api.isLoggedIn()

// Get current user email from token
api.getCurrentUserEmail()

// Check if token expired
api.isTokenExpired(token)
```

---

## 🐛 Troubleshooting

### CORS Error
**Problem**: "Access to XMLHttpRequest blocked by CORS policy"
**Solution**: 
- Ensure backend is running on port 8081
- Verify `SecurityConfig.java` CORS is configured for `http://localhost:5173`
- Check browser console for exact URL being called

### Token Errors
**Problem**: "401 Unauthorized" responses
**Solution**:
- Clear `localStorage` and re-login
- Check JWT secret in `application.properties` matches backend JWT configuration
- Verify token is being sent in Authorization header

### Listings Not Loading
**Problem**: Browse page shows "Items will load from backend"
**Solution**:
- Check backend database has listings
- Verify `/api/listings` endpoint is returning data
- Check browser network tab for API response

### Image Upload Issues
**Problem**: Images not showing in listings
**Solution**:
- Currently uses placeholder URLs; implement image upload service
- Update `api.js` to handle file uploads with FormData
- Store image URLs in database

---

## 🔄 Next Steps (Future Enhancements)

1. **Image Upload**: Implement S3/Azure Blob Storage integration
2. **Real-time Messages**: Add WebSocket for live chat
3. **Payment Integration**: Stripe/PayPal integration for checkout
4. **Notifications**: Real-time push notifications
5. **Search Optimization**: Elasticsearch for better search
6. **User Reviews**: Star ratings and review system
7. **Wishlist Persistence**: Save wishlist in database

---

## 📦 File Changes Summary

| File | Changes |
|------|---------|
| `src/api.js` | Complete API client with all endpoints |
| `src/App.jsx` | Added listings state, auth checks, useEffect hooks |
| `src/App.jsx` - LoginPage | Integrated with API for registration/login |
| `src/App.jsx` - SellPage | Integrated with API for listing creation |
| `vite.config.js` | Added proxy config for /users endpoint |

---

## ✨ Key Features Working

✅ User registration & login with JWT  
✅ Persistent authentication (auto-login)  
✅ Create new listings  
✅ Browse all listings  
✅ Search & filter listings  
✅ View user profile  
✅ Error handling & loading states  
✅ CORS configured  
✅ Multi-language support (EN/FR/AR)  

---

## 📞 Support

For issues or questions:
1. Check error messages in browser console (F12)
2. Check network tab to see API responses
3. Verify backend is running: `http://localhost:8081`
4. Check database connection in backend logs
