export const detailStyle = {
    root: {
        margin: "30px auto",
        padding: '25px',
        width: "90%",
        boxSizing: "border-box"
    }
}

export const detailContentStyle = (theme) => {
    return {
        title: {
            fontSize: "18px",
            lineHeight: "30px",
            padding: "15px 0",
            fontWeight: "bolder"
        },
        label: {
            backgroundColor: theme.palette.primary[500],
            textAlign: "center",
            display: "inline-block",
            padding: "0 6px",
            color: "#fff",
            borderRadius: 3,
            marginRight: 10,
            fontSize: "16px"
        },
        publishInfo: {
            color: "#999",
            "& span": {
                fontSize: "12px",
                paddingLeft: "18px",
                lineHeight: "20px",
                position: "relative",
                "&::before": {
                    display: "inline-block",
                    content: "\"\"",
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    backgroundColor: "#999",
                    position: "absolute",
                    top: "7px",
                    left: "8px"
                },
                "& label": {
                    paddingRight: "5px"
                }
            }
        },
        content: {
            "& p": {
                lineHeight: "30px"
            }
        }
    }
}

export const replyStyle = {
    root: {
        margin: "30px auto",
        width: "90%",
        boxSizing: "border-box"
    }
}

export const replyContentStyle = {
    header: {
        backgroundColor: "#F6F6F6",
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "4px",
        padding: "10px 15px"
    }
}