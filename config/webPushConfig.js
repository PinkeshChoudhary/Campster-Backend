const webpush = require("web-push");

const vapidKeys = {
    publicKey: "BCups309q-fqWyo3imYG0oiUVzlb8cm4lF2iNm9xDfn7bmtSOEO0YBwjdL0Og9PPvMr2tTMrtKURMPJhX_30apQ",
    privateKey: "sYWSAiX8M5ZdrkcHe9CJuS5PEfp_sJAra0Wup9KkrmE",
};

webpush.setVapidDetails(
    "mailto:admin@yourwebsite.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

module.exports = webpush;
