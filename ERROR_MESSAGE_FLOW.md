# Error Message Flow: Backend to Frontend

## 📋 Overview
All error messages from the backend are now linked to the frontend and displayed directly to users. The system uses a standard error flow that ensures any exception thrown in the backend is gracefully caught and presented to the user.

---

## 🔄 The Complete Error Flow

### 1. **Backend Layer** (Java/Spring Boot)
- **Location:** `src/main/java/com/cherifyedeshemdenebenhamed/demo/controller/ListingController.java`
- **What it does:** Throws meaningful exceptions with user-friendly messages

**Example:**
```java
@PostMapping
public ResponseEntity<Listing> createListing(@RequestBody Listing listing) {
    if (listing.getTitle() == null || listing.getTitle().trim().isEmpty()) {
        throw new BadRequestException("📝 Please enter an item title (e.g., 'Blue Nike Hoodie')");
    }
    if (listing.getPrice() == null || listing.getPrice() < 0) {
        throw new BadRequestException("💰 Price must be greater than 0 TND. Enter a valid price.");
    }
    // ... rest of the method
}
```

---

### 2. **Exception Handler Layer** (Global)
- **Location:** `src/main/java/com/cherifyedeshemdenebenhamed/demo/exception/GlobalExceptionHandler.java`
- **What it does:** Catches ALL exceptions from controllers and converts them to JSON responses

**How it works:**
```java
@ExceptionHandler(BadRequestException.class)
public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex, HttpServletRequest request) {
    ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.BAD_REQUEST.value(),  // 400 status
            ex.getMessage(),                  // The error message from the exception
            request.getRequestURI()
    );
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
}
```

**Response Format (JSON):**
```json
{
    "timestamp": "2026-04-05T20:00:00",
    "status": 400,
    "error": "📝 Please enter an item title (e.g., 'Blue Nike Hoodie')",
    "path": "/api/listings"
}
```

---

### 3. **API Layer** (frontend/api.js)
- **Location:** `src/api.js`
- **What it does:** Extracts the error message from the JSON response and throws it

**Code:**
```javascript
async function request(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: { ...authHeaders(), ...options.headers },
    });
    
    if (!res.ok) {
        let errorMsg = `Error ${res.status}`;
        try {
            const body = await res.json();
            errorMsg = body.message || body.error || JSON.stringify(body);
            //                        ^^^ This is the error message from backend!
        } catch {
            try { errorMsg = await res.text(); } catch {}
        }
        console.error(`[REQUEST] Failed: ${res.status} - ${errorMsg}`);
        throw new Error(errorMsg);  // Throw it so catch blocks get it
    }
    // ... rest of the method
}
```

---

### 4. **UI Components** (React)
- **Locations:** 
  - `src/App.jsx` - LoginPage
  - `src/App.jsx` - SellPage
  - `src/App.jsx` - ProfilePage
  - etc.

- **What they do:** Catch the error and display it to the user

**Example (SellPage):**
```jsx
const handlePublish = async () => {
    setError("");  // Clear previous error
    setLoading(true);
    try {
        const result = await api.createListing(listingData);
        if (result?.id) {
            alert("✅ Listing published successfully!");
            setPage("profile");
        }
    } catch (err) {
        // err.message comes from backend!
        setError(err.message || "Failed to publish listing. Please try again.");
        console.error("Publish error:", err);
    } finally {
        setLoading(false);
    }
};
```

**Display in UI:**
```jsx
{error && (
    <div style={{
        background: "#fff0f0",
        border: "1px solid var(--coral)",
        color: "var(--coral)",
        padding: 12,
        borderRadius: "var(--radius-sm)",
        marginBottom: 16,
        fontSize: 14,
        fontWeight: 500
    }}>
        {error}  {/* ← Backend error message displays here! */}
    </div>
)}
```

---

## 🎯 Error Messages by Endpoint

### Listing CRUD Operations

