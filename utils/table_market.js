module.exports = {
    columns: [
        { title: "City" },
        { title: "Quality" },
        { title: "Sell min price", options: { textAlign: "right" } },
        { title: "SMP time", options: { textAlign: "right" } },
        { title: "Buy max price", options: { textAlign: "right" } },
        { title: "BMP time", options: { textAlign: "right" } }
    ],
    options(title, subtitle) {
        return {
            borders: {
                header: { color: "#99AAB5", width: 1 }
            },
            header: { fontSize: 14, color: "#F6F6F6" },
            cell: { fontSize: 14, color: "#FFFFFF" },
            background: "#2C2F33",
            fit: true,
            subtitle: { fontSize: 14, color: "#FFFFFF", multiline: true, text: subtitle },
            title: { fontSize: 16, color: "#FFFFFF", multiline: true, text: title }
        }

    },
    PADDING: 20,
    ITEM_SIZE: 45,
    WIDTH: 700,
}