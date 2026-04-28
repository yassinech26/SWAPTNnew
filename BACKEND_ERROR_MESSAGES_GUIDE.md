# Backend Error Messages Implementation - Complete Guide

## ✅ What Was Implemented

All error messages from the backend **ListingController** are now linked to the frontend and displayed directly to users. No more hardcoded error messages!

---

## 🎯 How It Works

### Step 1: Backend (ListingController) - Throw Error
```java
@PostMapping
public ResponseEntity<Listing> createListing(@RequestBody Listing listing) {
    if (listing.getTitle() == null || listing.getTitle().trim().isEmpty()) {
        throw new BadRequestException("📝 Please enter an item title (e.g., 'Blue Nike Hoodie')");
    }
    // Error is thrown here!
}
```

### Step 2: Global Exception Handler - Catch & Convert to JSON
```java
@ExceptionHandler(BadRequestException.class)
public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex, HttpServletRequest request) {
    ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),  // Get the message we threw!
            request.getRequestURI()
    );
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
}
```

**Response sent to frontend (JSON):**
```json
{
    "timestamp": "2026-04-05T20:00:00",
    "status": 400,
    "error": "📝 Please enter an item title (e.g., 'Blue Nike Hoodie')",
    "path": "/api/listings"
}
```

### Step 3: Frontend API Layer - Extract Message
```javascript
// In api.js - request() function
if (!res.ok) {
    const body = await res.json();
    errorMsg = body.message || body.error || JSON.stringify(body);
    //                        ↑↑↑ Get the error field from backend JSON
    throw new Error(errorMsg);  // Throw it so React can catch it
}
```

### Step 4: React Component - Display to User
```jsx
// In SellPage component
const handlePublish = async () => {
    try {
        const result = await api.createListing(listingData);
    } catch (err) {
        setError(err.message);  // Gets backend error message!
    }
};

// In the render:
{error && (
    <div style={{ background: "#fff0f0", color: "var(--coral)" }}>
        {error}  {/* User sees: "📝 Please enter an item title..." */}
    </div>
)}
```

---

## 📊 Error Messages Reference

### All Updated ListingController Endpoints

| Endpoint | Method | Error | Message |
|----------|--------|-------|---------|
| `/api/listings` | GET | 404 | 📦 No items available right now. Check back soon! |
| `/api/listings/{id}` | GET | 400 | ❌ Invalid item ID. Please check the link and try again. |
| `/api/listings/{id}` | GET | 404 | 😔 This item is no longer available. It may have been sold or removed. |
| `/api/listings` | POST | 400 | 📝 Please enter an item title (e.g., 'Blue Nike Hoodie') |
| `/api/listings` | POST | 400 | 💰 Price must be greater than 0 TND. Enter a valid price. |
| `/api/listings/{id}` | PUT | 400 | ❌ Invalid item ID. Cannot update this item. |
| `/api/listings/{id}` | PUT | 400 | 📝 Please enter an item title |
| `/api/listings/{id}` | PUT | 404 | 😔 This item no longer exists or was removed. |
| `/api/listings/{id}` | DELETE | 400 | ❌ Invalid item ID. Cannot delete this item. |
| `/api/listings/{id}` | DELETE | 404 | 😔 This item no longer exists or was removed. |
| `/api/listings/search` | GET | 400 | 🔍 Please enter a search term (brand or item name) |
| `/api/listings/search` | GET | 404 | 🛍️ No items found for 'X'. Try different keywords or browse all items. |
| `/api/listings/category/{cat}` | GET | 400 | ❌ Category name is required to filter items |
| `/api/listings/category/{cat}` | GET | 404 | 🛍️ No items in the 'X' category yet. Check back soon! |
| `/api/listings/price` | GET | 400 | 💰 Invalid price range. Ensure minimum is less than maximum and both are positive. |
| `/api/listings/price` | GET | 404 | 💸 No items found in the price range X - Y TND. Try a wider price range. |

---

## 🖥️ Frontend Components Using Backend Errors

### ✅ Already Implemented (Showing Error Messages)

1. **LoginPage** (`src/App.jsx` line ~1505)
   - Catches authentication errors from `/auth/login` and `/auth/signup`
   - Shows in coral-colored alert box
   - Example: "Invalid email or password"

2. **SellPage** (`src/App.jsx` line ~951)
   - Catches listing creation errors from `/api/listings`
   - Shows in coral-colored alert box
   - Example: "📝 Please enter an item title..."

3. **BrowsePage** (`src/App.jsx` line ~641)
   - Shows listing fetch errors at the top
   - Displays when API fails to load items
   - New: App-level error state passed as prop

---

## 🚀 How to Test

### Test 1: Try Publishing a Listing Without Title
1. Go to **Sell** page
2. Fill in: Description, Category, Price
3. **Skip Title** (leave empty)
4. Click "Continue"
5. **Expected:** Error message appears: "📝 Please enter an item title..."

### Test 2: Try Entering Negative Price
1. Go to **Sell** page
2. Fill in: Title, Description, Category
3. Enter **-50** for price
4. **Expected:** Error message: "💰 Price must be greater than 0 TND..."

### Test 3: Try Searching with Empty Term
1. Go to **Browse** page
2. Click search without typing anything
3. **Expected:** Error message: "🔍 Please enter a search term..."

### Test 4: Try Invalid Price Range
1. Go to **Browse** page
2. Open filters
3. Enter Min Price: **100**, Max Price: **50**
4. **Expected:** Error message: "💰 Invalid price range..."

---

## 📝 How to Add More Error Messages

When you create a new endpoint or feature:

### 1. In Backend Controller:
```java
@PostMapping("/new-endpoint")
public ResponseEntity<?> newEndpoint(@RequestBody SomeData data) {
    // Validate input
    if (data.getField() == null) {
        throw new BadRequestException("User-friendly error message");
        //     ↑↑↑↑ These messages appear on the frontend!
    }
    // ... rest logic
}
```

### 2. In Frontend Component:
```jsx
const [error, setError] = useState("");

try {
    const result = await api.newEndpoint(data);
    // Success logic
} catch (err) {
    setError(err.message);  // Backend message appears here!
}

// Render:
{error && <div style={{color: "red"}}>{error}</div>}
```

That's it! The error message from backend automatically displays on frontend.

---

## 🔍 Where Everything Is Connected

```
ListingController.java (backend)
    ↓ throws exception
GlobalExceptionHandler.java (catches & wraps)
    ↓ sends JSON response
Frontend api.js (extracts error field)
    ↓ throws Error
React Component (catches & displays)
    ↓
User sees error message
```

---

## ✨ Key Features

✅ **User-Friendly Messages** - Every error explains what went wrong  
✅ **Emoji Indicators** - Visual cues (📝 for text, 💰 for money, etc.)  
✅ **Centralized** - All errors go through GlobalExceptionHandler  
✅ **Consistent** - Same format across all endpoints  
✅ **Easy to Update** - Just change message in controller  
✅ **No Duplicates** - One source of truth (backend)  

---

## 🎯 Summary

All error messages from the backend are **immediately** displayed on the frontend. Users see exactly what went wrong and how to fix it. No more generic "Something went wrong" messages!

The error flow is: Backend → Handler → API Layer → React Component → User

This ensures that backend developers can update error messages without touching frontend code! 🎉
