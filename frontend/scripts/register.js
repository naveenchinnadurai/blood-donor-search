document.getElementById('input-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const data = JSON.parse(localStorage.getItem('data'));
    console.log(data)

    const formData = {
        name: data.name,
        email: data.email,
        mobileNumber: document.getElementById('phone').value,
        bloodGroup: document.getElementById('blood-group').value,
        location: document.getElementById('district').value,
        donationType: document.getElementById('donation-type').value,
        organs: getOrgans()
    };

    console.log(formData)
    createDonor(formData);
});


async function createDonor(data) {
    try {
        const response = await fetch(`https://finer-albacore-amazed.ngrok-free.app/api/v1/donors/`, {
            method: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const res = await response.json()
        console.log(res)

        if (response.ok && res.status) {
            Swal.fire({
                icon: "success",
                text: "Joined",
                text: res.message,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "OK",
                denyButtonText: `Home`,
            }).then(() => {
                localStorage.clear();
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


function handleDonationTypeChange() {
    const donationType = document.getElementById("donation-type").value;
    const organSelectContainer = document.getElementById("organ-select-container");

    if (donationType === "Organ" || donationType === "Both") {
        organSelectContainer.style.display = "block";
    } else {
        organSelectContainer.style.display = "none";
    }
}

function getOrgans() {
    // Get all checkboxes
    const checkboxes = document.querySelectorAll('input[name="organs"]:checked');

    // Extract values of checked checkboxes
    const selectedOptions = Array.from(checkboxes).map(checkbox => checkbox.value);

    // Print the selected options to the console
    console.log('Selected Options:', selectedOptions);

    // If nothing is selected
    if (selectedOptions.length === 0) {
        console.log('No options selected.');
        return ['null'];
    }

    return selectedOptions;
}