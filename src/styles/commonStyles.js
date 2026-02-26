export const paperColor = "#fdfbf7"; // Paper-like background

export const toolStyle = {
    border: "1px solid #333",
    borderRadius: "4px",
    padding: "5px",
    margin: "5px",
    fontFamily: "monospace",
    backgroundColor: "#fff",
    cursor: "pointer",
};

export const activeToolStyle = {
    ...toolStyle,
    backgroundColor: "#ddd",
    fontWeight: "bold",
};

export const inputStyle = {
    ...toolStyle,
    cursor: "text"
};

export const containerStyle = {
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    width: "300px",
    margin: "auto",
    backgroundColor: paperColor,
    padding: "15px",
    fontFamily: "serif", // Paper feel
    color: "#333"
};

export const linkInputStyle = {
    ...inputStyle,
    height: "60px"
};

export const shortInputStyle = {
    ...inputStyle,
    width: "80px"
};

export const shorterInputStyle = {
    ...inputStyle,
    width: "60px"
};

// Layout helpers
export const rowToolbarStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
};

export const rowCenteredStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
};

export const colToolbarStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
};

export const centeredColStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

// Scrollable content display area (base — callers spread and add dynamic `color`)
export const contentDisplayStyle = {
    maxHeight: "50vh",
    overflow: "auto",
    marginTop: "20px",
    padding: "10px",
};

// HistoryManager-specific styles
export const historyContainerStyle = {
    ...containerStyle,
    width: "500px",
};

export const historyTitleStyle = {
    margin: "0 0 10px 0",
    fontFamily: "monospace",
    textAlign: "center",
};

export const historyListStyle = {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
};

export const historyEntryStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    padding: "6px 8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#fff",
    fontFamily: "monospace",
    fontSize: "12px",
};

export const historyEntryInfoStyle = {
    flex: 1,
    overflow: "hidden",
};

export const historyTimestampStyle = {
    color: "#888",
    fontSize: "11px",
};

export const historyUrlStyle = {
    wordBreak: "break-all",
    color: "#333",
};

export const emptyHistoryStyle = {
    textAlign: "center",
    color: "#888",
    fontFamily: "monospace",
    fontSize: "13px",
};

export const copyButtonBaseStyle = {
    ...toolStyle,
    margin: 0,
    whiteSpace: "nowrap",
    transition: "all 0.2s",
};
