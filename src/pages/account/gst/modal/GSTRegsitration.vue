<template>
  <!-- F&Q Modal -->
  <div
    class="modal fade"
    id="faqModal"
    tabindex="-1"
    aria-labelledby="faqModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-3">
        <div class="modal-header border-0">
          <h6 class="modal-title fw-bold fs16" id="faqModalLabel">
            GST Registration &amp; Partners Portal
          </h6>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body fs14 text-muted" style="max-height: 70vh; overflow-y: auto;">
          <p><strong>Q1. Where should I update my GST details?</strong><br />
          A: You must update your GST registration in the Partners portal. Ensure the GST trade name matches the registered Referral Partner name to avoid invoice rejections.</p>

          <p ><strong>Q2. What if the Referral Partner name and GST trade name are different?</strong><br />
          A: The GST registration must match the partner’s name. If the GST trade name and Referral Partner name differ, the invoice will be rejected.<br />
          SAC/HSN Codes &amp; Invoice Format</p>

          <p><strong>Q3. Is it mandatory to include SAC/HSN codes on the invoice?</strong><br />
          A: Yes, SAC (Services Accounting Code) or HSN (Harmonized System of Nomenclature) codes are mandatory. Invoices without these codes will not be accepted.</p>

          <p><strong>Q4. Where can I get SAC and HSN codes for my invoice?</strong><br />
          A: You can find SAC and HSN codes on the official GST portal:<br />
          ⚡ cbic-gst.gov.in<br />
          Alternatively, consult your accountant or GST consultant.</p>

          <p><strong>Q5. Can I use my own invoice format?</strong><br />
          A: Yes, you can use your own invoice format, but it must:<br />
          Clearly state &quot;Computer-Generated Invoice&quot;<br />
          Contain all correct and complete details.</p>

          <p><strong>Q6. What if I use the company’s invoice template?</strong><br />
          A: If using the company-provided invoice template, ensure the invoice includes the partner’s signature.</p>

          <p><strong>Q7. Can I reuse the same invoice number in different months?</strong><br />
          A: No. Each invoice number must be unique. Duplicate invoice numbers will lead to rejection.<br />
          Invoice Generation &amp; Upload</p>

          <p><strong>Q8. When should I generate and upload my invoice?</strong><br />
          A: Invoices must be generated in the same month for which the revenue is shared (e.g., January revenue → invoice date should be in January).<br />
          Invoices should be uploaded within the following month (e.g., January invoices must be uploaded during February).</p>

          <p><strong>Q9. What happens if a GST invoice is not filed on time?</strong><br />
          A: If a GST invoice is not filed on time:<br />
          The GST amount will be debited from your Referral Partner ledger.<br />
          You will be marked as a GST Filing Defaulter.</p>

          <p><strong>Q10. What if my invoice gets rejected?</strong><br />
          A: If your invoice is rejected, the reason will be mentioned in the remarks section of your Partners portal. You can revise and re-upload the invoice accordingly.<br />
          GST Filing Defaulter &amp; Credit Restoration</p>

          <p><strong>Q11. I am marked as a GST Defaulter. How can I restore my GST credit?</strong><br />
          A: GST credit will only be considered after you submit valid proof of GST filing. Without this proof, no GST credit will be provided or restored.</p>

          <p><strong>Q12. What is considered valid proof of GST filing?</strong><br />
          A: Valid proof includes:<br />
          GST portal screenshots or filing receipt showing your invoice has been reported.<br />
          Acknowledgement receipt or filing summary PDF downloaded from the portal<br />
          Ensure the screenshot clearly shows:<br />
          GSTIN<br />
          Return period (e.g., Jan 2025)<br />
          Date of filing<br />
          Invoice number and taxable value<br />
          Sample Screenshot Guide for Referral Partners:<br />
          Here’s what the screenshot should include:<br />
          1. Log in to the GST portal<br />
          2. Navigate to Returns Dashboard<br />
          3. Choose the respective month and year<br />
          4. Select View Filed Returns<br />
          5. Open GSTR-1 → B2B section<br />
          6. Take a screenshot showing:<br />
          o Your invoice listed<br />
          o Invoice number<br />
          o Filing date<br />
          o GSTIN<br />
          This will serve as valid proof for restoring your GST credit if marked as a defaulter.<br />
          Invoice Payment &amp; Payouts</p>

          <p><strong>Q13. What is the deadline to upload invoices for timely payment?</strong><br />
          A: Invoices for January revenue should be uploaded on or before February 12th to be eligible for payment in the second payout slot for February.</p>

          <p><strong>Q14. What happens if I upload the invoice after the 12th of the month?</strong><br />
          A: If the invoice is uploaded after the 12th of February for January revenue, the payment will be processed in the following month’s payout cycle (March).</p>

          <p><strong>Q15. Is there any exception for late invoice uploads?</strong><br />
          A: No. Invoices uploaded after the 12th of the month will be automatically moved to the next month’s payout cycle.<br />
          If the invoice is uploaded between the 13th and the end of the month, payout will be processed in the next month’s cycle.<br />
          After the last day of the following month, the invoice upload option will be disabled in the portal, and the invoice will not be accepted.</p>

          <p><strong>Q16. When exactly is the second payout slot scheduled?</strong><br />
          A: The second payout slot typically falls on or before 15th of every month. Specific dates may vary depending on internal processing schedules.</p>

          <p><strong>Q17. How can I ensure my payment is not delayed?</strong><br />
          A: To avoid delays:<br />
          Upload your invoice on or before the 12th of the following month (e.g., January’s invoice should be uploaded by February 12th).<br />
          Ensure the invoice is in the correct format and matches the provided calculation.<br />
          Verify that all mandatory fields (GSTIN, SAC/HSN code, date, unique invoice number, signature etc.) are correctly filled.</p>

          <p><strong>Q18. Will I receive confirmation after uploading my invoice?</strong><br />
          A: Yes. Once the invoice is uploaded, its status will be updated in the Partners portal:<br />
          Initially as "Pending"<br />
          Then updated to "Approved" or "Rejected" after verification<br />
          In case of rejection, the reason will be mentioned in the remarks section</p>

          <p><strong>Q19. Who should I contact if my payment has not been released?</strong><br />
          A: If your invoice was uploaded on time but the payment has not been released, you can reach out to <strong>pec@aliceblueindia.com</strong>.</p>
        </div>
      </div>
    </div>
  </div>
</template>
