import html2pdf from 'html2pdf.js';

export const exportPDF = async (monthlyDataByYear, selectedYearOrFileName, maybeFileName) => {
  if (!monthlyDataByYear) return Promise.reject(new Error('monthlyDataByYear is required'));

  // Support two call styles:
  // 1) exportPDF(monthlyDataByYear, selectedYear, fileName)
  // 2) exportPDF(monthlyDataByYear, fileName)  <-- existing ReportsPage uses this
  let selectedYear;
  let fileName;
  

  if (maybeFileName !== undefined) {
    // three-arg form
    selectedYear = String(selectedYearOrFileName);
    fileName = String(maybeFileName);
  } else {
    // two-arg form: second param may be a filename or a year
    const second = String(selectedYearOrFileName || '');
    // if it looks like a filename (contains .pdf) treat as filename
    if (second.toLowerCase().endsWith('.pdf') || second.toLowerCase().includes('.pdf')) {
      fileName = second;
      // try to extract a 4-digit year from filename
      const yearMatch = second.match(/(20\d{2}|19\d{2})/);
      selectedYear = yearMatch ? yearMatch[0] : undefined;
    } else {
      // otherwise treat as year
      selectedYear = second;
      fileName = 'report.pdf';
    }
  }

  // if still no selectedYear, pick the first available year
  if (!selectedYear) {
    const keys = Object.keys(monthlyDataByYear);
    selectedYear = keys.length ? keys[0] : undefined;
  }

  const data = monthlyDataByYear[selectedYear];
  if (!data || !Array.isArray(data) || data.length === 0) return Promise.reject(new Error('No data for selected year'));

  // Log fetched data for debugging
  try {
    console.log('exportPDF - selectedYear:', selectedYear);
    console.log('exportPDF - data:', JSON.parse(JSON.stringify(data)));
  } catch (e) {
    console.log('exportPDF - data (raw):', data);
  }

  // build a clean DOM container for the PDF content
  const container = document.createElement('div');

container.style.position = 'absolute';
container.style.left = '-9999px';
container.style.top = '0';
container.style.width = '800px';
container.style.background = '#ffffff';
container.style.color = '#000000';
container.style.fontFamily = 'Arial, sans-serif';
container.style.padding = '20px';
container.style.zIndex = '99999';

  const title = document.createElement('h2');
  title.textContent = `Monthly Report — ${selectedYear}`;
  title.style.margin = '0 0 12px 0';
  title.style.fontSize = '18px';
  title.style.color = '#000000';
  container.appendChild(title);

  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.fontSize = '12px';

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['Month', 'Usage (L)', 'Revenue (LKR)'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    th.style.color = '#000000';
    th.style.border = '1px solid #ddd';
    th.style.padding = '8px';
    th.style.textAlign = 'left';
    th.style.background = '#f7f7f7';
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.forEach(item => {
    const tr = document.createElement('tr');
    const monthTd = document.createElement('td');
    monthTd.textContent = item?.month ?? '';
    monthTd.style.border = '1px solid #ddd';
    monthTd.style.padding = '8px';
    monthTd.style.textAlign = 'left';
    monthTd.style.color = '#000000';

    const usageTd = document.createElement('td');
    usageTd.textContent = item?.usage != null ? Number(item.usage).toLocaleString() : '';
    usageTd.style.border = '1px solid #ddd';
    usageTd.style.padding = '8px';
    usageTd.style.textAlign = 'right';
    usageTd.style.color = '#000000';

    const revenueTd = document.createElement('td');
    revenueTd.textContent = item?.revenue != null ? Number(item.revenue).toLocaleString() : '';
    revenueTd.style.border = '1px solid #ddd';
    revenueTd.style.padding = '8px';
    revenueTd.style.textAlign = 'right';
    revenueTd.style.color = '#000000';

    tr.appendChild(monthTd);
    tr.appendChild(usageTd);
    tr.appendChild(revenueTd);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
document.body.appendChild(container);

container.getBoundingClientRect();

await new Promise(requestAnimationFrame);
await new Promise(resolve => setTimeout(resolve, 500));



const worker = html2pdf();
  return worker
    .set({
      margin: 10,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
  allowTaint: true,
  logging: true,
},
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
    .from(container)
    .save()
    .then(() => container.remove())
    .catch(err => {
      container.remove();
      throw err;
    });
};