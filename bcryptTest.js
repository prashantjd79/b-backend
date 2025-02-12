const bcrypt = require('bcrypt');

async function testBcrypt() {
  const plainPassword = "123456";  // Same password used in signup
  const storedHash = "$2b$12$2z2OyAvB5C49I1XUg76DpquAEacndpyp0JeeMZtyhti/hq0aDiD1q"; // Replace with the hash from MongoDB

  console.log("🔍 Testing bcrypt.compare()...");
  console.log("🔑 Entered Password:", plainPassword);
  console.log("🔒 Stored Hash:", storedHash);

  const isMatch = await bcrypt.compare(plainPassword, storedHash);
  console.log("✅ Password Matches Stored Hash:", isMatch);
}

testBcrypt();
