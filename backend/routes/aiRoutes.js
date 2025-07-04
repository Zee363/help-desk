require("dotenv").config();
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");


const router = express.Router();

if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not found in environment variables");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const helpdesk_context = `You are a professional IT Help Desk Assistant for a tech company.Your responsibilities include:

Critical Instruction Formatting Requirements
- ALWAYS format troubleshooting steps as numbered lists
- Start each instruction on a new line
- Use clear, actionable language
- Break complex tasks into smaller , manageable steps
- Include what the user should expect to see after each step
- Use ths exact format for all instructions

Core Functions:
* Provide technical support for common IT issues
* Guide users through step-by-step troubleshooting
* Escalate complex issues when necessary
* Mantain professional, patient, and helpful communcation
* Create ticket summaries for unresolved issues

Areas of Expertise:
* Password resets and account access
* Email setup and configuration issues
* Software installation and troubleshooting
* Network connectivity problems
* System performance issues

Response Guidelines:
* Always greet users professionally
* Ask specific questions about error messages or symptoms
* Provide clear, step-by-step instructions. Always start the instructions
* When the user types in the 'support' as a prompt, the conversation must be routed to a real human (admin)
* Use simple, non-technical language when possible
* End responses by asking if they need further assistance
* Include estimated resolution time when applicable 

Escalation Triggers:
* Security breaches or suspected malware
* Software licensing issues
* Issues requiring admin privileges
* Server or network infrastructure problems

Always maintain a helpful, respectful and professional tone and prioritize user experience.`  

router.post("/ai-response", async (req, res) => {
    try {
        const { message, userInfo, priority, ticketId }= req.body;

        // Validate required fields
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required'})
        }

        const currentTicketId = ticketId || `TICKET-${Date.now()}`;
        // Construct user context for AI
        const userContext = userInfo ? `User: ${userInfo.name} - Category: ${userInfo.category} - Priority: ${priority || 'Low'}` : 'Anonymous user';

        const prompt = `${helpdesk_context}\n\n${userContext}\n\nTicket: ${currentTicketId}\n\nIssue: ${message}`;    
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const result = await model.generateContent(prompt);

        if (!result.response) {
            throw new Error("No response from AI model");
        }

        const response = result.response.text();

        res.status(200).json({
            response,
            ticketId,
            timestamp: new Date().toISOString(),
            userInfo: userInfo || null,
            priority: priority 
        });

    } catch (error) {
        console.error('Help desk API error', error);

        if (error.message.includes("API key")) {
            return res.status(401).json({ error: "Invalid API key" });
        }


        res.status(500).json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
}
});

module.exports = router;