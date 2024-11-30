const otpForm = document.getElementById('otpForm');
const emailInput = document.getElementById('email');
const sendOTPBtn = document.getElementById('send-otp');
const otpSection = document.getElementById('otp-section');
const otpInput = document.getElementById('otp');
const formSection = document.getElementById('edit-details-form');
let currEmail;

const sendOTP = async () => {
    sendOTPBtn.textContent = 'Sending...';
    const email = emailInput.value;

    try {
        const response = await fetch('http://localhost:7000/api/v1/otp/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, isNewDonor: false })
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
    const email = emailInput.value;

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
            otpForm.classList.add('hidden')
            formSection.classList.remove('hidden')
            currEmail = email;
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

const updateData = async () => {

    const formData = {
        name: document.getElementById('name').value,
        newEmail: document.getElementById('new-email').value,
        mobileNumber: document.getElementById('mobile').value,
        bloodGroup: document.getElementById('blood-group').value,
        location: document.getElementById('district').value,
        donationType: document.getElementById('donation-type').value,
    };
    console.log(formData)
    try {
        const response = await fetch(`http://localhost:7000/api/v1/donors/${currEmail}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log(result)
        if (result.isSuccess) {
            Swal.fire({
                icon: "success",
                text: result.message
            }).then((result) => {
                window.location.href = '../index.html';
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: result.error || 'Error Updating donors informations.'
            });
        }
    } catch (error) {
        console.error('Error updating data:', error);
    }

}