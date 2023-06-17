
          const viewB = document.getElementById("viewB");
          const tBody = document.querySelector("#flight-table tbody");

          viewB.addEventListener("click", () => {        

                document.getElementById("tablediv").style.display = "block";
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "/view-booking");
                
                xhr.setRequestHeader("Content-Type", "application/json");
                
                event.preventDefault();
                xhr.send();
    
                xhr.onload = function () {
                    const response = JSON.parse(xhr.responseText);
                     
                    tBody.innerHTML = "";
                    response.forEach((flight) => {
                        const row = tBody.insertRow();
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