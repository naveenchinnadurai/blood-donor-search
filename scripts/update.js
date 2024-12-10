const updateData = async () => {

    const currEmail = JSON.parse(localStorage.getItem('data')).email;

    const data = {};
    const fields = ['name', 'new-email', 'mobile', 'district', 'blood-group', 'donation-type', 'organ'];
    fields.forEach(field => {
        const input = document.getElementById(field);
        if (input && input.value.trim() !== '') {
            data[field.replace('-', '')] = input.value.trim();
        }
    });

    const organContainer = document.getElementById('organ-select-container');
    if (!organContainer.classList.contains('hidden')) {
        const selectedOrgans = Array.from(document.querySelectorAll('input[name="organs"]:checked'))
            .map(input => input.value);
        if (selectedOrgans.length > 0) {
            data.organs = selectedOrgans;
        }
    }

    const formData = {
        name: data.name,
        newEmail: data.newemail,
        mobileNumber: data.mobile,
        bloodGroup: data.bloodgroup,
        location: data.district,
        donationType: data.donationtype,
        organs: data.organs
    };

    if(formData.donationType === "Blood"){
        formData.organs=["null"]
    }
    console.log(formData);

    try {
        const response = await fetch(`https://finer-albacore-amazed.ngrok-free.app/api/v1/donors/${currEmail}`, {
            method: 'PUT',
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const result = await response.json();

        if (result.status) {
            Swal.fire({
                icon: "success",
                text: result.message
            }).then(() => {
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
        Swal.fire({
            icon: "error",
            title:"Error",
            text: "Error Updating donor's info, try again!"
        });
    }

}

function handleDonationTypeChange() {
    const donationType = document.getElementById('donation-type').value;
    const organContainer = document.getElementById('organ-select-container');
    organContainer.classList.toggle('hidden', donationType !== 'Organ' && donationType !== 'Both');
}