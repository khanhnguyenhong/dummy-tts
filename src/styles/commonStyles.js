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
