export const firebaseApiKey = "Your firebase API key";
export const viroApiKey = "Your VIRO API key";
export const apiKeys = {
    firebase: firebaseApiKey,
        viro: viroApiKey
};
const config = {
    firebase: {
        apiKey: firebaseApiKey,
        messagingSenderId: "0123456789",
        authDomain: "your-auth-domain.firebaseapp.com",
        databaseURL: "https://your-database-url.com",
        projectId: "your-project-id",
        storageBucket: "your-storage-bucket.appspot.com",
        emailInputErrorMessage: "Please enter a valid Mail."
    },
    viro: {
        apiKey: viroApiKey,
        featuresMap: "https://link-to-your-features-map.com"
    }
};

export default config;