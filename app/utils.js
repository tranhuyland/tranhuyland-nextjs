export async function getGoogleSheetData() {
  const LINK_CSV = "https://docs.google.com/spreadsheets/d/1-LupBV6uNuUitz4vF6pFv6MupuVDMujafqhjQBNNPTA/export?format=csv";
  
  try {
    const response = await fetch(LINK_CSV, { next: { revalidate: 300 } }); 
    const text = await response.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const jsonResult = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const currentLine = [];
      let insideQuote = false;
      let entries = "";
      
      for (let j = 0; j < lines[i].length; j++) {
        let char = lines[i][j];
        if (char === '"') insideQuote = !insideQuote;
        else if (char === ',' && !insideQuote) {
          currentLine.push(entries.trim());
          entries = "";
        } else entries += char;
      }
      currentLine.push(entries.trim());

      if (currentLine.length >= headers.length) {
        const obj = {};
        headers.forEach((h, idx) => {
          let val = currentLine[idx] ? currentLine[idx].replace(/[\"']/g, "") : "";
          if (h === 'id') obj[h] = parseInt(val) || i;
          else if (h === 'soGia') obj[h] = parseFloat(val) || 0;
          else obj[h] = val.replace(/[\r\n]/g, "").trim();
        });
        jsonResult.push(obj);
      }
    }
    return jsonResult;
  } catch (error) {
    console.error("Lỗi kết nối tệp Sheets:", error);
    return [];
  }
}
