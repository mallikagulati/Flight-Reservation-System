
const viewB = document.getElementById("viewBu");
          const taBody = document.querySelector("#flighttable tbody");
          

          viewB.addEventListener("click", () => {
            document.getElementById("tablediv").style.display = "block";
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "/user-view-bookings");
                
                xhr.setRequestHeader("Content-Type", "application/json");
                
                event.preventDefault();
                xhr.send();
    
                xhr.onload = function () {
                    const response = JSON.parse(xhr.responseText);
                     
                    taBody.innerHTML = "";
                    response.forEach((flight) => {
                        const row = taBody.insertRow();
                        row.insertCell().textContent = flight.booking_id;
                        row.insertCell().textContent = flight.username;
                        row.insertCell().textContent = flight.flight_no;
                        var strDate = flight.flight_date;
                    row.insertCell().textContent = strDate.substring(0, 10);
                        row.insertCell().textContent = flight.start_dest;
                        row.insertCell().textContent = flight.end_dest;
                        row.insertCell().textContent = flight.flight_time;
                    });
                };
    
               
            });