document.getElementById('donation-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const data = JSON.parse(localStorage.getItem('data'));
    console.log(data)

    const formData = {
        phone: document.getElementById('phone').value,
        bloodGroup: document.getElementById('blood-group').value,
        district: document.getElementById('district').value,
        donationType: document.getElementById('donation-type').value,
    };

    console.log(formData);

    async function createDonor() {
        try {
            const response = await fetch(`http://localhost:7000/api/v1/donors/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    mobileNumber: formData.phone,
                    location: formData.district,
                    bloodGroup: formData.bloodGroup,
                    donationType: formData.donationType
                })
            });
            const res = await response.json()
            console.log(res)

            if (response.ok && res.isSuccess) {
                Swal.fire({
                    icon: "success",
                    text: "Joined",
                    text: res.message,
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: "OK",
                    denyButtonText: `Home`,
                }).then((result) => {
                    window.location.href = '../index.html';
                });
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Oops...",
                    text: res.error
                });
            }

            return;
        } catch (error) {
            console.error('Error fetching donors:', error);
        }
    }
    createDonor()
});