| Endpoint | HTTP | Error Message |
|----------|------|---------------|
| `GET /api/listings` | 404 | 📦 No items available right now. Check back soon! |
| `GET /api/listings/{id}` | 400 | ❌ Invalid item ID. Please check the link and try again. |
| `GET /api/listings/{id}` | 404 | 😔 This item is no longer available. It may have been sold or removed. |
| `POST /api/listings` | 400 | 📝 Please enter an item title... |
| `POST /api/listings` | 400 | 💰 Price must be greater than 0 TND... |
| `PUT /api/listings/{id}` | 400 | ❌ Invalid item ID. Cannot update this item. |
| `PUT /api/listings/{id}` | 400 | 📝 Please enter an item title |
| `DELETE /api/listings/{id}` | 400 | ❌ Invalid item ID. Cannot delete this item. |
| `DELETE /api/listings/{id}` | 404 | 😔 This item no longer exists or was removed. |

### Search & Filter Operations

| Endpoint | HTTP | Error Message |
|----------|------|---------------|
| `GET /api/listings/search?title=...` | 400 | 🔍 Please enter a search term (brand or item name) |
| `GET /api/listings/search?title=...` | 404 | 🛍️ No items found for 'X'. Try different keywords... |
| `GET /api/listings/category/{category}` | 400 | ❌ Category name is required to filter items |
| `GET /api/listings/category/{category}` | 404 | 🛍️ No items in the 'X' category yet. Check back soon! |
| `GET /api/listings/price?min=X&max=Y` | 400 | 💰 Invalid price range. Ensure minimum is less than maximum... |
| `GET /api/listings/price?min=X&max=Y` | 404 | 💸 No items found in the price range X - Y TND... |

---

## 🔗 How Errors Are Linked

1. **Backend throws exception** with meaningful message
   - `throw new BadRequestException("Clear user-friendly message")`

2. **GlobalExceptionHandler catches it** and creates JSON
   - `errorMsg.error = ex.getMessage()`

3. **Frontend API layer extracts it**
   - `errorMsg = body.error`

4. **React component catches it**
   - `err.message` = backend error message

5. **User sees it in the UI**
   - Displayed in a styled alert box

---

## ✅ Current Components with Error Display

These components already display backend error messages:

| Component | Location | Status |
|-----------|----------|--------|
| LoginPage | src/App.jsx (line 1505) | ✅ Showing backend errors |
| SellPage | src/App.jsx (line 951) | ✅ Showing backend errors |
| ProfilePage | src/App.jsx (partial) | 🔄 Update profile endpoint |
| App.jsx | src/App.jsx (line ~1750) | ⚠️ Listing fetch errors logged only |

---

## 🚀 How to Use This for New Features

When you add a new feature with API calls:

1. **In Backend (Controller):**
   ```java
   throw new BadRequestException("Clear error message for users");
   ```

2. **In Frontend (Component):**
   ```jsx
   const [error, setError] = useState("");
   
   try {
       const result = await api.callEndpoint(data);
   } catch (err) {
       setError(err.message);  // Automatically gets backend message
   }
   ```

3. **Display in UI:**
   ```jsx
   {error && <div style={{...errorStyles}}>{error}</div>}
   ```

---

## 🔧 Testing Errors

To test that error messages flow correctly:

1. **Try creating a listing without title:**
   - Should show: "📝 Please enter an item title..."

2. **Try entering negative price:**
   - Should show: "💰 Price must be greater than 0 TND..."

3. **Try searching with empty search term:**
   - Should show: "🔍 Please enter a search term..."

4. **Try invalid price range (min > max):**
   - Should show: "💰 Invalid price range..."

---

## 📊 Error Flow Diagram

```
Backend Exception
    ↓
GlobalExceptionHandler (catches it)
    ↓
Creates ErrorResponse JSON with "error" field
    ↓
Sends HTTP response (400, 404, 500, etc.)
    ↓
Frontend api.js (receives response)
    ↓
Extracts body.error message
    ↓
Throws as Error object
    ↓
React component catch block (catches it)
    ↓
Stores in setError(err.message)
    ↓
Renders error div with message
    ↓
USER SEES: Backend error message displayed in coral alert box
```

---

## 📝 Summary

✅ **Error messages from ListingController now display on the frontend**
- Backend throws exceptions with user-friendly messages
- GlobalExceptionHandler converts to JSON responses
- Frontend api.js extracts and throws errors
- React components catch and display them
- Users see clear, helpful error messages with context


All error messages are now **centralized, consistent, and user-focused** across the entire application!
