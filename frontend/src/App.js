import BubblePlot from "./BubblePlot";
import ScatterPlot from "./ScatterPlot";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useTable, useSortBy } from "react-table";
import Swal from "sweetalert2";

function App() {
  //Maintain state of players
  const [players, setPlayers] = useState([]);
  //Maintain state of selected columns
  const [selectedColumns, setSelectedColumns] = useState([
    "Name",
    "Age",
    "Nationality",
    "National_Position",
    "Club",
    "Club_Kit",
    "Height",
    "Preffered_Foot",
  ]);

  //Maintain state of all attributes in a Table.
  const [allAttributes, setAllAttributes] = useState([]);

  //Maintain state of selected Player
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  //List of x-axis attributes and y-axis attributes for scatter plot dropdown.
  const xAttributes = ["Age", "Composure"];
  const yAttributes = ["Rating", "Reactions", "Speed", "Stamina"];

  //Maintain state of selected attribute for Scatter Plot Visualization
  const [selectedX, setSelectedX] = useState(xAttributes[0]);
  const [selectedY, setSelectedY] = useState(yAttributes[0]);

  useEffect(() => {
    // Fetching players
    axios
      .get("http://127.0.0.1:5002/players")
      .then((response) => {
        setPlayers(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error("Error:", error));

    // Fetching attributes
    axios
      .get("http://127.0.0.1:5002/attributes")
      .then((response) => {
        setAllAttributes(response.data);
      })
      .catch((error) => console.error("Error fetching attributes:", error));
  }, []);

  // Function to add attribute to table
  const handleSelectChange = (event) => {
    const value = event.target.value;
    if (!selectedColumns.includes(value)) {
      setSelectedColumns((oldArray) => [...oldArray, value]);
      // Display SweetAlert2 message after table is added
      Swal.fire({
        title: "New Attribute Added",
        text: `${value} has been added successfully.`,
        icon: "success",
        timer: 2000,
      });
    }
  };
  // Parse String date time into date time object
  const parseDate = (str) => {
    const [day, month, year] = str.split("/").map((val) => parseInt(val, 10));
    return new Date(year, month - 1, day);
  };
  // Function to sort table based on date time
  const dateSort = (rowA, rowB, columnId) => {
    const dateA = parseDate(rowA.values[columnId]);
    const dateB = parseDate(rowB.values[columnId]);
    return dateA > dateB ? 1 : -1;
  };

  const columns = useMemo(
    () =>
      selectedColumns.map((column) => {
        const columnConfig = {
          Header: column.replace(/_/g, " "), //Replacing the _ in column name
          accessor: column,
        };
        if (column === "Birth_Date" || column === "Club_Joining") {
          columnConfig.sortType = dateSort; //Defining sorting as dateSort for date time attribute column
        }

        return columnConfig;
      }),
    [selectedColumns]
  );

  const data = useMemo(() => players, [players]);
  const tableInstance = useTable({ columns, data }, useSortBy); //Creating an table instance

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const handleRemoveColumn = (columnName) => {
    // Create a new array that excludes the columnName
    const updatedColumns = selectedColumns.filter(
      (column) => column !== columnName
    );
    // Update the state with this new array
    setSelectedColumns(updatedColumns);
    console.log(updatedColumns);
  };

  return (
    <>
      {" "}
      {/* Dropdowns for adding attributes */}
      <div
        style={{ marginTop: "20px", marginLeft: "25px", marginBottom: "-35px" }}
      >
        <h4>Add an Attribute to Table</h4>
        <select onChange={handleSelectChange}>
          <option value="">Select an attribute</option>
          {allAttributes
            .filter((attr) => !selectedColumns.includes(attr))
            .map((attr) => (
              <option key={attr} value={attr}>
                {attr}
              </option>
            ))}
        </select>
      </div>
      <div style={{ display: "flex" }}>
        <div>
          {/* Attributes Table*/}
          <h2 style={{ textAlign: "center" }}>Player Attributes Table</h2>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span style={{ marginLeft: "10px" }}>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? "🔽"
                            : "🔼"
                          : "↕️"}
                      </span>
                      <span
                        onClick={() => handleRemoveColumn(column.id)}
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                      >
                        ❌ {/* This is the remove icon/button */}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    onClick={() => setSelectedPlayer(row.original)}
                    style={{
                      background:
                        row.original === selectedPlayer ? "#d3d3d3" : "white",
                    }}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          {/* Attributes Visulaization*/}
          <h2 style={{ textAlign: "center" }}>Attributes Visualization</h2>
          {/* Dropdowns for selecting attributes */}
          <select
            value={selectedX}
            onChange={(e) => setSelectedX(e.target.value)}
            style={{ marginLeft: "40px" }}
          >
            {xAttributes.map((attr) => (
              <option key={attr} value={attr}>
                {attr}
              </option>
            ))}
          </select>

          <select
            value={selectedY}
            onChange={(e) => setSelectedY(e.target.value)}
          >
            {yAttributes.map((attr) => (
              <option key={attr} value={attr}>
                {attr}
              </option>
            ))}
          </select>

          <div
            style={{
              width: "600px",
              height: "600px",
              marginLeft: "20px",
              marginTop: "0px",
            }}
          >
            {/* Passing Prop to ScatterPlot and rendering the scatter graph*/}
            <ScatterPlot
              players={players}
              width={500}
              height={500}
              selectedPlayer={selectedPlayer}
              selectedX={selectedX}
              selectedY={selectedY}
            />
            {/* Passing Prop to BubblePlot and rendering the Bubble graph*/}
            <BubblePlot
              players={players}
              width={500}
              height={500}
              selectedPlayer={selectedPlayer}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
