function Table() {

    var tableClasses = '',
        columnTitles,
        sortColumns;

    function table(selection) {
        selection.each(function(data)
        {
            var columns = Object.keys(data[0]);

            columnTitles = (columnTitles === undefined) ? columns : columnTitles;

            // Remove old table (change to update in future)
            $(this).html('');

            // Select the table, if it exists.
            var table = d3.select(this).selectAll("table").data([data]);

            // Otherwise, create the skeletal table.
            var tableEnter = table.enter().append("table").attr("class", tableClasses),
                theadEnter = tableEnter.append("thead"),
                tbodyEnter = tableEnter.append("tbody");

            // Append the header row
            var thead = table.select("thead")
                .append("tr")
                .selectAll("th")
                .data(columnTitles)
                .enter()
                 .append("th")
                    .text(function(column) { return column; });

            // Create a row for each object in the data.
            var tbody = table.select("tbody");
            var rows = tbody.selectAll("tr")
                .data(data)
                .enter()
                .append("tr");

            // Create a cell in each row for each column
            var cells = rows.selectAll("td")
                .data(function(row) {
                    return columns.map(function(column) {
                        return {column: column, value: row[column]};
                    });
                })
                .enter()
                .append("td")
                    .text(function(d) { return d.value; });
            
            return table;

        });
    }

    table.tableClasses = function(_) {
        if (!arguments.length) return tableClasses;
        tableClasses = _;
        return table;
    };

    table.columnTitles = function(_) {
        if (!arguments.length) return columnTitles;
        columnTitles = _;
        return table;
    };

    return table;
}