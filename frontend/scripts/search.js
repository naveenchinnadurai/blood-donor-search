document.getElementById("search-btn").addEventListener("click", function () {
    const searchData = {
        district: document.getElementById("district").value,
        bloodGroup: document.getElementById("blood-group").value,
        donationType: document.getElementById("donation-type").value
    };

    console.log(searchData);
    async function fetchDonors(location, bloodGroup, donationType) {
        try {
            const response = await fetch(`http://localhost:7000/api/v1/donors/${location}/${bloodGroup}/${donationType}`);
            const data = await response.json();
            console.log(data);
            displayDonorCards(data.donors);
            return;
        } catch (error) {
            console.error('Error fetching donors:', error);
        }
    }
    fetchDonors(searchData.district, searchData.bloodGroup, searchData.donationType)

    function displayDonorCards(donors) {
        const donorCardsContainer = document.getElementById('donor-cards');
        donorCardsContainer.innerHTML = null;

        if(!donors || donors.length===0){
            donorCardsContainer.innerHTML=`
            <div class="w-full flex justify-center col-span-2 my-6">
                <p>No Donors Found...!</p>    
            </div>
            `
            return ;
        }

        donors.forEach(donor => {
            const donorCard = `
            <div class="bg-gray-400 bg-opacity-50 p-4 pt-3 rounded-lg shadow-lg">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-medium mb-2">${donor.name}</h3>
                    <p class="text-lg text-gray-800 font-medium">(Donation Type: ${donor.donationType})</p>
                </div>
                <p class="text-slate-800 text-md font-medium">Blood Group: <span class="font-semibold text-gray-800">${donor.bloodGroup}</span></p>
                <p class="text-slate-800 text-md font-medium">District: <span class="font-semibold text-gray-800">${donor.location}</span></p>
                <p class="text-slate-800 text-md font-medium">Mobile No.: <span class="font-semibold text-gray-800">${donor.mobileNumber}</span></p>
            </div> `;
            donorCardsContainer.innerHTML += donorCard;
        });
    }
});