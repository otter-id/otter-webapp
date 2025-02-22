import jsPDF from "jspdf";
import { format } from "date-fns";
import { ReceiptData } from "@/types/receipt";
import QRCode from "qrcode";

export async function generateReceiptPDF(
  data: ReceiptData["data"],
  orderId: string
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  //   const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let currentPage = 1;

  // Helper function to check if we need a new page
  const checkNewPage = (heightNeeded: number) => {
    if (yPos + heightNeeded > pageHeight - margin * 2) {
      doc.addPage();
      currentPage++;
      yPos = margin;
      return true;
    }
    return false;
  };

  // Helper function for right-aligned text
  const addRightAlignedText = (text: string, y: number, xOffset = 0) => {
    const textWidth =
      (doc.getStringUnitWidth(text) * doc.getFontSize()) /
      doc.internal.scaleFactor;
    doc.text(text, pageWidth - margin - textWidth - xOffset, y);
  };

  // Helper function for centered text
  const addCenteredText = (text: string, y: number) => {
    const textWidth =
      (doc.getStringUnitWidth(text) * doc.getFontSize()) /
      doc.internal.scaleFactor;
    doc.text(text, (pageWidth - textWidth) / 2, y);
  };

  // Add horizontal line
  const addHorizontalLine = (y: number) => {
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
  };

  //   // Helper function to add page number
  //   const addPageNumber = () => {
  //     const footerY = pageHeight - margin;
  //     doc.setFontSize(9);
  //     addRightAlignedText(`Page ${currentPage}/${totalPages}`, footerY);
  //   };

  // Generate QR Code
  const qrUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/receipt?id=${orderId}`;
  const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
    margin: 1,
    width: 100,
  });

  // Calculate total pages
  let tempYPos = margin;
  let tempPage = 1;
  const itemHeight = 7; // Base height for each item
  const modifierHeight = 5; // Height for each modifier

  // Header space
  tempYPos += 55; // Space for restaurant name, address, and order info

  // Items space calculation
  data.items.forEach((item) => {
    if (tempYPos + itemHeight > pageHeight - margin * 2) {
      tempPage++;
      tempYPos = margin;
    }
    tempYPos += itemHeight;

    item.modifiers.forEach(() => {
      if (tempYPos + modifierHeight > pageHeight - margin * 2) {
        tempPage++;
        tempYPos = margin;
      }
      tempYPos += modifierHeight;
    });
    tempYPos += 3; // Space after each item
  });

  // Space for totals and QR code
  if (tempYPos + 100 > pageHeight - margin * 2) {
    // 100 is approximate space needed for totals and QR
    tempPage++;
  }

  const totalPages = tempPage;

  // Header
  doc.setFontSize(20);
  addCenteredText(data.restaurantName, yPos + 10);
  yPos += 10;

  doc.setFontSize(10);
  addCenteredText(data.restaurantAddress, yPos + 5);
  yPos += 10;

  // Add QR Code in top right
  const qrSize = 20;
  const qrX = pageWidth - margin - qrSize;
  doc.addImage(qrCodeDataUrl, "PNG", qrX, yPos + 5, qrSize, qrSize);

  //   // Add QR Code caption
  //   doc.setFontSize(8);
  //   doc.setFont("helvetica", "normal");
  //   const qrText = "Scan to view digital receipt";
  //   addRightAlignedText(qrText, yPos + qrSize + 8, qrSize + 5);

  // Order Info (with adjusted width to accommodate QR code)
  doc.setFontSize(12);
  doc.text(`Order #${data.orderNumber}`, margin, yPos + 10);
  doc.text(`Customer: ${data.firstName}`, margin, yPos + 15);
  doc.text(
    `Order Date: ${format(new Date(data.orderDateTime), "PPpp")}`,
    margin,
    yPos + 20
  );
  yPos += 30;

  addHorizontalLine(yPos);
  yPos += 10;

  // Items Header
  doc.setFont("helvetica", "bold");
  doc.text("Item", margin, yPos);
  doc.text("Qty", margin + 100, yPos);
  addRightAlignedText("Price", yPos);
  doc.setFont("helvetica", "normal");
  yPos += 5;

  addHorizontalLine(yPos);
  yPos += 10;

  // Items
  data.items.forEach((item) => {
    // Check if we need a new page for the item
    if (checkNewPage(itemHeight + item.modifiers.length * modifierHeight + 3)) {
      // Repeat header on new page
      doc.setFont("helvetica", "bold");
      doc.text("Item", margin, yPos);
      doc.text("Qty", margin + 100, yPos);
      addRightAlignedText("Price", yPos);
      doc.setFont("helvetica", "normal");
      yPos += 5;
      addHorizontalLine(yPos);
      yPos += 10;
    }

    doc.setFont("helvetica", "bold");
    doc.text(item.name, margin, yPos);
    doc.text(item.quantity.toString(), margin + 100, yPos);
    addRightAlignedText(`Rp ${item.price.toLocaleString()}`, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 7;

    // Modifiers
    item.modifiers.forEach((mod) => {
      if (checkNewPage(modifierHeight)) {
        // No need to repeat headers for modifiers
      }
      const modText = `• ${mod.name}`;
      doc.setFontSize(10);
      doc.text(modText, margin + 5, yPos);
      if (mod.price > 0) {
        addRightAlignedText(`Rp ${mod.price.toLocaleString()}`, yPos);
      }
      doc.setFontSize(12);
      yPos += 5;
    });
    yPos += 3;
  });

  yPos += 5;
  addHorizontalLine(yPos);
  yPos += 15;

  // Check if we need a new page for totals and QR code
  if (checkNewPage(80)) {
    // Approximate height needed for totals and QR
    yPos += 10;
  }

  // Totals
  const totalsX = pageWidth - margin - 80;
  doc.text("Subtotal:", totalsX, yPos);
  addRightAlignedText(`Rp ${data.subtotal.toLocaleString()}`, yPos);
  yPos += 7;

  doc.text("Taxes & Fees:", totalsX, yPos);
  addRightAlignedText(`Rp ${data.taxesAndFees.toLocaleString()}`, yPos);
  yPos += 7;

  addHorizontalLine(yPos);
  yPos += 7;

  doc.setFont("helvetica", "bold");
  doc.text("Total:", totalsX, yPos);
  addRightAlignedText(`Rp ${data.total.toLocaleString()}`, yPos);
  doc.setFont("helvetica", "normal");

  // Add page numbers to all pages
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const footerY = pageHeight - margin;
    doc.setFontSize(9);
    doc.text(
      `Generated on: ${format(new Date(), "PPpp")}`,
      margin,
      footerY - 10
    );
    doc.setFontSize(8);
    doc.text("Powered by Otter", margin, footerY - 5);
    doc.text("www.otter.id", margin, footerY);
    addRightAlignedText(`Page ${i}/${totalPages}`, footerY);
  }

  // Save the PDF
  doc.save(`${orderId}-receipt-${data.restaurantName}.pdf`);
}
