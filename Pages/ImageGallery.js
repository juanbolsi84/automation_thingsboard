import CommonActions from "../Utilities/CommonActions.js";

export default class ImageGallery {
    constructor(page) {
        this.page = page;
        this.actions = new CommonActions(page, 'Name');
    }

    get addImageBtn() { return 'role=button[name="Upload image"]' };;
    get fileInput() { return 'input[type="file"]' };
    get fileLocation() { return 'Data/TopCat.jpg' };
    get uploadButton() { return 'role=button[name="Upload"]' };

    async uploadImage(uniqueSuffix = null) {

        await this.actions.click(this.addImageBtn);
        // Adding a suffix to the file name so that it's unique and there are no data collisions when running in parallel
        let uploadName = this.fileLocation; // default
        if (uniqueSuffix) {
            // Create a new File object in memory with a modified name
            const fs = require('fs');
            const path = require('path');
            const filePath = path.resolve(this.fileLocation);
            const buffer = fs.readFileSync(filePath); // read the single existing file

            const ext = path.extname(filePath);
            const baseName = path.basename(filePath, ext);

            uploadName = {
                name: `${baseName}_${uniqueSuffix}${ext}`, // "TopCat_1234.jpg"
                mimeType: 'image/jpeg', // or detect dynamically if needed
                buffer, // file content
            };
        }

        await this.page.locator(this.fileInput).setInputFiles(uploadName);
        await this.actions.waitUntilEnabled(this.uploadButton);
        await this.actions.click(this.uploadButton);
    }

    get deleteBtn() {return 'button:has-text("delete")'};
    get confirmDelete() {return 'role=button[name="Yes"]'};


    async deleteImage(imageName){
       const rowLocator = await this.actions.findRowByCellValue(imageName);
       const deleteBtn = await rowLocator.locator(this.deleteBtn);
       await deleteBtn.click();
       await this.actions.click(this.confirmDelete);
       await this.actions.page.locator(this.confirmDelete).waitFor({state: 'hidden'});
       

    }

    

    //Download image


}