import React, { useEffect, useRef, useState, useCallback } from 'react';
import JsBarcode from 'jsbarcode';
import { Download, Printer, RotateCw, ShieldCheck, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import { IdCardRecord } from '../types';
import frontTemplateUrl from '../assets/official_id_front_template.png';
import backTemplateUrl from '../assets/official_id_back_template.png';
import { downloadCardPdf } from '../utils/pdfGenerator';

interface IdCardProps {
  card: IdCardRecord;
  showExportButton?: boolean;
  compact?: boolean;
}

export const IdCard: React.FC<IdCardProps> = ({ card, showExportButton = true, compact = false }) => {
  const frontCanvasRef = useRef<HTMLCanvasElement>(null);
  const backCanvasRef = useRef<HTMLCanvasElement>(null);
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [isExporting, setIsExporting] = useState(false);
  const [isRendering, setIsRendering] = useState(true);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const displayNickname = (card.nickname?.trim() ? card.nickname.trim() : (card.jerseyNumber ? `MARX #${card.jerseyNumber}` : 'MARX')).toUpperCase();
  const displayPhone = card.phone || '+2348105742618';

  const renderFrontCard = useCallback(async () => {
    const canvas = frontCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRendering(true);

    try {
      if (document.fonts) {
        await document.fonts.ready;
      }
    } catch {
      // Continue if fonts check fails
    }

    // 1. Load official template
    const templateImg = new Image();
    templateImg.crossOrigin = 'anonymous';
    templateImg.src = frontTemplateUrl;
    await new Promise<void>((resolve) => {
      if (templateImg.complete) return resolve();
      templateImg.onload = () => resolve();
      templateImg.onerror = () => resolve();
    });

    // 2. Load athlete photograph
    const athleteImg = new Image();
    athleteImg.crossOrigin = 'anonymous';
    const photoSource = card.photoUrl || '/athlete_top_right.jpg';
    athleteImg.src = photoSource;

    await new Promise<void>((resolve) => {
      if (athleteImg.complete) return resolve();
      athleteImg.onload = () => resolve();
      athleteImg.onerror = () => {
        // Fallback to local default photo if remote fails or CORS issues arise
        athleteImg.crossOrigin = '';
        athleteImg.src = '/athlete_top_right.jpg';
        athleteImg.onload = () => resolve();
        athleteImg.onerror = () => resolve();
      };
    });

    // Set canvas dimensions to official high-resolution standard (1656 x 2483)
    canvas.width = 1656;
    canvas.height = 2483;

    // A. Draw full official template
    ctx.drawImage(templateImg, 0, 0, 1656, 2483);

    // B. Draw athlete photo inside the DARK RING of the circular frame
    // Full pixel-scan of placeholder content (sky/grass) in the 1656x2483 template:
    //   Dark ring left inner edge:  x=470  → right inner edge: x=1199
    //   Dark ring top inner edge:   y=743  → bottom inner edge: y=1471
    //   True ring center: cx=(470+1199)/2=835, cy=(743+1471)/2=1107
    //   Inner radius = min(835-470, 1199-835, 1107-743, 1471-1107) = 364
    //   Clip radius = 340 (leaves ~24px inside for dark ring border width)
    const cx = 835;
    const cy = 1107;
    const clipR = 340;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, clipR, 0, Math.PI * 2, false);
    ctx.clip();

    // Scale athlete photo to cover the clipped circle perfectly (object-fit: cover)
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

    ctx.drawImage(athleteImg, drawX, drawY, drawW, drawH);
    ctx.restore();

    // C. Paint the dark ring border over the photo edge for a seamless seal
    //    Stroke radius = clipR + 22 = 362, lineWidth = 44 → covers ring zone 340–384
    ctx.save();
    ctx.strokeStyle = '#00270F';
    ctx.lineWidth = 44;
    ctx.beginPath();
    ctx.arc(cx, cy, clipR + 22, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.restore();

    // D. Clear ONLY the white dynamic text zone (from below circle y=1580 down to y=2090, above mint box)
    //    Notice: The authentic mint box on the template starts at y=2109 and is NEVER overwritten!
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(150, 1580, 1356, 2090 - 1580);

    // E. Clear ONLY the inner barcode bars inside the template's authentic mint box
    //    Template mint box sits at x: 537..1122, y: 2109..2267
    ctx.fillStyle = '#E4FFEE';
    ctx.fillRect(555, 2118, 545, 120);

    // F. Draw Athlete Full Name (Archivo Black, dark forest green)
    //    Measured name line: top=1632, bottom=1702 → baseline ≈ 1697
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#00270F';

    let nameFontSize = 68;
    ctx.font = `900 ${nameFontSize}px "Archivo Black", sans-serif`;
    const fullNameStr = (card.fullName || 'ATHLETE NAME').toUpperCase();
    let nameW = ctx.measureText(fullNameStr).width;
    const maxNameW = 1120;
    if (nameW > maxNameW) {
      nameFontSize = Math.floor(nameFontSize * (maxNameW / nameW));
      ctx.font = `900 ${nameFontSize}px "Archivo Black", sans-serif`;
    }
    ctx.fillText(fullNameStr, 828, 1697);

    // G. Draw Moniker
    //    Measured moniker line: top=1740, bottom=1792 → baseline ≈ 1786
    ctx.fillStyle = '#004B1D';
    ctx.font = '900 46px "Inter", sans-serif';
    ctx.fillText(`{${displayNickname}}`, 828, 1786);

    // H. Draw 2-Column Athletic Credentials (cleanly positioned with ample breathing room)
    //    Credentials row 1: top=1869, bottom=1897 → baseline ≈ 1893
    //    Credentials row 2: top=1941, bottom=1965 → baseline ≈ 1961
    const drawField = (label: string, val: string, xPos: number, yPos: number, maxFieldW: number) => {
      ctx.save();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#00270F';
      ctx.font = '900 30px "Inter", -apple-system, sans-serif';
      let fullTxt = `${label}: ${val.toUpperCase()}`;
      while (ctx.measureText(fullTxt).width > maxFieldW && val.length > 4) {
        val = val.slice(0, -1);
        fullTxt = `${label}: ${val.toUpperCase()}...`;
      }
      ctx.fillText(fullTxt, xPos, yPos);
      ctx.restore();
    };

    // Col 1 (left-aligned, x≈318 based on template)
    drawField('FACULTY', card.faculty || 'GENERAL', 318, 1893, 540);
    drawField('DEPARTMENT', card.department || 'GENERAL', 318, 1961, 540);

    // Col 2 (right-half, x≈893 based on template midpoint)
    drawField('SPORT TYPE', card.sport || 'ATHLETICS', 893, 1893, 540);
    drawField('PHONE ', displayPhone, 893, 1961, 540);

    // I. Draw Card Number (Emerald Green) on the pure white area
    //    Baseline at y=2060, leaving 50px of clean white space before the mint box at y=2109
    ctx.textAlign = 'center';
    ctx.fillStyle = '#01A643';
    ctx.font = '900 54px "Inter", sans-serif';
    ctx.fillText(card.cardNumber || 'GICS/2026/0001', 828, 2060);

    // J. Generate Barcode SVG and render inside the authentic mint box
    //    Notice: The template already has 'BARCODE UNIQUE ID' printed at the bottom of the mint box!
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

      const bW = 500;   // barcode image width
      const bH = 95;    // barcode image height
      ctx.drawImage(barcodeImg, 828 - bW / 2, 2125, bW, bH);
    } catch (e) {
      console.warn('Barcode drawing error:', e);
    }

    setIsRendering(false);
  }, [card, displayNickname, displayPhone]);

  const renderBackCard = useCallback(async () => {
    const canvas = backCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const backImg = new Image();
    backImg.crossOrigin = 'anonymous';
    backImg.src = backTemplateUrl;
    await new Promise<void>((resolve) => {
      if (backImg.complete) return resolve();
      backImg.onload = () => resolve();
      backImg.onerror = () => resolve();
    });

    canvas.width = 1656;
    canvas.height = 2483;
    ctx.drawImage(backImg, 0, 0, 1656, 2483);
  }, []);

  // Re-render canvases when card details change
  useEffect(() => {
    renderFrontCard();
    renderBackCard();
  }, [renderFrontCard, renderBackCard]);

  // Handle high-resolution 300 DPI PNG download directly from canvas
  const handleDownload = (sideToDownload: 'front' | 'back') => {
    const canvas = sideToDownload === 'front' ? frontCanvasRef.current : backCanvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    setExportSuccess(null);

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const cleanCardNo = (card.cardNumber || 'GICS').replace(/[^a-zA-Z0-9_-]/g, '_');
      const cleanName = (card.fullName || 'ATHLETE').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
      const link = document.createElement('a');
      link.download = `GISU_OFFICIAL_ID_${sideToDownload.toUpperCase()}_${cleanCardNo}_${cleanName}.png`;
      link.href = dataUrl;
      link.click();

      setExportSuccess(`${sideToDownload === 'front' ? 'Front' : 'Back'} card pass downloaded in 300 DPI!`);
      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to export card image:', err);
      alert('Error downloading ID card pass image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full select-none">
      
      {/* VIEW TOGGLE SWITCH */}
      <div className="inline-flex items-center p-1 rounded-full bg-[#00270F] border border-emerald-900/40 shadow-md">
        <button
          type="button"
          onClick={() => setActiveSide('front')}
          className={`px-4 py-1.5 rounded-full text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSide === 'front'
              ? 'bg-[#81C200] text-[#00270F] shadow-sm'
              : 'text-white/80 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Front View</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSide('back')}
          className={`px-4 py-1.5 rounded-full text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSide === 'back'
              ? 'bg-[#81C200] text-[#00270F] shadow-sm'
              : 'text-white/80 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Back View</span>
        </button>
      </div>

      {/* =========================================================================
          OFFICIAL ID CARD CANVAS CONTAINER (100% EXACT AS TEMPLATE UPLOADED)
      ========================================================================= */}
      <div 
        className={`relative w-full max-w-[340px] sm:max-w-[400px] aspect-[1656/2483] mx-auto transition-transform ${compact ? 'scale-90 origin-top' : ''}`}
      >
        {/* Loading Spinner during initial canvas composition */}
        {isRendering && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs rounded-[24px]">
            <Loader2 className="w-8 h-8 text-[#004B1D] animate-spin mb-2" />
            <span className="text-xs font-heading font-bold text-[#00270F]">Aligning Official Template...</span>
          </div>
        )}

        {/* FRONT CANVAS (Exact Official Template + Clipped Photo + Dynamic Text + Barcode) */}
        <canvas
          ref={frontCanvasRef}
          width={1656}
          height={2483}
          className={`w-full h-full object-contain rounded-[24px] shadow-2xl transition-opacity duration-300 ${
            activeSide === 'front' ? 'opacity-100 block' : 'opacity-0 hidden'
          }`}
        />

        {/* BACK CANVAS (Exact Official Back Template) */}
        <canvas
          ref={backCanvasRef}
          width={1656}
          height={2483}
          className={`w-full h-full object-contain rounded-[24px] shadow-2xl transition-opacity duration-300 ${
            activeSide === 'back' ? 'opacity-100 block' : 'opacity-0 hidden'
          }`}
        />
      </div>

      {/* =========================================================================
          EXPORT CONTROLS (300 DPI COMMERCIAL PVC RESOLUTION)
      ========================================================================= */}
      {showExportButton && (
        <div className="flex flex-col items-center gap-3 w-full max-w-[400px]">
          
          {/* Main Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 w-full">
            <button
              type="button"
              onClick={() => handleDownload('front')}
              disabled={isExporting}
              className="py-3 px-4 rounded-xl bg-[#81C200] hover:bg-[#92D405] text-[#00270F] font-heading font-black text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download Front</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownload('back')}
              disabled={isExporting}
              className="py-3 px-4 rounded-xl bg-[#00270F] hover:bg-[#003816] text-[#81C200] border border-[#81C200]/40 font-heading font-black text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download Back</span>
            </button>
          </div>

          {/* Official Combined 2-Page PDF Download (Front & Back in Single PDF) */}
          <button
            type="button"
            onClick={async () => {
              try {
                setIsExporting(true);
                await downloadCardPdf(card);
                setExportSuccess('Official 2-Page PDF (Front & Back) downloaded successfully.');
                setTimeout(() => setExportSuccess(null), 4000);
              } catch (e) {
                console.warn('PDF download error:', e);
              } finally {
                setIsExporting(false);
              }
            }}
            disabled={isExporting}
            className="w-full py-3 px-4 rounded-xl bg-[#00270F] hover:bg-[#003816] text-white border-2 border-[#81C200]/70 font-heading font-black text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-4 h-4 text-[#81C200]" />
            <span>Download Official 2-Page PDF (Front &amp; Back)</span>
          </button>

          {/* Secondary Utility Controls */}
          <div className="grid grid-cols-2 gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setActiveSide(activeSide === 'front' ? 'back' : 'front')}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-[#00270F] border border-[#E2E8F0] font-heading font-extrabold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#004B1D]" />
              <span>Flip ({activeSide === 'front' ? 'View Back' : 'View Front'})</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-[#00270F] border border-[#E2E8F0] font-heading font-extrabold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#004B1D]" />
              <span>Print Badge</span>
            </button>
          </div>

          {/* Success Banner */}
          {exportSuccess && (
            <div className="w-full p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold flex items-center justify-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{exportSuccess}</span>
            </div>
          )}

          {/* Official Accreditation Notice */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] text-left w-full shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-xs font-heading font-black text-[#00270F]">
              <ShieldCheck className="w-4 h-4 text-[#01A643]" />
              <span>Official Great Ife Sports PVC Card Protocol</span>
            </div>
            <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
              Direct rendering of the official GISU Sports Accreditation template. Standard 300 DPI high-resolution output ready for laminated PVC printing.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
