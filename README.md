# secure-note-app-backend
Build a backend where users sign up, log in, and manage their own private notes.


Secure Notes API — Instructions
Build a backend where users sign up, log in, and manage their own private notes. No code here — just what to do. Figure out the how.

Before you start

Node.js installed
MongoDB running (local or Atlas)
Postman or Thunder Client
Git installed


Step 1 — Initialize project

Make a folder, run npm init
Install: express, mongoose, jsonwebtoken, bcrypt, zod, dotenv
Install as dev dep: nodemon
Add a dev script that runs nodemon on your entry file


Step 2 — Create folder structure
Inside a src/ folder, create:

index.js (entry point)
db.js (database connection)
middleware/auth.js
models/User.js, models/Note.js
routes/auth.js, routes/notes.js
schemas/validation.js


Step 3 — Config files

Create .env with: PORT, MONGO_URI, JWT_SECRET
Create .gitignore with: node_modules, .env, .DS_Store
Run git init, make first commit


Step 4 — Entry point (index.js)

Load dotenv at the very top
Create express app
Use express.json() middleware for parsing request bodies
Call your DB connection function
Mount auth routes at /auth
Mount note routes at /notes
Start listening on PORT from env
Test: run the server, confirm it starts with no errors


Step 5 — DB connection (db.js)

Write an async function that connects mongoose to MONGO_URI
Log success/failure
Exit the process on connection failure
Export the function
Test: server logs "MongoDB connected" on startup

Commit.

Step 6 — User model
Fields needed:

email (string, required, unique, lowercase)
password (string, required) — this stores the HASH, never plain text
role (string, enum of 'user' and 'admin', default 'user')
Enable timestamps

Export the Mongoose model.

Step 7 — Note model
Fields needed:

title (string, required)
content (string, default empty)
userId (ObjectId, references User model, required, indexed)
Enable timestamps

The userId is the most important field — it's how you track ownership.

Step 8 — Zod validation schemas
Create four schemas:

signupSchema: email (must be valid email), password (min 8 chars)
loginSchema: email (valid), password (any string)
noteSchema: title (1–200 chars, required), content (optional, max 10000)
updateNoteSchema: same as noteSchema but all fields optional

Export all four.

Step 9 — Auth middleware
Build a middleware function that:

Reads the Authorization header
If missing or doesn't start with "Bearer ", return 401
Extracts the token (everything after "Bearer ")
Verifies it with jwt.verify using your JWT_SECRET
If valid → attach the decoded payload to req.user, call next()
If invalid/expired → return 401

Export it.

Step 10 — Signup route
POST /auth/signup:

Validate body with signupSchema (use safeParse) — return 400 if invalid
Check if a user with this email already exists → return 409 if yes
Hash the password with bcrypt (salt rounds = 10)
Create the user in the DB with the hashed password
Return 201 with the user's id and email (never the password)

Test in Postman:

Valid signup → 201
Duplicate email → 409
Invalid email → 400
Short password → 400

Commit.

Step 11 — Login route
POST /auth/login:

Validate body with loginSchema → return 400 if invalid
Find the user by email → if not found, return 401 with "Invalid credentials"
Compare password with stored hash using bcrypt → if no match, return 401 with the SAME message
If match: sign a JWT with payload { id, role }, expiresIn '1h'
Return the token

Important: use the same "Invalid credentials" message for both cases (wrong email vs wrong password) — this prevents attackers from discovering registered emails.
Test in Postman:

Valid login → 200 with token
Wrong password → 401
Non-existent email → 401

Copy the token — you need it for every request below.
Commit.

Step 12 — Protect the notes routes
At the top of your notes router (after creating it), apply the auth middleware to ALL routes using router.use(auth). Now every notes route automatically requires a valid JWT.

Step 13 — Notes CRUD routes
All 5 routes live at /notes. Each one filters by userId: req.user.id — this is the ownership pattern.
GET / — list my notes

Get all notes where userId === req.user.id
Bonus: support ?search=keyword to filter by title (case-insensitive regex)
Sort newest first
Return the array

POST / — create a note

Validate body with noteSchema → 400 if invalid
Create the note with userId: req.user.id set from the token
Return 201 with the new note

GET /:id — get one note

Use findOne with filter: { _id: params.id, userId: req.user.id }
If not found → 404
If found → return it

PUT /:id — update a note

Validate body with updateNoteSchema → 400 if invalid
Use findOneAndUpdate with the same filter
Set { new: true } so you get the updated doc back
If not found → 404

DELETE /:id — delete a note

Use findOneAndDelete with the same filter
If not found → 404
Return success message

Why filter by userId in every query: if user A tries to access user B's note by ID, the filter { _id: ..., userId: A } returns nothing → 404. Users mechanically cannot reach each other's data. This is the whole security model.
Test in Postman:

All 5 routes work with the token
All 5 return 401 without the token
Critical test: sign up a second user, log in as them, try to GET the first user's note with the second user's token → must return 404

Commit.

Step 14 — README
Write a simple README covering:

What the project does
How to install and run (including the three .env keys)
A table of endpoints with methods and auth required
A note that protected routes need Authorization: Bearer <token>


Step 15 — Push to GitHub

Create a new empty repo on GitHub (no README, no gitignore)
Add the remote, rename branch to main if needed, push


Common errors to expect

"Cannot connect to MongoDB" → MongoDB not running, or wrong URI
"req.body is undefined" → you forgot app.use(express.json())
"Cast to ObjectId failed" → you passed an invalid ID in the URL
"jwt must be provided" → missing Authorization header in Postman
"Cannot read properties of undefined (reading 'id')" → middleware not running, or payload key mismatch between jwt.sign and where you read it

Read the FULL error message before panicking. The answer is almost always in the stack trace.

Rules while building

Test each route in Postman before moving to the next
Commit after every working step
Read errors fully — don't just skim the first line
Stuck 30+ minutes? Walk away for 10. Come back fresh.
Official docs only: Mongoose, Express, Zod, jsonwebtoken
No AI, no tutorials, no copy-paste
