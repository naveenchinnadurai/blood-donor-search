const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const otpInput = document.getElementById('otp');
const sendOTPBtn = document.getElementById('send-otp-btn');
const verifyBtn = document.getElementById('verify-otp-btn');
const otpSection = document.getElementById('otp-section');
const otpForm = document.getElementById('otp-form');
const inputForm = document.getElementById('input-form');

const sendOTP = async (isNewDonor) => {

    if (isNewDonor) {
        const emailValue = emailInput.value.trim();
        const nameValue = nameInput.value.trim();

        if (!emailValue || !nameValue) {
            Swal.fire({
                icon: "error",
                title: "Required",
                text: "Email and Name cannot be empty!!"
            });
            return;
        }
    } else {
        const emailValue = emailInput.value.trim();
        if (!emailValue) {
            Swal.fire({
                icon: "error",
                title: "Required",
                text: "Email cannot be empty!!"
            });
            return;
        }
    }
    sendOTPBtn.textContent = 'Sending...';
    const email = emailInput.value;
    try {
        const response = await fetch('https://finer-albacore-amazed.ngrok-free.app/api/v1/otp/send', {
            method: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, isNewDonor: isNewDonor })
        });

        if (response.ok) {
            const res = await response.json();
            console.log(res)

            if (res.status) {
                Swal.fire({
                    icon: "success",
                    text: res.message
                });
                otpSection.classList.remove('hidden');
            } else {
                Swal.fire(res.error);
            }
        } else {
            Swal.fire('Error sending OTP');
        }
    } catch (error) {
        if (error.name === "TypeError" && error.message === "Failed to fetch") {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Server Cannot be reached or No internet Connection"
            })
        } else {
            console.error('Error sending OTP:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error sending OTP, try again!"
            });
        }
        return;
    } finally {
        sendOTPBtn.textContent = 'Resend OTP';
    }
};

const verifyOTP = async (isNewDonor) => {

    verifyBtn.textContent = "verifing OTP"
    const otp = otpInput.value;

    if (!otp.trim()) {
        Swal.fire({
            icon: "error",
            title: "Required",
            text: "OTP cannot be empty"
        });
        return;
    }

    const email = emailInput.value;

    let data;

    if (isNewDonor) {
        const name = nameInput.value;
        data = { name, email };
    } else {
        data = { email }
    }

    try {
        const response = await fetch('https://finer-albacore-amazed.ngrok-free.app/api/v1/otp/verify', {
            method: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, otp })
        });

        const result = await response.json();

        if (result.status) {
            Swal.fire({
                icon: "success",
                text: result.message
            }).then(() => {
                otpForm.classList.add('hidden');
                inputForm.classList.remove('hidden');
                localStorage.setItem('data', JSON.stringify(data));
            });

        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: result.error || 'Invalid OTP'
            });
        }
    } catch (error) {
        if (error.name === "TypeError" && error.message === "Failed to fetch") {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No internet connection. Please check your network."
            })
        } else {
            console.error("An error occurred:", error.message);
            console.error('Error verifying OTP:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error Verifying OTP, try again!"
            })
        }
    }
};