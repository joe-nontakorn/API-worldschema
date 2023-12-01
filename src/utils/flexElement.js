
exports.flexElement = (data) => {

    let flex = data.flex ?? 0

    let element = {
        "type": "box",
        "layout": "horizontal",
        "contents": [
            {
                "type": "text",
                "text": data.title,
                "size": "sm",
                "color": "#555555",
                "flex": flex
            },
            {
                "type": "text",
                "text": data.trailing,
                "size": "sm",
                "color": "#111111",
                "align": "end"
            }
        ]
    };


    return element
}




