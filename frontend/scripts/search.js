function openDialPad(phoneNumber) {
    if (!phoneNumber || isNaN(phoneNumber)) {
        alert("Please provide a valid phone number.");
        return;
    }

    window.location.href = `tel:${phoneNumber}`;
}

document.getElementById("search-btn").addEventListener("click", function () {
    const searchData = {
        district: document.getElementById("district").value,
        bloodGroup: document.getElementById("blood-group").value,
        donationType: document.getElementById("donation-type").value
    };

    console.log(searchData);
    async function fetchDonors(location, bloodGroup, donationType) {
        try {
            const response = await fetch(`http://localhost:7000/api/v1/donors/${location}/${bloodGroup}/${donationType}`, {
                method: 'GET',
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Content-Type': 'application/json'
                }
            });
            console.log(response)
            const data = await response.json();
            console.log(data);
            displayDonorCards(data.donors);
            return;
        } catch (error) {
            console.log('Error fetching donors:', error);
            Swal.fire({
                icon: "error",
                title:"Error",
                text: "Error Fetching data, try again!"
            });
        }
    }
    fetchDonors(searchData.district, searchData.bloodGroup, searchData.donationType)

    function displayDonorCards(donors) {
        const donorCardsContainer = document.getElementById('donor-cards');
        donorCardsContainer.innerHTML = null;

        if (!donors || donors.length === 0) {
            donorCardsContainer.innerHTML = `
            <div class="w-full flex justify-center col-span-3 my-6">
                <p class="text-xl">No Donors Found...!</p>    
            </div>
            `
            return;
        }

        donors.forEach(donor => {
            const donorCard = `
                <div class="relative bg-gray-400 bg-opacity-50 p-4 pt-3 rounded-lg shadow-lg">
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <h3 class="text-lg font-medium mb-1">${donor.name}</h3>
                        <a href="tel:${donor.mobileNumber}" class="absolute right-3 top-2 bg-gradient-to-r from-[#19495D] via-[#A0C3C5] to-[#6B0715]  p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-call"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.05 2a9 9 0 0 1 8 7.94"/><path d="M14.05 6A5 5 0 0 1 18 10"/></svg>
                        </a>
                    </div>
                    <p class="text-slate-800 text-md font-medium ">Donation Type: 
                        <span class="font-semibold text-gray-800">${donor.donationType}</span>
                    </p>
                    <p class="text-slate-800 text-md font-medium">Blood Group: 
                        <span class="font-semibold text-gray-800">${donor.bloodGroup}</span>
                    </p>
                    <p class="text-slate-800 text-md font-medium">District: 
                        <span class="font-semibold text-gray-800">${donor.location}</span>
                    </p>
                    <div class="flex gap-2">
                        <p class="text-slate-800 text-md font-medium">Organs:</p>
                        ${donor.donationType !== "Blood" ? (
                    ` <ul class="text-slate-800 text-md font-medium flex gap-2 ">
                                        ${donor.organs.map(organ => `<li class="font-semibold text-gray-800">${organ}</li>`).join(',')
                    }  
                                    </ul> `
                ) : `<p class="font-semibold text-gray-800">Not interseted</p>`
                }
                    </div>
                </div>`

            donorCardsContainer.innerHTML += donorCard;
        });
    }
});