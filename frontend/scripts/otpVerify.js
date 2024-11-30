const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const otpInput = document.getElementById('otp');
const sendOTPBtn = document.getElementById('sendOTPBtn');
const verifyBtn = document.getElementById('verifyBtn');
const otpSection = document.getElementById('otpSection');

const toggleSendOTPButton = () => {
    sendOTPBtn.disabled = !(nameInput.value.trim() && emailInput.value.trim());
};

const toggleVerifyButton = () => {
    verifyBtn.disabled = !otpInput.value.trim();
};

nameInput.addEventListener('input', toggleSendOTPButton);
emailInput.addEventListener('input', toggleSendOTPButton);
otpInput.addEventListener('input', toggleVerifyButton);

const sendOTP = async () => {
    sendOTPBtn.textContent = 'Sending...';
    const email = emailInput.value;

    try {
        const response = await fetch('http://localhost:7000/api/v1/otp/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            const res = await response.json();
            console.log(res)

            if (res.isSuccess) {
                Swal.fire({
                    icon: "success",
                    text: res.message
                });
                otpSection.classList.remove('hidden');
                sendOTPBtn.textContent = 'Resend OTP';
                toggleVerifyButton();
            } else {
                Swal.fire(res.error);
            }
        } else {
            Swal.fire('Error sending OTP');
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
    } finally {
        sendOTPBtn.textContent = 'Resend OTP';
    }
};

const verifyOTP = async () => {
    const otp = otpInput.value;
    const name = nameInput.value;
    const email = emailInput.value;

    const data = { name, email };

    try {
        const response = await fetch('http://localhost:7000/api/v1/otp/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, otp })
        });

        const result = await response.json();

        if (result.isSuccess) {
            localStorage.setItem('data', JSON.stringify(data));
            window.location.href = '../pages/register.html';
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: result.error || 'Invalid OTP'
            });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
    }
};