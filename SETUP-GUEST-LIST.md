# Haritha & Alen: setting up the invite

## 1. Put the invite online (GitHub Pages)

1. Create a new **public** repository on GitHub, for example `haritha-alen`.
2. Upload **`index.html`** and **`preview.jpg`**. `index.html` holds all three invitations; `preview.jpg` is the picture shown when the link is shared on WhatsApp. (`guest-list-sheet.gs` and this guide can go in too; they don't affect the invite.)
3. Go to **Settings › Pages**, choose the `main` branch, and save.
4. After a minute the invite is live at `https://YOUR-USERNAME.github.io/haritha-alen/`.
5. **Turn on the link preview:** open `index.html` on GitHub, click the pencil icon, search (Ctrl+F) for `YOUR-USERNAME` and replace it everywhere with your GitHub username (and `haritha-alen` with your repository name if it's different). Commit the change. Then send the link to yourself on WhatsApp to check the preview; if an old preview without a picture shows up, add `?v=2` to the end of the link.

Opening that link shows a first screen with three choices: **Haritha's family** (bride's side), **Alen's family** (groom's side), or **Both families together** (which then asks Team Haritha or Team Alen).

To send a link that skips the first screen, add one of these to the end:
   - `?invite=bride` opens Haritha's family's invitation
   - `?invite=groom` opens Alen's family's invitation
   - `?invite=together` opens the joint invitation and asks Team Haritha or Team Alen
   - `?team=haritha` or `?team=alen` opens the joint invitation with the team already picked

Guests can always switch from the hearts menu at the top (**Open a different invitation**).

## 2. Where RSVPs go

Every RSVP, from both families and all versions, opens WhatsApp addressed to **90393 11154** with the guest's answers already typed. The guest just taps send.

Performance sign-ups (dance, song, fun game) go to the family on each side: **98932 77910** for the bride's side and **75102 48598** for the groom's side.

## 3. Turn on the Google Sheet guest lists (about 5 minutes, one time)

With this switched on, every RSVP and performance sign-up is **also saved automatically**, even if the guest forgets to press send in WhatsApp. It goes into two sheets:

- **Engagement:** https://docs.google.com/spreadsheets/d/1Rp2A9WMjJJA_rP4f6B7WEuoib_D-goDVsEB5HgDN75A/edit
- **Wedding:** https://docs.google.com/spreadsheets/d/1EHgcVLnmE22-EwDFFdFvVIrcaxRSdGLk-HWDR7jLtws/edit

Both links are already written into `guest-list-sheet.gs`. Do the steps below with a Google account that can **edit both sheets** (the account that owns them is easiest).

1. Open the **engagement** sheet and click **Extensions › Apps Script**.
2. Delete anything in the editor, paste the whole of `guest-list-sheet.gs`, and click the **save** icon.
3. In the toolbar, choose **setUpBothSheets** from the function list and click **Run**. Click **Review permissions**, pick your account and allow it. (Google may say the app isn't verified because you wrote it yourself. Click **Advanced › Go to project** to continue.) This adds the Summary, RSVPs and Performances tabs to both sheets.
4. Click **Deploy › New deployment**. Click the gear next to "Select type" and choose **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`). This is not the sheet link; it's the link the invite sends answers to.
6. On GitHub, open **`index.html`**, click the pencil icon, and search (Ctrl+F) for `sheetUrl`. Paste the link between the quotes:

   ```
   sheetUrl: "https://script.google.com/macros/s/AKfy.../exec"
   ```

   Commit the change. That switches the sheets on for all three invitations.
7. To test, open your invite, send a test RSVP, and check both sheets. Delete the test rows afterwards.

If you change the script later, use **Deploy › Manage deployments › Edit › Version: New version** so the same `/exec` link keeps working.

### What goes where

- A guest's **engagement** answer goes to the engagement sheet and their **wedding** answer goes to the wedding sheet, each with their name, side (Team Haritha or Team Alen), number of people, phone and note.
- Performance sign-ups go to the sheet for the celebration they picked; **Both** goes to both sheets.
- If the same guest answers again, their row is updated in each sheet instead of counted twice.

### What you get in each sheet

- **Summary**: live counts for that celebration: how many said yes, the total number of people coming, can't make it, not sure yet, total replies, and the number of performance entries.
- **RSVPs**: one row per guest.
- **Performances**: everyone who signed up to dance, sing or run a fun game for that celebration.

### Getting the sheets to 90393 11154

Google Sheets is shared by link or email, not by phone number. In each sheet, click **Share › General access › Anyone with the link › Viewer** (or Editor), click **Copy link**, and send both links on WhatsApp to 90393 11154.

## 4. Other things you can change (top of the script in index.html)

- `engagementStart` / `engagementTimeLabel`: engagement date and time (now 20 January 2027, 11.30 am)
- `rsvpWhatsApp`: the number RSVPs go to (now `9039311154`)
- `performTo`: the number performance entries go to on each side
- `payPhones`: PhonePe numbers shown in the gift box
- `churchMap`, `receptionMap`, `engagementMap`: exact Google Maps links
- `music`: a song file placed next to `index.html`
