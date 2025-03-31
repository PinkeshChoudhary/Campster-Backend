const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const generateTicket = async (req, res) => {
    try {
        const { eventId, eventName, userName, eventDate, location } = req.body;

        if (!eventId || !eventName || !userName || !eventDate || !location) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const ticketsDir = path.join(__dirname, "../../tickets");
        if (!fs.existsSync(ticketsDir)) {
            fs.mkdirSync(ticketsDir, { recursive: true });
        }

        const ticketPath = path.join(ticketsDir, `ticket-${eventId}.pdf`);

        // **🎨 UI Optimized Ticket Design**
        const htmlContent = `
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
                body {
                    font-family: 'Poppins', sans-serif;
                    padding: 20px;
                    background: #0A0A0A;
                    color: #fff;
                    text-align: center;
                }
                .ticket {
                    width: 360px;
                    margin: auto;
                    padding: 2px;
                    border-radius: 10px;
                    background: #111;
                    box-shadow: 0px 4px 12px rgba(255, 255, 0, 0.2);
                    text-align: left;
                    position: relative;
                    border: 1px solid rgba(255, 255, 0, 0.4);
                }
                .campster-label {
                    font-size: 10px;
                    font-weight: bold;
                    text-align: left;
                    margin: 4px;
                    opacity: 0.8;
                }
                .yellow { color: #FFD700; }
                .black { color: black; background: #FFD700; padding: 1px 3px; border-radius: 2px; }
                .event-title {
                    font-size: 18px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 8px;
                }
                .details {
                    font-size: 12px;
                    margin: 6px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .icon {
                    width: 14px;
                    filter: invert(1);
                }
                .footer {
                    text-align: center;
                    font-size: 10px;
                    margin-top: 10px;
                    opacity: 0.7;
                }
                .qr-code {
                    display: flex;
                    justify-content: center;
                    margin-top: 12px;
                }
                .qr-code img {
                    width: 60px;
                    height: 60px;
                    border-radius: 6px;
                    background: white;
                    padding: 4px;
                }
                hr {
                    border: none;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.2);
                    margin: 8px 0;
                }
            </style>
        </head>
        <body>
            <div class="ticket">
                <div class="campster-label">
                    <span class="yellow">C</span>
                    <span class="black">a</span>
                    <span class="yellow">m</span>
                    <span class="black">p</span>
                    <span class="yellow">s</span>
                    <span class="black">t</span>
                    <span class="yellow">e</span>
                    <span class="black">r</span>
                </div>
                <h2 class="event-title">${eventName}</h2>
                <hr />
                <div class="details">
                    <img class="icon" src="https://img.icons8.com/ios-filled/50/ffffff/user.png" />
                    <strong>Name:</strong> ${userName}
                </div>
                <div class="details">
                    <img class="icon" src="https://img.icons8.com/ios-filled/50/ffffff/calendar.png" />
                    <strong>Date:</strong> ${new Date(eventDate).toLocaleString()}
                </div>
                <div class="details">
                    <img class="icon" src="https://img.icons8.com/ios-filled/50/ffffff/marker.png" />
                    <strong>Venue:</strong> ${location}
                </div>
                <div class="details">
                    <img class="icon" src="https://img.icons8.com/ios-filled/50/ffffff/ticket.png" />
                    <strong>Ticket ID:</strong> ${eventId}
                </div>
                <hr />
                <p class="footer">🎉 Thank you for booking with Campster!</p>
            </div>
        </body>
        </html>
        `;

        // **📸 Generate PDF using Puppeteer**
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        await page.pdf({ path: ticketPath, format: "A6", printBackground: true });
        await browser.close();

        // **⬇ Send PDF to User**
        res.download(ticketPath, `ticket-${eventId}.pdf`, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                return res.status(500).json({ error: "Error downloading ticket" });
            }
            // ✅ Auto-delete after download
            setTimeout(() => fs.unlink(ticketPath, (err) => {
                if (err) console.error("Error deleting file:", err);
            }), 5000);
        });

    } catch (error) {
        console.error("Error generating ticket:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { generateTicket };

