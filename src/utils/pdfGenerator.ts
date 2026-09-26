import { IdCardRecord } from '../types';
import JsBarcode from 'jsbarcode';

/**
 * Pure zero-dependency PDF 1.4 binary generator for a 2-page ID card (Front and Back).
 */
export function createTwoPagePdfFromDataUrls(
  frontJpegDataUrl: string,
  backJpegDataUrl: string,
  imgWidth = 1656,
  imgHeight = 2483
): { base64: string; blob: Blob; buffer: Uint8Array } {
  // Extract base64 payload from data URLs
  const cleanFrontB64 = frontJpegDataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
  const cleanBackB64 = backJpegDataUrl.replace(/^data:image\/[a-z]+;base64,/, '');

  // Convert base64 to binary string
  const frontBin = atob(cleanFrontB64);
  const backBin = atob(cleanBackB64);

  // Standard vertical card proportions (595.28 pt width x 892.5 pt height)
  const pageWidth = 595.28;
  const pageHeight = Math.round(pageWidth * (imgHeight / imgWidth) * 100) / 100;

  const content1 = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im1 Do\nQ\n`;
  const content2 = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im2 Do\nQ\n`;

  const offsets: number[] = [];
  let pdf = '%PDF-1.4\n';

  function addObj(header: string, streamBin: string | null = null) {
    offsets.push(pdf.length);
    pdf += header + '\n';
    if (streamBin !== null) {
      pdf += 'stream\n';
      pdf += streamBin;
      pdf += '\nendstream\n';
    }
    pdf += 'endobj\n';
  }

  // 1: Catalog
  addObj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>');

  // 2: Pages
  addObj('2 0 obj\n<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>');

  // 3: Page 1 (Front)
  addObj(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im1 5 0 R >> >> /Contents 7 0 R >>`);

  // 4: Page 2 (Back)
  addObj(`4 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im2 6 0 R >> >> /Contents 8 0 R >>`);

  // 5: Image 1 (Front JPEG)
  addObj(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgWidth} /Height ${imgHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${frontBin.length} >>`, frontBin);

  // 6: Image 2 (Back JPEG)
  addObj(`6 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgWidth} /Height ${imgHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${backBin.length} >>`, backBin);

  // 7: Content 1
  addObj(`7 0 obj\n<< /Length ${content1.length} >>`, content1);

  // 8: Content 2
  addObj(`8 0 obj\n<< /Length ${content2.length} >>`, content2);

  // xref
  const startXref = pdf.length;
  pdf += 'xref\n';
  pdf += `0 ${offsets.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 0; i < offsets.length; i++) {
    const offStr = String(offsets[i]).padStart(10, '0');
    pdf += `${offStr} 00000 n \n`;
  }
  pdf += 'trailer\n';
  pdf += `<< /Size ${offsets.length + 1} /Root 1 0 R >>\n`;
  pdf += 'startxref\n';
  pdf += `${startXref}\n`;
  pdf += '%%EOF\n';

  // Convert latin1 string to Uint8Array buffer
  const len = pdf.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = pdf.charCodeAt(i) & 0xff;
  }

  const blob = new Blob([bytes], { type: 'application/pdf' });
  const base64 = btoa(pdf);

  return { base64, blob, buffer: bytes };
}

/**
 * Renders the official Front and Back ID Card canvases in high-res and generates a 2-page PDF.
 */
export async function generateCardPdf(card: IdCardRecord): Promise<{ pdfBase64: string; pdfBlob: Blob }> {
  // 1. Create Front Canvas
  const frontCanvas = document.createElement('canvas');
  frontCanvas.width = 1656;
  frontCanvas.height = 2483;
  const fCtx = frontCanvas.getContext('2d');
  if (!fCtx) throw new Error('Could not get 2D canvas context');

  // Load Template & Athlete Image
  const templateImg = new Image();
  templateImg.crossOrigin = 'anonymous';
  templateImg.src = '/official_id_front_template.png';

  const athleteImg = new Image();
  athleteImg.crossOrigin = 'anonymous';
  athleteImg.src = card.photoUrl || '/athlete_top_right.jpg';

  await Promise.all([
    new Promise<void>((r) => { if (templateImg.complete) r(); else templateImg.onload = () => r(); templateImg.onerror = () => r(); }),
    new Promise<void>((r) => { if (athleteImg.complete) r(); else athleteImg.onload = () => r(); athleteImg.onerror = () => r(); }),
  ]);

  // A. Draw official template
  fCtx.drawImage(templateImg, 0, 0, 1656, 2483);

  // B. Draw athlete photo inside dark ring
  const cx = 835;
  const cy = 1107;
  const clipR = 340;

  fCtx.save();
  fCtx.beginPath();
  fCtx.arc(cx, cy, clipR, 0, Math.PI * 2, false);
  fCtx.clip();

  const imgW = athleteImg.width || 1;
  const imgH = athleteImg.height || 1;
  const aspect = imgW / imgH;
  const targetDiameter = clipR * 2;
  let drawW: number;
  let drawH: number;
  let drawX: number;
  let drawY: number;

  if (aspect > 1) {
    drawH = targetDiameter;
    drawW = targetDiameter * aspect;
    drawX = cx - drawW / 2;
    drawY = cy - clipR;
  } else {
    drawW = targetDiameter;
    drawH = targetDiameter / aspect;
    drawX = cx - clipR;
    drawY = cy - drawH / 2;
  }

  fCtx.drawImage(athleteImg, drawX, drawY, drawW, drawH);
  fCtx.restore();

  // C. Dark ring stroke boundary
  fCtx.save();
  fCtx.strokeStyle = '#00270F';
  fCtx.lineWidth = 44;
  fCtx.beginPath();
  fCtx.arc(cx, cy, clipR + 22, 0, Math.PI * 2, false);
  fCtx.stroke();
  fCtx.restore();

  // D. Clear dynamic text zone (1580..2090)
  fCtx.fillStyle = '#FFFFFF';
  fCtx.fillRect(150, 1580, 1356, 2090 - 1580);

  // E. Clear barcode bars inside template mint box
  fCtx.fillStyle = '#E4FFEE';
  fCtx.fillRect(555, 2118, 545, 120);

  // F. Draw Full Name
  fCtx.textAlign = 'center';
  fCtx.textBaseline = 'alphabetic';
  fCtx.fillStyle = '#00270F';
  let nameFontSize = 68;
  fCtx.font = `900 ${nameFontSize}px "Archivo Black", sans-serif`;
  const fullNameStr = (card.fullName || 'ATHLETE NAME').toUpperCase();
  let nameW = fCtx.measureText(fullNameStr).width;
  const maxNameW = 1120;
  if (nameW > maxNameW) {
    nameFontSize = Math.floor(nameFontSize * (maxNameW / nameW));
    fCtx.font = `900 ${nameFontSize}px "Archivo Black", sans-serif`;
  }
  fCtx.fillText(fullNameStr, 828, 1697);

  // G. Draw Moniker
  fCtx.fillStyle = '#004B1D';
  fCtx.font = '900 46px "Inter", sans-serif';
  const moniker = card.nickname?.trim()
    ? card.nickname.trim().toUpperCase()
    : (card.jerseyNumber ? `MARX #${card.jerseyNumber}` : 'MARX');
  fCtx.fillText(`{${moniker}}`, 828, 1786);

  // H. Draw 2-Column Credentials
  const drawField = (label: string, val: string, xPos: number, yPos: number, maxFieldW: number) => {
    fCtx.save();
    fCtx.textAlign = 'left';
    fCtx.fillStyle = '#00270F';
    fCtx.font = '900 30px "Inter", -apple-system, sans-serif';
    let fullTxt = `${label}: ${val.toUpperCase()}`;
    while (fCtx.measureText(fullTxt).width > maxFieldW && val.length > 4) {
      val = val.slice(0, -1);
      fullTxt = `${label}: ${val.toUpperCase()}...`;
    }
    fCtx.fillText(fullTxt, xPos, yPos);
    fCtx.restore();
  };

  drawField('FACULTY', card.faculty || 'GENERAL', 318, 1893, 540);
  drawField('DEPARTMENT', card.department || 'GENERAL', 318, 1961, 540);
  drawField('SPORT TYPE', card.sport || 'ATHLETICS', 893, 1893, 540);
  drawField('PHONE ', card.phone || '+2348105742618', 893, 1961, 540);

  // I. Card Number
  fCtx.textAlign = 'center';
  fCtx.fillStyle = '#01A643';
  fCtx.font = '900 54px "Inter", sans-serif';
  fCtx.fillText(card.cardNumber || 'GICS/2026/0001', 828, 2060);

  // J. Barcode
  try {
    const barcodeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    JsBarcode(barcodeSvg, card.cardNumber || 'GICS/2026/0001', {
      format: 'CODE128',
      lineColor: '#00270F',
      background: 'transparent',
      width: 3.8,
      height: 95,
      displayValue: false,
      margin: 0,
    });

    const xml = new XMLSerializer().serializeToString(barcodeSvg);
    const svg64 = btoa(unescape(encodeURIComponent(xml)));
    const barcodeImg = new Image();
    barcodeImg.src = 'data:image/svg+xml;base64,' + svg64;
    await new Promise<void>((resolve) => {
      if (barcodeImg.complete) return resolve();
      barcodeImg.onload = () => resolve();
      barcodeImg.onerror = () => resolve();
    });

    const bW = 500;
    const bH = 95;
    fCtx.drawImage(barcodeImg, 828 - bW / 2, 2125, bW, bH);
  } catch (e) {
    console.warn('Barcode error during PDF render:', e);
  }

  // 2. Create Back Canvas
  const backCanvas = document.createElement('canvas');
  backCanvas.width = 1656;
  backCanvas.height = 2483;
  const bCtx = backCanvas.getContext('2d');
  if (!bCtx) throw new Error('Could not get 2D canvas context for back');

  const backImg = new Image();
  backImg.crossOrigin = 'anonymous';
  backImg.src = '/official_id_back_template.png';
  await new Promise<void>((r) => { if (backImg.complete) r(); else backImg.onload = () => r(); backImg.onerror = () => r(); });

  bCtx.drawImage(backImg, 0, 0, 1656, 2483);

  // 3. Export both to JPEG data URLs
  const frontJpeg = frontCanvas.toDataURL('image/jpeg', 0.90);
  const backJpeg = backCanvas.toDataURL('image/jpeg', 0.90);

  // 4. Generate 2-Page PDF
  const { base64, blob } = createTwoPagePdfFromDataUrls(frontJpeg, backJpeg, 1656, 2483);

  return { pdfBase64: base64, pdfBlob: blob };
}

/**
 * Downloads the 2-page Front+Back PDF directly to the user's device.
 */
export async function downloadCardPdf(card: IdCardRecord, existingBlob?: Blob): Promise<void> {
  let blob = existingBlob;
  if (!blob) {
    const result = await generateCardPdf(card);
    blob = result.pdfBlob;
  }

  const cleanCardNo = (card.cardNumber || 'GICS').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanName = (card.fullName || 'ATHLETE').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
  const fileName = `Great_Ife_Sports_ID_${cleanCardNo}_${cleanName}.pdf`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
