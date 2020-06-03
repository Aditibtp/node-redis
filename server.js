const redis = require("redis");
const { promisify } = require("util");

// Connect to the Azure Cache for Redis over the TLS port using the key.
const cacheConnection = redis.createClient(6380, process.env.REDISCACHEHOSTNAME, 
    {auth_pass: process.env.REDISCACHEKEY, tls: {servername: process.env.REDISCACHEHOSTNAME}});

// Perform cache operations using the cache connection object...
const pingAsync = promisify(cacheConnection.ping).bind(cacheConnection);
const getAsync = promisify(cacheConnection.get).bind(cacheConnection);
const setAsync = promisify(cacheConnection.set).bind(cacheConnection);
const clientAsync = promisify(cacheConnection.client).bind(cacheConnection);

async function testCache() {

    // Simple PING command
    console.log("\nCache command: PING");
    
    
    console.log("Cache response : " + await pingAsync());

    // Simple get and put of integral data types into the cache
    console.log("\nCache command: GET Message");
    console.log("Cache response : " + await getAsync("Message"));    

    console.log("\nCache command: SET Message");
    console.log("Cache response : " + await setAsync("Message",
        "Hello! The cache is working from Node.js!"));    

    // Demonstrate "SET Message" executed as expected...
    console.log("\nCache command: GET Message");
    console.log("Cache response : " + await getAsync("Message"));    

    // Get the client list, useful to see if connection list is growing...
    console.log("\nCache command: CLIENT LIST");
    console.log("Cache response : " + await clientAsync("LIST"));    
}

testCache();