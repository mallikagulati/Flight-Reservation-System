        
        const viewBtn = document.getElementById("view-btn");
        const tableBody = document.querySelector("#booking-table tbody");
        console.log(tableBody);

        viewBtn.addEventListener("click", () => {
            document.getElementById("tablediv").style.display = "block";
        const sd = document.getElementById("startDest").value;
        const ed = document.getElementById("endDest").value;
        const date = document.getElementById("date").value;

            
            
            

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/book-ticket");
            xhr.setRequestHeader("Content-Type", "application/json");
            const data = {
                std: sd,
                etd: ed,
                dat: date,
            };

      

            xhr.send(JSON.stringify(data));
        

      
            event.preventDefault();
            

            xhr.onload = function () {
                const response = JSON.parse(xhr.responseText);
                
                tableBody.innerHTML = "";
                response.forEach((flight) => {
                    
                    const row = tableBody.insertRow();
                    row.insertCell().textContent = flight.flight_no;
                    row.insertCell().textContent = flight.start_dest;
                    row.insertCell().textContent = flight.end_dest;
                    var strDate = flight.flight_date;
                    row.insertCell().textContent = strDate.substring(0, 10);
                    row.insertCell().textContent = flight.flight_time;
                    row.insertCell().textContent = flight.availability;
                    const bookButtonCell = row.insertCell();
                    const bookButton = document.createElement('button');
                    bookButton.textContent = 'Book';
                    bookButtonCell.appendChild(bookButton);

                    bookButton.addEventListener('click', handleBookButtonClick);
                });
            };

            
        });


        function handleBookButtonClick(event) {
            
            const clickedRow = event.target.closest('tr');
            const flightNo = clickedRow.cells[0].textContent;
            const startDest = clickedRow.cells[1].textContent;
            const endDest = clickedRow.cells[2].textContent;
            const flightDate = clickedRow.cells[3].textContent;
            const flightTime = clickedRow.cells[4].textContent;
            const availability = clickedRow.cells[5].textContent;

            if(availability < 1)
            alert("No seats available");
          else{
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/add-booking");
            xhr.setRequestHeader("Content-Type", "application/json");
            const data = {
                fno:flightNo,
                std:startDest,
                end:endDest,
                date:flightDate,
                time:flightTime,
                avail:availability
            };
            xhr.send(JSON.stringify(data));
            alert("Flight Booked!");
          }
            

          }



          
    