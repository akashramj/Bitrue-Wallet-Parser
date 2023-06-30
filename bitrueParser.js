const fs = require("fs");
const csv = require("csv-parser");

const sourceFilePath = "./bitrueSource.csv";
const destinationFilePath = "./bitrueResult.csv";

// Function to format date as "YYYY-MM-DD"
function formatDate(date) {
  const [month, day, year] = date.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

// Function to format time as "HH:MM:SS"
function formatTime(time) {
  return `${time}:00`;
}

// Write header to the output CSV file
const header =
  "Date,Time,Type of Transaction,Description,Asset Sent(SYMBOL),Quantity of Asset Sent,Asset Received(SYMBOL),Quantity of Asset Received,Fee Paid In(SYMBOL),Quantity of Fee Paid,Tds Paid In(SYMBOL),Quantity of Tds Paid,Transaction Hash\n";
fs.writeFileSync(destinationFilePath, header);

// Read and process the CSV file
fs.createReadStream(sourceFilePath)
  .pipe(csv())
  .on("data", (row) => {
    const { "Date(UTC)": dateTime, Operation, Coin, Change } = row;
    const [date, time] = dateTime.split(" ");
    const formattedDate = formatDate(date);
    const formattedTime = formatTime(time);
    const transactionType = "INTEREST";

    // Append the data to the output CSV file
    const outputData = `${formattedDate},${formattedTime},${transactionType},${Operation},,,"${Coin}","${Change}",,,,,\n`;
    fs.appendFileSync(destinationFilePath, outputData);
  })
  .on("end", () => {
    console.log("Data extracted and saved to output.csv");
  });
