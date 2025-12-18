


export async function extractTextSimple(fileUrl) {
  const res = await fetch("https://api.pdf.co/v1/pdf/convert/to/text", {
  method: "POST",
  headers: {
    "x-api-key": process.env.PDFCO_API_KEY,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    url: fileUrl,
    inline: true
  })
});

const result = await res.json();
const text = result.body;

return text
  
}



