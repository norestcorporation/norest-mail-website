import { useState } from "react";
import { Email } from "../data/mockData";
import { Download, Loader2 } from "lucide-react";
import { getUserProfile } from "@/lib/api/auth";
import { getAccessToken } from "@/lib/token_manager";

export function TranscriptDownloader({ email }: { email: Email }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    // Fetch real user details
    let currentUser = { name: "Norest User", email: "" };
    try {
      const accessToken = getAccessToken();
      if (accessToken) {
        const profile = await getUserProfile(accessToken);
        if (profile) {
          currentUser = {
            name: profile.email.split('@')[0],
            email: profile.email
          };
        }
      }
    } catch (e) {
      console.error("Failed to fetch profile for PDF", e);
    }

    // Create an invisible iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const allMessages = email.thread || [];
    const initialMessage = {
      id: email.id,
      senderName: email.senderName,
      senderEmail: email.senderEmail,
      date: email.date,
      body: email.body,
    };

    const threadToPrint = [initialMessage, ...allMessages];

    // Minimalistic & Premium Design
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Transcript - ${email.subject}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
            
            :root {
              --primary: #111111;
              --secondary: #666666;
              --bg: #ffffff;
              --divider: #eaeaea;
            }

            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              color: var(--primary);
              line-height: 1.6;
              padding: 40px;
              margin: 0 auto;
              max-width: 800px;
              background: var(--bg);
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-bottom: 60px;
            }

            .logo { 
              font-size: 24px;
              font-weight: 600;
              letter-spacing: -0.5px;
            }

            .meta { 
              text-align: right; 
              color: var(--secondary); 
              font-size: 13px;
              font-weight: 400;
            }

            .meta strong {
              color: var(--primary);
              font-weight: 500;
            }

            .subject-area { 
              margin-bottom: 50px; 
            }
            
            .subject-area h1 { 
              font-size: 32px; 
              font-weight: 600;
              letter-spacing: -1px;
              margin: 0 0 10px 0; 
              line-height: 1.2;
            }
            
            .subject-area p { 
              color: var(--secondary); 
              font-size: 14px; 
              margin: 0; 
            }

            .messages {
              display: flex;
              flex-direction: column;
              gap: 40px;
            }
            
            .message { 
              page-break-inside: avoid; 
            }
            
            .msg-header { 
              display: flex; 
              justify-content: space-between;
              align-items: baseline;
              margin-bottom: 12px; 
            }
            
            .msg-header .sender-info {
              font-size: 15px;
            }
            
            .msg-header .sender { 
              font-weight: 600; 
              color: var(--primary);
            }
            
            .msg-header .email { 
              color: var(--secondary); 
              margin-left: 6px;
            }
            
            .msg-header .date { 
              color: var(--secondary); 
              font-size: 13px; 
            }
            
            .msg-body { 
              font-size: 15px; 
              color: #333;
              line-height: 1.7;
            }
            
            .msg-body blockquote { 
              border-left: 2px solid var(--divider); 
              margin: 15px 0; 
              padding-left: 15px; 
              color: var(--secondary); 
            }

            .footer { 
              margin-top: 80px; 
              padding-top: 30px; 
              border-top: 1px solid var(--divider);
              text-align: center; 
              color: #999; 
              font-size: 12px;
              font-weight: 300;
            }

            @media print {
              body { padding: 0; max-width: 100%; }
              @page { margin: 2cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              Norest Mail
            </div>
            <div class="meta">
              Generated by <strong>${currentUser.name}</strong><br>
              ${currentUser.email}<br>
              ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div class="subject-area">
            <h1>${email.subject || 'No Subject'}</h1>
            <p>Transcript of ${threadToPrint.length} message${threadToPrint.length > 1 ? 's' : ''}</p>
          </div>
          <div class="messages">
            ${threadToPrint.map(msg => `
              <div class="message">
                <div class="msg-header">
                  <div class="sender-info">
                    <span class="sender">${msg.senderName}</span><span class="email">&lt;${msg.senderEmail}&gt;</span>
                  </div>
                  <div class="date">${msg.date}</div>
                </div>
                <div class="msg-body">${msg.body}</div>
              </div>
            `).join('')}
          </div>
          <div class="footer">
            Official Transcript &bull; Norest Mail Secure Records
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.parent.document.body.removeChild(window.frameElement);
              }, 1000);
            };
          </script>
        </body>
      </html>
    `;

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
    }

    setIsDownloading(false);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="h-8 px-3 cursor-pointer rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-secondary hover:text-text-primary disabled:opacity-50"
      title="Print or Save as PDF"
    >
      {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      <span className="text-[12px] font-semibold hidden sm:block">{isDownloading ? 'Generating...' : 'Download Transcript'}</span>
    </button>
  );
}
