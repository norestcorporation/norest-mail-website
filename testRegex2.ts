const html = `
<br>
<br>
<hr style="border: none; border-top: 1px solid rgba(128, 128, 128, 0.2); margin: 24px 0;">
<div class="gmail_quote">
  On date wrote:
</div>
`;

const stripped = html.replace(/^(?:<br[^>]*>\s*|<hr[^>]*>\s*|\n|\r)*/i, '');
console.log("Stripped:");
console.log(stripped);
