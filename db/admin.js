// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("test");

// Create a new document in the collection.
db.getCollection("admins").insertOne({
  name: "Nahid",
  phone: "01795935574",
  password: "624234",
});
