document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector(".wrapper");
    const form = document.querySelector("form");
    const fileInp = form.querySelector("input");
    const infoText = form.querySelector("p");
    const closeBtn = document.querySelector(".close");
    const copyBtn = document.querySelector(".copy");
    const resultTextarea = document.querySelector("textarea");
    const qrImg = form.querySelector("img");

    // Handle file selection
    fileInp.addEventListener("change", async e => {
        const file = e.target.files[0];
        if (!file) return;

        infoText.innerText = "Scanning QR Code...";
        
        try {
            const imageUrl = URL.createObjectURL(file);
            const result = await scanQRCode(imageUrl);
            
            if (result) {
                resultTextarea.value = result;
                qrImg.src = imageUrl;
                wrapper.classList.add("active");
                infoText.innerText = "Upload QR Code to Scan";
            } else {
                infoText.innerText = "No QR code found";
                setTimeout(() => {
                    infoText.innerText = "Upload QR Code to Scan";
                }, 2000);
            }
        } catch (error) {
            console.error("Error scanning QR code:", error);
            infoText.innerText = "Error scanning QR code";
            setTimeout(() => {
                infoText.innerText = "Upload QR Code to Scan";
            }, 2000);
        }
    });

    // Scan QR code from image
    function scanQRCode(imageUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = imageUrl;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });
                
                resolve(code ? code.data : null);
            };
            
            img.onerror = () => {
                resolve(null);
            };
        });
    }

    // Copy text to clipboard
    copyBtn.addEventListener("click", () => {
        const text = resultTextarea.value;
        if (text) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    copyBtn.textContent = "Copied!";
                    setTimeout(() => {
                        copyBtn.textContent = "Copy Text";
                    }, 2000);
                })
                .catch(err => {
                    console.error("Failed to copy text: ", err);
                });
        }
    });

    // Close the results
    closeBtn.addEventListener("click", () => {
        wrapper.classList.remove("active");
        fileInp.value = ""; // Reset file input
    });

    // Click on form to trigger file input
    form.addEventListener("click", () => fileInp.click());
});