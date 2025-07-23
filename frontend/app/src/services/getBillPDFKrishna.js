import axios from "axios";
import { PDFDocument, rgb } from "pdf-lib";
import { useEffect } from "react";

export default async function getBillPDFKrishna(data, totalAmount, output) {
  const existingPdfBytes = await fetch(`/${data.firmName}.pdf`).then((res) =>
    res.arrayBuffer()
  );
  const BASE_URL = import.meta.env.VITE_API_URL;

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const form = pdfDoc.getForm();
  const firstPage = pages[0];

  let yPos = 480;
  const lineGap = 25;
  const fontSize = 10;

  const fetchBill = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/bill/`, {
        withCredentials: true,
      });
      return (
        res.data.filter((item) => item.firmName === "Krishna Enterprises")
          .length + 1
      );
    } catch (err) {
      console.log("Error in fetching Bills");
      return undefined;
    }
  };

  const invoiceNo = await fetchBill();
  const invoiceNoField = form.getTextField("Invoice No");
  invoiceNoField.setText(JSON.stringify(invoiceNo));
  const dateField = form.getTextField("Date");
  const today = new Date();
  dateField.setText(today.toISOString().split("T")[0]);

  const totalField = form.getTextField("Total");
  totalField.setText(JSON.stringify(totalAmount) + "/-");

  // firstPage.drawText(`${data.customerName}`, {
  //   x: 50,
  //   y: yPos + 40,
  //   size: 15,
  //   color: rgb(0, 0, 0),
  // });

  // firstPage.drawText(`Products:`, {
  //   x: 50,
  //   y: yPos,
  //   size: 15,
  //   color: rgb(0, 0, 0),
  // });

  // Header Row
  // firstPage.drawText(`Product`, { x: 50, y: yPos - lineGap, size: fontSize, color: rgb(0, 0, 0) });
  // firstPage.drawText(`Qty`, { x: 200, y: yPos - lineGap, size: fontSize, color: rgb(0, 0, 0) });
  // firstPage.drawText(`Price`, { x: 250, y: yPos - lineGap, size: fontSize, color: rgb(0, 0, 0) });
  // firstPage.drawText(`Amount`, { x: 330, y: yPos - lineGap, size: fontSize, color: rgb(0, 0, 0) });

  // yPos -= lineGap * 2;

  // const srNumField = form.getTextField("SrNo")
  // const descriptionField = form.getTextField("Description");
  // const quantityField = form.getTextField("Quantity");
  // const rateField = form.getTextField("Rate");
  // const amountField = form.getTextField("Amount");

  const xOffsets = {
    sr: 60,
    description: 85,
    quantity: 375,
    rate: 435,
    amount: 485,
  };

  data.itemsAdded.forEach((item, idx) => {
    firstPage.drawText(JSON.stringify(idx + 1) + ".", {
      x: xOffsets.sr,
      y: yPos,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(item.productName, {
      x: xOffsets.description,
      y: yPos,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(item.quantity.toString(), {
      x: xOffsets.quantity,
      y: yPos,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(item.price.toString(), {
      x: xOffsets.rate,
      y: yPos,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(item.total.toString(), {
      x: xOffsets.amount,
      y: yPos,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    yPos -= 20; // move to next row
  });

  yPos -= lineGap;

  const fields = form.getFields();
  fields.forEach((field) => {
    field.enableReadOnly(); //make the field non-editable
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.target = "_blank";
  if (output === "generate") link.download = `Bill_${invoiceNo}.pdf`;

  link.click(); //if output is not generate then it will just preview bill

  return true;
}
